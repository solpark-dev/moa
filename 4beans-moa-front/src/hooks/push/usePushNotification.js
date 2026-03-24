import { useState, useEffect, useCallback, useRef } from "react";
import pushApi from "@/api/pushApi";
import { useAuthStore } from "@/store/authStore";

export const usePushNotification = () => {
  const { accessToken, user } = useAuthStore();
  const isAdmin = user?.role === "ADMIN";

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [expandedId, setExpandedId] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const esRef = useRef(null);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await pushApi.getUnreadCount();
      setUnreadCount(response.count || 0);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  }, []);

  const fetchNotifications = useCallback(
    async (pageNum = 0, append = false) => {
      setIsLoading(true);
      try {
        const response = await pushApi.getMyPushList(pageNum, 10);
        const newData = response.content || [];

        setNotifications((prev) => {
          if (!append) return newData;

          const byId = new Map((prev || []).map((n) => [n.pushId, n]));
          (newData || []).forEach((n) => {
            if (!n?.pushId) return;
            if (!byId.has(n.pushId)) byId.set(n.pushId, n);
          });
          return Array.from(byId.values());
        });

        setHasMore(newData.length === 10);
        setPage(pageNum);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleToggleExpand = useCallback(
    async (pushId) => {
      if (expandedId === pushId) {
        setExpandedId("");
        return;
      }

      setExpandedId(pushId);

      const notification = (notifications || []).find(
        (n) => n.pushId === pushId
      );
      if (notification && notification.isRead === "N") {
        try {
          await pushApi.updateRead(pushId);
          setNotifications((prev) =>
            (prev || []).map((n) =>
              n.pushId === pushId ? { ...n, isRead: "Y" } : n
            )
          );
          setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
          console.error("Failed to mark as read:", error);
        }
      }
    },
    [expandedId, notifications]
  );

  const handleReadAll = useCallback(async () => {
    try {
      await pushApi.updateAllRead();
      setNotifications((prev) =>
        (prev || []).map((n) => ({ ...n, isRead: "Y" }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  }, []);

  const handleDelete = useCallback(
    async (pushId, e) => {
      e?.stopPropagation();
      try {
        await pushApi.deletePush(pushId);
        const target = (notifications || []).find((n) => n.pushId === pushId);
        setNotifications((prev) =>
          (prev || []).filter((n) => n.pushId !== pushId)
        );
        if (target?.isRead === "N") {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      } catch (error) {
        console.error("Failed to delete notification:", error);
      }
    },
    [notifications]
  );

  const handleDeleteAll = useCallback(async () => {
    try {
      await pushApi.deleteAllPushs();
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to delete all notifications:", error);
    }
  }, []);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchNotifications(page + 1, true);
    }
  }, [isLoading, hasMore, page, fetchNotifications]);

  const handleOpenChange = useCallback(
    (open) => {
      setIsOpen(open);
      if (open) {
        fetchNotifications(0, false);
      } else {
        setExpandedId("");
      }
    },
    [fetchNotifications]
  );

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  useEffect(() => {
    if (!accessToken || !user || isAdmin) return;

    if (esRef.current) return;

    const url = `/api/push/subscribe?token=${encodeURIComponent(accessToken)}`;
    const es = new EventSource(url);
    esRef.current = es;

    const onUnread = (e) => {
      try {
        const data = JSON.parse(e.data);
        setUnreadCount(data?.count || 0);
      } catch {}
    };

    const onPush = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (!data?.pushId) return;

        setNotifications((prev) => {
          const arr = Array.isArray(prev) ? prev : [];
          const filtered = arr.filter((n) => n?.pushId !== data.pushId);
          return [data, ...filtered];
        });
      } catch {}
    };

    es.addEventListener("unread-count", onUnread);
    es.addEventListener("push", onPush);

    es.onerror = () => {};

    return () => {
      try {
        es.removeEventListener("unread-count", onUnread);
        es.removeEventListener("push", onPush);
        es.close();
      } catch {}
      esRef.current = null;
    };
  }, [accessToken, user?.userId, isAdmin]);

  return {
    notifications,
    unreadCount,
    isLoading,
    isOpen,
    expandedId,
    hasMore,
    handleToggleExpand,
    handleReadAll,
    handleDelete,
    handleDeleteAll,
    handleLoadMore,
    handleOpenChange,
  };
};

export default usePushNotification;
