import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, AlertTriangle, Users } from "lucide-react";
import SortIcon from "./SortIcon";
import StatusBadge from "./StatusBadge";

/**
 * 회원 목록 테이블 카드
 * CSS 변수 기반 테마 적용
 */
export default function UserListTableCard({
  users,
  page,
  sort,
  totalPages,
  totalCount,
  filters,
  searchValue,
  loading,
  error,
  pageNumbers,
  handlers,
  formatDate,
}) {
  const {
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
  } = handlers;

  return (
    <section className="relative px-6 md:px-12 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[var(--theme-bg-card)] border border-[var(--theme-border-light)] shadow-[var(--theme-shadow)] rounded-3xl overflow-hidden">
          <Card className="border-0 shadow-none rounded-none">
            <CardHeader className="border-b border-[var(--theme-border-light)] bg-[var(--theme-bg-card)] p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <CardTitle className="text-xl md:text-2xl font-black text-[var(--theme-text)] flex items-center gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--theme-primary)] border border-[var(--theme-border-light)] shadow-[var(--theme-shadow)]">
                    <Users className="w-6 h-6 text-white" />
                  </span>
                  회원 목록
                  <span className="ml-1 text-sm md:text-base font-bold text-[var(--theme-text-muted)]">
                    {(totalCount ?? 0).toLocaleString()}명
                  </span>
                </CardTitle>

                <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-[var(--theme-text)]" />
                      <Select
                        value={filters.status}
                        onValueChange={handleStatusChange}
                      >
                        <SelectTrigger className="h-10 w-32 rounded-xl border border-[var(--theme-border-light)] shadow-[var(--theme-shadow)] bg-[var(--theme-bg-card)] text-[var(--theme-text)] focus:ring-0">
                          <SelectValue placeholder="회원상태" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL">전체</SelectItem>
                          <SelectItem value="ACTIVE">정상</SelectItem>
                          <SelectItem value="BLOCK">이용제한</SelectItem>
                          <SelectItem value="WITHDRAW">탈퇴</SelectItem>
                          <SelectItem value="PENDING">미인증</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        type="date"
                        className="h-10 w-40 text-xs rounded-xl border border-[var(--theme-border-light)] shadow-[var(--theme-shadow)] bg-[var(--theme-bg-card)] text-[var(--theme-text)] focus-visible:ring-0"
                        value={filters.joinStart}
                        onChange={(e) => handleJoinStartChange(e.target.value)}
                      />
                      <span className="text-xs font-black text-[var(--theme-text)]">~</span>
                      <Input
                        type="date"
                        className="h-10 w-40 text-xs rounded-xl border border-[var(--theme-border-light)] shadow-[var(--theme-shadow)] bg-[var(--theme-bg-card)] text-[var(--theme-text)] focus-visible:ring-0"
                        value={filters.joinEnd}
                        onChange={(e) => handleJoinEndChange(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-[var(--theme-text)]" />
                      <Input
                        className="pl-10 pr-3 h-10 text-sm rounded-xl border border-[var(--theme-border-light)] shadow-[var(--theme-shadow)] bg-[var(--theme-bg-card)] text-[var(--theme-text)] focus-visible:ring-0"
                        placeholder="이메일 검색..."
                        value={searchValue}
                        onChange={handleSearchChange}
                        onKeyDown={handleSearchKeyDown}
                      />
                    </div>

                    <Button
                      className="h-10 px-5 rounded-2xl bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] text-white font-black border border-[var(--theme-border-light)] shadow-[var(--theme-shadow)] transition"
                      onClick={handleSearchSubmit}
                    >
                      검색
                    </Button>

                    <Button
                      variant="outline"
                      className="h-10 px-4 rounded-2xl bg-[var(--theme-bg-card)] hover:bg-[var(--theme-primary-light)] text-[var(--theme-text)] font-black border border-[var(--theme-border-light)] shadow-[var(--theme-shadow)] transition"
                      onClick={handleReset}
                    >
                      초기화
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0 bg-[var(--theme-bg-card)]">
              {error && (
                <div className="px-6 py-4 flex items-center gap-2 bg-red-50 border-b border-[var(--theme-border-light)] text-sm text-red-600 font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              <div className="overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader className="bg-[var(--theme-primary-light)] border-b border-[var(--theme-border-light)]">
                    <TableRow>
                      <TableHead className="w-72 text-center text-[var(--theme-text)] text-sm font-black">
                        이메일(아이디)
                      </TableHead>
                      <TableHead className="w-32 text-center text-[var(--theme-text)] text-sm font-black">
                        회원상태
                      </TableHead>
                      <TableHead className="w-40 text-center p-0">
                        <Button
                          variant="ghost"
                          onClick={() => handleSortToggle("lastLoginDate")}
                          className="w-full h-full rounded-none hover:bg-[var(--theme-primary-light)] text-[var(--theme-text)] text-sm font-black flex items-center justify-center gap-1"
                        >
                          최근 로그인 일자
                          <SortIcon currentSort={sort} field="lastLoginDate" />
                        </Button>
                      </TableHead>
                      <TableHead className="w-40 text-center p-0">
                        <Button
                          variant="ghost"
                          onClick={() => handleSortToggle("regDate")}
                          className="w-full h-full rounded-none hover:bg-[var(--theme-primary-light)] text-[var(--theme-text)] text-sm font-black flex items-center justify-center gap-1"
                        >
                          가입일자
                          <SortIcon currentSort={sort} field="regDate" />
                        </Button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {loading &&
                      Array.from({ length: 5 }).map((_, idx) => (
                        <TableRow
                          key={idx}
                          className="border-b border-[var(--theme-border-light)]"
                        >
                          <TableCell className="py-4">
                            <Skeleton className="h-4 w-48" />
                          </TableCell>
                          <TableCell className="py-4 text-center">
                            <Skeleton className="h-4 w-16 mx-auto" />
                          </TableCell>
                          <TableCell className="py-4 text-center">
                            <Skeleton className="h-4 w-20 mx-auto" />
                          </TableCell>
                          <TableCell className="py-4 text-center">
                            <Skeleton className="h-4 w-20 mx-auto" />
                          </TableCell>
                        </TableRow>
                      ))}

                    {!loading && users.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="py-10 text-center text-sm text-[var(--theme-text-muted)] font-bold"
                        >
                          조회된 회원이 없습니다.
                        </TableCell>
                      </TableRow>
                    )}

                    {!loading &&
                      users.map((user) => (
                        <TableRow
                          key={user.userId}
                          className="hover:bg-[var(--theme-primary-light)] transition-colors border-b border-[var(--theme-border-light)]"
                        >
                          <TableCell className="py-3 text-sm text-center">
                            <button
                              type="button"
                              className={`w-full text-center font-black ${
                                user.blacklisted
                                  ? "text-red-600 hover:underline"
                                  : "text-[var(--theme-text)] hover:underline"
                              }`}
                              onClick={() => handleEmailClick(user.userId)}
                            >
                              {user.userId}
                            </button>
                          </TableCell>
                          <TableCell className="py-3 text-center">
                            <StatusBadge
                              status={user.status}
                              blacklisted={user.blacklisted}
                            />
                          </TableCell>
                          <TableCell className="py-3 text-center text-sm text-[var(--theme-text-muted)] font-bold">
                            {formatDate(user.lastLoginDate)}
                          </TableCell>
                          <TableCell className="py-3 text-center text-sm text-[var(--theme-text-muted)] font-bold">
                            {formatDate(user.regDate)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-5 border-t border-[var(--theme-border-light)] bg-[var(--theme-bg-card)]">
                <div className="text-xs text-[var(--theme-text-muted)] font-black">
                  페이지 {page} / {totalPages || 1}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 text-xs bg-[var(--theme-bg-card)] hover:bg-[var(--theme-primary-light)] text-[var(--theme-text)] font-black border border-[var(--theme-border-light)] shadow-[var(--theme-shadow)] transition rounded-2xl"
                    disabled={page <= 1}
                    onClick={() => changePageBlock("first")}
                  >
                    {"<<"}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 text-xs bg-[var(--theme-bg-card)] hover:bg-[var(--theme-primary-light)] text-[var(--theme-text)] font-black border border-[var(--theme-border-light)] shadow-[var(--theme-shadow)] transition rounded-2xl"
                    disabled={page <= 1}
                    onClick={() => changePageBlock("prevBlock")}
                  >
                    {"<"}
                  </Button>

                  {pageNumbers.map((p) => (
                    <Button
                      key={p}
                      variant={p === page ? "default" : "outline"}
                      size="icon"
                      className={`h-10 w-10 text-xs font-black border border-[var(--theme-border-light)] shadow-[var(--theme-shadow)] transition rounded-2xl ${
                        p === page
                          ? 'bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] text-white'
                          : 'bg-[var(--theme-bg-card)] hover:bg-[var(--theme-primary-light)] text-[var(--theme-text)]'
                      }`}
                      onClick={() => handlePageClick(p)}
                    >
                      {p}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 text-xs bg-[var(--theme-bg-card)] hover:bg-[var(--theme-primary-light)] text-[var(--theme-text)] font-black border border-[var(--theme-border-light)] shadow-[var(--theme-shadow)] transition rounded-2xl"
                    disabled={page >= (totalPages || 1)}
                    onClick={() => changePageBlock("nextBlock")}
                  >
                    {">"}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 text-xs bg-[var(--theme-bg-card)] hover:bg-[var(--theme-primary-light)] text-[var(--theme-text)] font-black border border-[var(--theme-border-light)] shadow-[var(--theme-shadow)] transition rounded-2xl"
                    disabled={page >= (totalPages || 1)}
                    onClick={() => changePageBlock("last")}
                  >
                    {">>"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
