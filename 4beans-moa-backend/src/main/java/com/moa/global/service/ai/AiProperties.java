package com.moa.global.service.ai;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * AI 제공자 설정.
 *
 * 모델 교체 방법 (application.properties 또는 환경변수 한 줄):
 *   NVIDIA NIM  : ai.provider=nvidia_nim  / ai.base-url=https://integrate.api.nvidia.com/v1
 *   OpenRouter  : ai.provider=openrouter  / ai.base-url=https://openrouter.ai/api/v1
 *   OpenAI      : ai.provider=openai      / ai.base-url=https://api.openai.com/v1
 *
 * 모델명 예시:
 *   NVIDIA NIM  : meta/llama-3.1-8b-instruct, mistralai/mistral-7b-instruct-v0.3
 *   OpenRouter  : meta-llama/llama-3-8b-instruct:free, google/gemini-flash-1.5
 *   OpenAI      : gpt-4o-mini
 */
@Component
@ConfigurationProperties("ai")
public class AiProperties {

    private AiProvider provider = AiProvider.NVIDIA_NIM;
    private String baseUrl = "https://integrate.api.nvidia.com/v1";
    private String apiKey = "";
    private String model = "meta/llama-3.1-8b-instruct";
    private int timeoutSeconds = 30;
    private int maxTokens = 1024;
    private double temperature = 0.5;

    public AiProvider getProvider() { return provider; }
    public void setProvider(AiProvider provider) { this.provider = provider; }

    public String getBaseUrl() { return baseUrl; }
    public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }

    public String getApiKey() { return apiKey; }
    public void setApiKey(String apiKey) { this.apiKey = apiKey; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public int getTimeoutSeconds() { return timeoutSeconds; }
    public void setTimeoutSeconds(int timeoutSeconds) { this.timeoutSeconds = timeoutSeconds; }

    public int getMaxTokens() { return maxTokens; }
    public void setMaxTokens(int maxTokens) { this.maxTokens = maxTokens; }

    public double getTemperature() { return temperature; }
    public void setTemperature(double temperature) { this.temperature = temperature; }
}
