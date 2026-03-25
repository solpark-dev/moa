package com.moa.admin.repository;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.moa.user.domain.Blacklist;
import com.moa.user.dto.request.AdminUserSearchRequest;
import com.moa.user.dto.response.AdminUserListItemResponse;

@Mapper
public interface AdminDao {

	long countAdminUsers(AdminUserSearchRequest request);

	List<AdminUserListItemResponse> findAdminUsers(AdminUserSearchRequest request);

	void insertBlacklist(@Param("userId") String userId, @Param("reason") String reason);

	Blacklist findActiveBlacklistByUserId(@Param("userId") String userId);

	int deactivateBlacklist(@Param("userId") String userId, @Param("deleteReason") String deleteReason);
}
