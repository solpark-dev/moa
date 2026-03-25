package com.moa.push.dto.request;

import com.moa.push.domain.Push;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PushRequest {
    
    private String receiverId;
    private String pushCode;
    private String title;
    private String content;
    private String moduleId;
    private String moduleType;
    
    public Push toEntity() {
        return Push.builder()
                .receiverId(this.receiverId)
                .pushCode(this.pushCode)
                .title(this.title)
                .content(this.content)
                .moduleId(this.moduleId)
                .moduleType(this.moduleType)
                .build();
    }
}