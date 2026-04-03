package com.moa.user.domain;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Blacklist {
	private Long id;
	private String userId;
	private String reason;
	private String status;
	private String prevStatus;
	private LocalDateTime regDate;
	private LocalDateTime releaseDate;
}
