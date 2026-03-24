package com.moa.config;

import java.nio.file.Paths;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@MapperScan(basePackages = "com.moa.dao")
public class WebConfig implements WebMvcConfigurer {

	@Value("${app.upload.user.profile-dir}")
	private String profileUploadDir;

	@Value("${app.upload.user.profile-url-prefix}")
	private String profileUrlPrefix;

	@Value("${app.upload.product-image-dir}")
	private String productImageUploadDir;

	@Value("${app.upload.product-image-url-prefix}")
	private String productImageUrlPrefix;

	@Value("${app.upload.community.inquiry-dir}")
	private String communityInquiryDir;

	@Value("${app.upload.community.inquiry-url-prefix}")
	private String communityInquiryUrlPrefix;

	@Value("${app.upload.community.answer-dir}")
	private String communityAnswerDir;

	@Value("${app.upload.community.answer-url-prefix}")
	private String communityAnswerUrlPrefix;

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {

		registry.addResourceHandler(profileUrlPrefix + "/**").addResourceLocations(getUriPath(profileUploadDir));

		registry.addResourceHandler(productImageUrlPrefix + "/**")
				.addResourceLocations(getUriPath(productImageUploadDir));

		registry.addResourceHandler(communityInquiryUrlPrefix + "/**")
				.addResourceLocations(getUriPath(communityInquiryDir));

		registry.addResourceHandler(communityAnswerUrlPrefix + "/**")
				.addResourceLocations(getUriPath(communityAnswerDir));
	}

	private String getUriPath(String path) {
		String uri = Paths.get(path).toAbsolutePath().normalize().toUri().toString();

		return uri.endsWith("/") ? uri : uri + "/";
	}

	@Override
	public void addViewControllers(ViewControllerRegistry registry) {

		registry.addViewController("/{path:^(?!api|oauth|uploads|assets|css|js|images|favicon\\.ico|index\\.html).*$}")
				.setViewName("index.html");
	}
}