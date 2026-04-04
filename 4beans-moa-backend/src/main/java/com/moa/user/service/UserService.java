package com.moa.user.service;

import java.util.Map;
import java.util.Optional;

import org.apache.ibatis.annotations.Param;
import org.springframework.web.multipart.MultipartFile;

import com.moa.user.domain.User;
import com.moa.community.dto.response.PageResponse;
import com.moa.user.dto.request.AdminUserSearchRequest;
import com.moa.user.dto.request.CommonCheckRequest;
import com.moa.user.dto.request.DeleteUserRequest;
import com.moa.user.dto.request.PasswordResetRequest;
import com.moa.user.dto.request.PasswordResetStartRequest;
import com.moa.user.dto.request.PasswordUpdateRequest;
import com.moa.user.dto.request.UserCreateRequest;
import com.moa.user.dto.request.UserUpdateRequest;
import com.moa.user.dto.response.AdminUserListItemResponse;
import com.moa.user.dto.response.CommonCheckResponse;
import com.moa.user.dto.response.PasswordResetTokenResponse;
import com.moa.user.dto.response.UserResponse;

public interface UserService {

	CommonCheckResponse check(CommonCheckRequest request);

	boolean existsByNickname(String nickname);

	void validatePasswordRule(String password);

	void validatePasswordConfirm(String password, String passwordConfirm);

	void startPasswordReset(PasswordResetStartRequest request);

	void resetPassword(PasswordResetRequest request);

	void updatePassword(String userId, PasswordUpdateRequest request);

	void checkCurrentPassword(String userId, String currentPassword);

	UserResponse addUser(UserCreateRequest request);

	Map<String, Object> addUserAndLogin(UserCreateRequest request);

	UserResponse getCurrentUser();

	User findUserIncludeDeleted(String userId);

	UserResponse updateUser(String userId, UserUpdateRequest request);

	String uploadProfileImage(String userId, MultipartFile file);

	void deleteCurrentUser(String userId, DeleteUserRequest request);

	void restoreUser(@Param("userId") String userId);

	void restoreByCertification(String userId, String phone, String ci);

	PageResponse<AdminUserListItemResponse> getAdminUserList(AdminUserSearchRequest request);

	UserResponse getUserDetailForAdmin(String userId);

	void unlockByCertification(String userId, String phone, String ci);

	Optional<User> findByPhone(String phone);
}
