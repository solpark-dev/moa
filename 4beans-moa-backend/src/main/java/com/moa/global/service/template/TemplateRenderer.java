package com.moa.global.service.template;

import java.util.Map;

public interface TemplateRenderer {
	String render(String classpathTemplatePath, Map<String, String> variables);
}
