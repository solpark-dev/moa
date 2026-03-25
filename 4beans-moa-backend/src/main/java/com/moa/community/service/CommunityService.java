package com.moa.community.service;

import com.moa.community.dto.request.*;
import com.moa.community.dto.response.*;
import org.springframework.web.multipart.MultipartFile;

public interface CommunityService {
    
    PageResponse<NoticeResponse> getNoticeList(int page, int size);
    
    NoticeResponse getNotice(Integer communityId);
    
    void addNotice(NoticeRequest request);
    
    void updateNotice(Integer communityId, NoticeRequest request);
    
    PageResponse<NoticeResponse> searchNotice(String keyword, int page, int size);
    
    PageResponse<FaqResponse> getFaqList(int page, int size);
    
    FaqResponse getFaq(Integer communityId);
    
    void addFaq(FaqRequest request);
    
    void updateFaq(Integer communityId, FaqRequest request);
    
    PageResponse<FaqResponse> searchFaq(String keyword, int page, int size);
    
    PageResponse<InquiryResponse> getMyInquiryList(String userId, int page, int size);
    
    PageResponse<InquiryResponse> getInquiryList(int page, int size);
    
    InquiryResponse getInquiry(Integer communityId);
    
    void addInquiry(InquiryRequest request);
    
    void addAnswer(AnswerRequest request);
    
    void updateAnswer(AnswerRequest request);
}