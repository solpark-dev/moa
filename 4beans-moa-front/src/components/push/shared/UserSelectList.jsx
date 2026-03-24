import { useState } from "react";
import { Search, X, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

/**
 * 사용자 선택 목록 컴포넌트
 * CSS 변수 기반 테마 적용
 */

const UserSelectList = ({
    users = [],
    totalCount = 0,
    currentPage = 1,
    totalPages = 1,
    selectedUsers = [],
    isLoading,
    onSearch,
    onPageChange,
    onSelectUser,
    onSelectAll,
    onRemoveUser,
    onClearSelected,
}) => {
    const [searchKeyword, setSearchKeyword] = useState("");

    const handleSearch = () => {
        if (onSearch) {
            onSearch(searchKeyword);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const isAllCurrentPageSelected = users.length > 0 &&
        users.every((user) => selectedUsers.some((s) => s.userId === user.userId));

    const handleSelectAllChange = (checked) => {
        if (onSelectAll && typeof onSelectAll === "function") {
            onSelectAll(users, checked);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="px-4 py-3 border-b border-[var(--theme-border-light)] bg-[var(--theme-bg-card)] flex-shrink-0">
                <p className="text-sm font-medium text-[var(--theme-primary)]">수신자 선택</p>
            </div>

            <div className="px-4 py-3 border-b border-[var(--theme-border-light)] flex-shrink-0">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--theme-text-muted)]" />
                        <Input
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="이름, 이메일로 검색"
                            className="pl-9 focus:ring-[var(--theme-primary)] focus:border-[var(--theme-primary)]"
                        />
                    </div>
                    <Button onClick={handleSearch} size="sm" className="bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] text-white">
                        검색
                    </Button>
                </div>
            </div>

            <div className="px-4 py-2 border-b border-[var(--theme-border-light)] flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="selectAll"
                        checked={isAllCurrentPageSelected}
                        onCheckedChange={handleSelectAllChange}
                        className="border-[var(--theme-border-light)] data-[state=checked]:bg-[var(--theme-primary)] data-[state=checked]:border-[var(--theme-primary)]"
                    />
                    <label htmlFor="selectAll" className="text-sm text-[var(--theme-text)] cursor-pointer">
                        현재 페이지 전체 선택
                    </label>
                </div>
                <span className="text-xs text-[var(--theme-text-muted)]">총 {totalCount}명</span>
            </div>

            <ScrollArea className="flex-1">
                <div className="divide-y divide-[var(--theme-border-light)]">
                    {users.map((user) => {
                        const isSelected = selectedUsers.some((s) => s.userId === user.userId);
                        return (
                            <div
                                key={user.userId}
                                className="px-4 py-3 flex items-center gap-3 hover:bg-[var(--theme-primary-light)] cursor-pointer"
                                onClick={() => onSelectUser && onSelectUser(user)}
                            >
                                <Checkbox
                                    checked={isSelected}
                                    className="border-[var(--theme-border-light)] data-[state=checked]:bg-[var(--theme-primary)] data-[state=checked]:border-[var(--theme-primary)]"
                                />
                                <div className="w-8 h-8 rounded-full bg-[var(--theme-primary-light)] flex items-center justify-center">
                                    <Users className="w-4 h-4 text-[var(--theme-primary)]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[var(--theme-text)] truncate">
                                        {user.nickname}
                                    </p>
                                    <p className="text-xs text-[var(--theme-text-muted)] truncate">{user.userId}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>

            {totalPages > 1 && (
                <div className="px-4 py-2 border-t border-[var(--theme-border-light)] flex-shrink-0">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => onPageChange && onPageChange(Math.max(1, currentPage - 1))}
                                    className={`${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} hover:bg-[var(--theme-primary-light)]`}
                                />
                            </PaginationItem>
                            {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                const page = i + 1;
                                return (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            onClick={() => onPageChange && onPageChange(page)}
                                            isActive={currentPage === page}
                                            className={`cursor-pointer ${currentPage === page ? 'bg-[var(--theme-primary)] text-white hover:bg-[var(--theme-primary-hover)]' : 'hover:bg-[var(--theme-primary-light)]'}`}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => onPageChange && onPageChange(Math.min(totalPages, currentPage + 1))}
                                    className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} hover:bg-[var(--theme-primary-light)]`}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}

            {selectedUsers.length > 0 && (
                <div className="px-4 py-3 border-t border-[var(--theme-border-light)] bg-[var(--theme-bg-card)] flex-shrink-0">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[var(--theme-primary)]">
                            선택된 수신자 ({selectedUsers.length}명)
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClearSelected}
                            className="text-xs text-[var(--theme-text-muted)] h-6 px-2"
                        >
                            전체 해제
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                        {selectedUsers.map((user) => (
                            <Badge
                                key={user.userId}
                                variant="secondary"
                                className="pl-2 pr-1 py-0.5 flex items-center gap-1 bg-[var(--theme-primary-light)] text-[var(--theme-primary)]"
                            >
                                <span className="text-xs">{user.nickname}</span>
                                <X
                                    className="w-3 h-3 cursor-pointer hover:text-[var(--theme-primary-hover)]"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemoveUser && onRemoveUser(user.userId);
                                    }}
                                />
                            </Badge>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserSelectList;