import { useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, FileText, History, Send } from "lucide-react";
import { useAdminPush } from "@/hooks/push/useAdminPush";
import TemplatesTab from "./admin/TemplatesTab";
import HistoryTab from "./admin/HistoryTab";
import SendTab from "./admin/SendTab";
import TemplateForm from "./forms/TemplateForm";

/**
 * 관리자 푸시 알림 모달
 * CSS 변수 기반 테마 적용
 */

const AdminPushModal = ({ isOpen, onClose }) => {
    // body 스크롤 강제 허용
    useEffect(() => {
        if (isOpen) {
            const style = document.createElement('style');
            style.id = 'admin-push-modal-scroll-override';
            style.innerHTML = `
                html, body, [data-scroll-locked] {
                    overflow: auto !important;
                    overflow-y: auto !important;
                    padding-right: 0 !important;
                    margin-right: 0 !important;
                    position: static !important;
                    touch-action: auto !important;
                    -webkit-overflow-scrolling: touch !important;
                }
            `;
            document.head.appendChild(style);
            document.body.setAttribute('data-scroll-locked', '0');
            document.documentElement.style.setProperty('overflow', 'auto', 'important');
            document.body.style.setProperty('overflow', 'auto', 'important');
        }
        return () => {
            const style = document.getElementById('admin-push-modal-scroll-override');
            if (style) style.remove();
            document.documentElement.style.removeProperty('overflow');
            document.body.style.removeProperty('overflow');
        };
    }, [isOpen]);

    const {
        activeTab,
        setActiveTab,
        isLoading,
        templates,
        editingTemplate,
        isTemplateModalOpen,
        setIsTemplateModalOpen,
        handleAddTemplate,
        handleEditTemplate,
        handleSaveTemplate,
        handleDeleteTemplate,
        setEditingTemplate,
        history,
        historyPage,
        historyTotalPages,
        historyTotalCount,
        historyPageSize,
        historyFilters,
        handleHistoryFilterChange,
        handleHistorySearch,
        handleHistoryPageChange,
        handleHistoryPageSizeChange,
        users,
        usersTotalCount,
        usersPage,
        usersTotalPages,
        selectedUsers,
        sendForm,
        handleUserSearch,
        handleUsersPageChange,
        handleSelectUser,
        handleSelectAllUsers,
        handleRemoveUser,
        handleClearSelectedUsers,
        handleSendFormChange,
        handleSendPush,
        handleSendToAll,
    } = useAdminPush();

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
                <DialogContent allowScroll className="max-w-4xl h-[700px] p-0 flex flex-col bg-[var(--theme-bg-card)]">
                    <DialogHeader className="px-6 py-4 border-b border-[var(--theme-border-light)] bg-[var(--theme-bg-card)] flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[var(--theme-primary-light)] flex items-center justify-center">
                                <Bell className="w-5 h-5 text-[var(--theme-primary)]" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-semibold text-[var(--theme-primary)]">
                                    푸시 알림 관리
                                </DialogTitle>
                                <p className="text-sm text-[var(--theme-text-muted)]">
                                    템플릿 관리 · 발송 내역 · 수동 발송
                                </p>
                            </div>
                        </div>
                    </DialogHeader>

                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="flex-1 flex flex-col min-h-0"
                    >
                        <div className="px-6 border-b border-[var(--theme-border-light)] flex-shrink-0">
                            <TabsList className="bg-transparent h-12 p-0 gap-1">
                                <TabsTrigger
                                    value="templates"
                                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[var(--theme-primary)] data-[state=active]:text-[var(--theme-primary)] rounded-none px-4 h-12"
                                >
                                    <FileText className="w-4 h-4 mr-2" />
                                    템플릿 관리
                                </TabsTrigger>
                                <TabsTrigger
                                    value="history"
                                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[var(--theme-primary)] data-[state=active]:text-[var(--theme-primary)] rounded-none px-4 h-12"
                                >
                                    <History className="w-4 h-4 mr-2" />
                                    발송 내역
                                </TabsTrigger>
                                <TabsTrigger
                                    value="send"
                                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[var(--theme-primary)] data-[state=active]:text-[var(--theme-primary)] rounded-none px-4 h-12"
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    수동 발송
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="flex-1 min-h-0 flex flex-col">
                            {activeTab === "templates" && (
                                <TemplatesTab
                                    templates={templates}
                                    isLoading={isLoading}
                                    onAdd={handleAddTemplate}
                                    onEdit={handleEditTemplate}
                                    onDelete={handleDeleteTemplate}
                                />
                            )}

                            {activeTab === "history" && (
                                <HistoryTab
                                    history={history}
                                    page={historyPage}
                                    totalPages={historyTotalPages}
                                    totalCount={historyTotalCount}
                                    pageSize={historyPageSize}
                                    filters={historyFilters}
                                    templates={templates}
                                    isLoading={isLoading}
                                    onFilterChange={handleHistoryFilterChange}
                                    onSearch={handleHistorySearch}
                                    onPageChange={handleHistoryPageChange}
                                    onPageSizeChange={handleHistoryPageSizeChange}
                                />
                            )}

                            {activeTab === "send" && (
                                <SendTab
                                    users={users}
                                    usersTotalCount={usersTotalCount}
                                    usersPage={usersPage}
                                    usersTotalPages={usersTotalPages}
                                    selectedUsers={selectedUsers}
                                    sendForm={sendForm}
                                    isLoading={isLoading}
                                    onSearch={handleUserSearch}
                                    onPageChange={handleUsersPageChange}
                                    onSelectUser={handleSelectUser}
                                    onSelectAll={handleSelectAllUsers}
                                    onRemoveUser={handleRemoveUser}
                                    onClearSelected={handleClearSelectedUsers}
                                    onFormChange={handleSendFormChange}
                                    onSend={handleSendPush}
                                    onSendToAll={handleSendToAll}
                                />
                            )}
                        </div>
                    </Tabs>
                </DialogContent>
            </Dialog>

            <TemplateForm
                isOpen={isTemplateModalOpen}
                onClose={() => {
                    setIsTemplateModalOpen(false);
                    setEditingTemplate(null);
                }}
                template={editingTemplate}
                onSave={handleSaveTemplate}
                isLoading={isLoading}
            />
        </>
    );
};

export default AdminPushModal;