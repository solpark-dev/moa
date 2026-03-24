// src/hooks/user/useLoginHistory.js
import { useCallback, useEffect, useRef, useState } from "react";
import httpClient from "@/api/httpClient";

const formatDateTime = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("ko-KR");
};

const normalizeOptions = (value) => {
  if (typeof value === "number") {
    return { size: value };
  }
  if (!value) {
    return {};
  }
  return value;
};

export const useLoginHistory = (optionsOrSize = {}) => {
  const options = normalizeOptions(optionsOrSize);
  const enabled = Boolean(options.enabled ?? true);
  const initialSize = options.size ?? 10;

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(initialSize);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const sizeRef = useRef(initialSize);
  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  useEffect(() => {
    if (typeof options.size === "number" && options.size !== sizeRef.current) {
      setSize(options.size);
      sizeRef.current = options.size;
    }
  }, [options.size]);

  const controllerRef = useRef(null);
  const inFlightRef = useRef(false);

  const fetchPage = useCallback(
    async (targetPage = 1) => {
      if (!enabled) return;
      if (inFlightRef.current) return;

      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      inFlightRef.current = true;
      setLoading(true);

      try {
        const res = await httpClient.get("/users/login-history/me", {
          signal: controller.signal,
          params: {
            page: targetPage,
            size: sizeRef.current,
          },
        });

        const { success, data } = res || {};
        const payload = data?.data ?? data ?? {};

        if (!success || !payload) {
          setItems([]);
          setTotalCount(0);
          setPage(targetPage);
          return;
        }

        const content =
          payload.items ??
          payload.content ??
          payload.list ??
          payload.data ??
          payload ??
          [];
        const total =
          payload.total ??
          payload.totalCount ??
          payload.totalElements ??
          payload.pagination?.total ??
          content.length ??
          0;

        setItems(
          (Array.isArray(content) ? content : []).map((it) => ({
            ...it,
            loginAtFormatted: formatDateTime(
              it.loginAt || it.createdAt || it.dateTime
            ),
            successText:
              it.success === false || it.result === "FAIL" ? "?欠𤔅" : "?梓陬",
          }))
        );

        const nextPage = payload.page ?? payload.pageNumber ?? targetPage;
        setPage(nextPage);

        const nextSize =
          payload.size ??
          payload.pageSize ??
          sizeRef.current ??
          initialSize;
        if (nextSize !== sizeRef.current) {
          setSize(nextSize);
          sizeRef.current = nextSize;
        }

        setTotalCount(total);
      } catch (e) {
        if (controller.signal.aborted) {
          return;
        }
        console.error(e);
      } finally {
        setLoading(false);
        inFlightRef.current = false;
      }
    },
    [enabled, initialSize]
  );

  useEffect(() => {
    if (!enabled) {
      setItems([]);
      setTotalCount(0);
      return () => {
        controllerRef.current?.abort();
      };
    }

    fetchPage(1);

    return () => {
      controllerRef.current?.abort();
    };
  }, [enabled, fetchPage]);

  const pageCount = totalCount > 0 ? Math.ceil(totalCount / size) : 1;

  const blockSize = 5;
  const currentBlock = Math.floor((page - 1) / blockSize);
  const beginPage = currentBlock * blockSize + 1;
  const endPage = Math.min(beginPage + blockSize - 1, pageCount);

  const pages = [];
  for (let p = beginPage; p <= endPage; p += 1) {
    pages.push(p);
  }

  const goPage = (target) => {
    if (!enabled) return;
    if (target < 1 || target > pageCount || target === page) return;
    fetchPage(target);
  };

  const goFirst = () => goPage(1);
  const goPrev = () => goPage(page - 1);
  const goNextBlock = () => {
    if (endPage < pageCount) {
      goPage(endPage + 1);
    }
  };
  const goLast = () => goPage(pageCount);

  return {
    state: {
      items,
      page,
      size,
      totalCount,
      pageCount,
      pages,
      beginPage,
      endPage,
      loading,
      enabled,
    },
    actions: {
      goFirst,
      goPrev,
      goPage,
      goNextBlock,
      goLast,
      setSize,
      reload: () => fetchPage(page),
      refresh: () => fetchPage(page),
      fetch: () => fetchPage(page),
    },
  };
};
