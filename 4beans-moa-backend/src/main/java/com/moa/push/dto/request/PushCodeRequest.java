package com.moa.push.dto.request;

import com.moa.push.domain.PushCode;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PushCodeRequest {

    private String codeName;
    private String titleTemplate;
    private String contentTemplate;

    public PushCode toEntity() {
        return PushCode.builder()
                .codeName(this.codeName)
                .titleTemplate(this.titleTemplate)
                .contentTemplate(this.contentTemplate)
                .build();
    }
}