import UserSelectList from "../shared/UserSelectList";
import SendPushForm from "../forms/SendPushForm";

const SendTab = ({
    users,
    usersTotalCount,
    usersPage,
    usersTotalPages,
    selectedUsers,
    sendForm,
    isLoading,
    onSearch,
    onPageChange,
    onSelectUser,
    onSelectAll,
    onRemoveUser,
    onClearSelected,
    onFormChange,
    onSend,
    onSendToAll,
}) => {
    return (
        <div className="flex-1 flex min-h-0">
            <div className="w-1/2 border-r border-slate-100">
                <UserSelectList
                    users={users}
                    totalCount={usersTotalCount}
                    currentPage={usersPage}
                    totalPages={usersTotalPages}
                    selectedUsers={selectedUsers}
                    isLoading={isLoading}
                    onSearch={onSearch}
                    onPageChange={onPageChange}
                    onSelectUser={onSelectUser}
                    onSelectAll={onSelectAll}
                    onRemoveUser={onRemoveUser}
                    onClearSelected={onClearSelected}
                />
            </div>

            <div className="w-1/2">
                <SendPushForm
                    sendForm={sendForm}
                    selectedCount={selectedUsers.length}
                    isLoading={isLoading}
                    onFormChange={onFormChange}
                    onSend={onSend}
                    onSendToAll={onSendToAll}
                />
            </div>
        </div>
    );
};

export default SendTab;