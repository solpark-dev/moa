package com.moa.user.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CommonCheckResponse {
	private boolean available;
}
