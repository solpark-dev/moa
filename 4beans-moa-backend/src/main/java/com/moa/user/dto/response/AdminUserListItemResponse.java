package com.moa.user.dto.response;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminUserListItemResponse {

	private String userId;
	private String nickname;
	private String status;
	private LocalDateTime lastLoginDate;
	private LocalDateTime regDate;
	private boolean blacklisted;
}
