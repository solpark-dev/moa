import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAdminUsers } from "@/api/adminUserApi";
import { useAdminUserStore } from "@/store/admin/adminUserStore";

const DEFAULT_DIR = "desc";

const normalizeSort = (sortStr) => {
  const map = { lastLoginDate: DEFAULT_DIR, regDate: DEFAULT_DIR };

  if (!sortStr) return map;

  const tokens = String(sortStr)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  for (let i = 0; i < tokens.length; i += 2) {
    const field = tokens[i];
    const dirRaw = (tokens[i + 1] || DEFAULT_DIR).toLowerCase();
    const dir = dirRaw === "asc" ? "asc" : "desc";

    if (field === "lastLoginDate" || field === "regDate") {
      map[field] = dir;
    }
  }

  return map;
};

const buildSort = (map) =>
  `lastLoginDate,${map.lastLoginDate},regDate,${map.regDate}`;

export const useAdminUserListLogic = () => {
  const navigate = useNavigate();

  const {
    users,
    page,
    size,
    sort,
    totalPages,
    totalCount,
    filters,
    loading,
    error,
    setFilter,
    setPage,
    setSort,
    setData,
    setLoading,
    setError,
    resetFilters,
  } = useAdminUserStore();

  const [searchValue, setSearchValue] = useState(filters.q || "");

  const loadUsers = async (override) => {
    try {
      setLoading(true);
      setError(null);

      const currentPage = override?.page ?? page;
      const currentSort = override?.sort ?? sort;
      const currentQ =
        override?.q !== undefined ? override.q : filters.q || undefined;

      const currentStatus =
        override?.status !== undefined ? override.status : filters.status;

      const currentJoinStart =
        override?.joinStart !== undefined
          ? override.joinStart
          : filters.joinStart;

      const currentJoinEnd =
        override?.joinEnd !== undefined ? override.joinEnd : filters.joinEnd;

      const params = {
        page: currentPage,
        size,
        sort: currentSort,
        q: currentQ || undefined,
        status: currentStatus === "ALL" ? undefined : currentStatus,
        regDateFrom: currentJoinStart || undefined,
        regDateTo: currentJoinEnd || undefined,
      };

      const body = await fetchAdminUsers(params);

      if (!body.success) {
        throw new Error(
          body.error?.message || "회원 목록 조회에 실패했습니다."
        );
      }

      setData(body.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    setFilter("q", value);
  };

  const handleSearchKeyDown = async (e) => {
    if (e.key !== "Enter") return;

    const trimmed = searchValue.trim();

    if (trimmed === "") {
      resetFilters();
      setSearchValue("");
      setPage(1);
      await loadUsers({ page: 1, q: undefined });
      return;
    }

    setPage(1);
    await loadUsers({ page: 1, q: trimmed });
  };

  const handleStatusChange = async (value) => {
    setFilter("status", value);
    setPage(1);
    await loadUsers({ page: 1, status: value });
  };

  const handleJoinStartChange = (value) => {
    setFilter("joinStart", value);
  };

  const handleJoinEndChange = (value) => {
    setFilter("joinEnd", value);
  };

  const handleSearchSubmit = async () => {
    const trimmed = searchValue.trim();
    setPage(1);
    await loadUsers({ page: 1, q: trimmed === "" ? undefined : trimmed });
  };

  const handlePageClick = async (pageNumber) => {
    if (pageNumber === page) return;
    setPage(pageNumber);
    await loadUsers({ page: pageNumber });
  };

  const handleSortToggle = async (field) => {
    const current = normalizeSort(sort);
    const nextDir = current[field] === "desc" ? "asc" : "desc";

    const nextMap = {
      ...current,
      [field]: nextDir,
    };

    const newSort = buildSort(nextMap);

    setSort(newSort);
    setPage(1);
    await loadUsers({ sort: newSort, page: 1 });
  };

  const changePageBlock = async (type) => {
    const total = totalPages || 1;
    const currentPage = page;
    let targetPage = currentPage;

    if (type === "first") targetPage = 1;
    else if (type === "last") targetPage = total;
    else if (type === "prevBlock") targetPage = Math.max(1, currentPage - 1);
    else if (type === "nextBlock")
      targetPage = Math.min(total, currentPage + 1);

    if (targetPage === currentPage) return;

    setPage(targetPage);
    await loadUsers({ page: targetPage });
  };

  const handleEmailClick = (userId) => {
    navigate(`/admin/users/${encodeURIComponent(userId)}`);
  };

  const handleReset = async () => {
    resetFilters();
    setSearchValue("");
    const base = normalizeSort(sort);
    const newSort = buildSort(base);
    setSort(newSort);
    setPage(1);
    await loadUsers({ page: 1, sort: newSort, q: undefined, status: "ALL" });
  };

  const getPageNumbers = () => {
    const pageUnit = 5;
    const currentBlock = Math.floor((page - 1) / pageUnit);
    const start = currentBlock * pageUnit + 1;
    const end = Math.min(start + pageUnit - 1, totalPages || 1);
    const pages = [];
    for (let p = start; p <= end; p += 1) pages.push(p);
    return pages;
  };

  const formatDate = (value) => {
    if (!value) return "-";
    return value.length > 10 ? value.substring(0, 10) : value;
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return {
    users,
    page,
    size,
    sort,
    totalPages,
    totalCount,
    filters,
    searchValue,
    loading,
    error,
    pageNumbers: getPageNumbers(),
    handlers: {
      handleSearchChange,
      handleSearchKeyDown,
      handleStatusChange,
      handleJoinStartChange,
      handleJoinEndChange,
      handleSearchSubmit,
      handlePageClick,
      handleSortToggle,
      changePageBlock,
      handleEmailClick,
      handleReset,
    },
    utils: { formatDate },
  };
};
