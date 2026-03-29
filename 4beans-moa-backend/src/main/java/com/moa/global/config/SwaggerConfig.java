package com.moa.global.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

	@Bean
	public OpenAPI moaOpenAPI() {
		return new OpenAPI()
			.info(new Info()
				.title("MOA API")
				.description("OTT 구독 파티 플랫폼 MOA REST API 문서\n\n" +
					"## 인증 방법\n" +
					"`POST /api/auth/login` 으로 로그인 후 응답의 `accessToken` 을 " +
					"우측 상단 **Authorize** 버튼에 입력하세요.")
				.version("v1.0.0")
				.contact(new Contact()
					.name("MOA Team")
					.email("no-reply@moamoa.cloud")))
			.addSecurityItem(new SecurityRequirement().addList("Bearer"))
			.components(new Components()
				.addSecuritySchemes("Bearer",
					new SecurityScheme()
						.type(SecurityScheme.Type.HTTP)
						.scheme("bearer")
						.bearerFormat("JWT")
						.description("로그인 후 발급된 JWT 토큰을 입력하세요.")));
	}
}
