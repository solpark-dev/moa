package com.moa.push.service;

import com.moa.community.dto.response.PageResponse;
import com.moa.push.dto.request.AdminPushRequest;
import com.moa.push.dto.request.MultiPushRequest;
import com.moa.push.dto.request.PushCodeRequest;
import com.moa.push.dto.request.PushRequest;
import com.moa.push.dto.request.TemplatePushRequest;
import com.moa.push.dto.response.PushCodeResponse;
import com.moa.push.dto.response.PushResponse;

import java.util.List;
import java.util.Map;

public interface PushService {

    void addPush(PushRequest request);

    void addPushMulti(MultiPushRequest request);

    void addTemplatePush(TemplatePushRequest request);

    PushResponse getPush(Integer pushId);

    PageResponse<PushResponse> getPushList(int page, int size);

    PageResponse<PushResponse> getMyPushList(String receiverId, int page, int size);

    int getUnreadCount(String receiverId);

    void updateRead(Integer pushId);

    void updateAllRead(String receiverId);

    void deletePush(Integer pushId);

    void deleteAllPushs(String receiverId);

    List<PushCodeResponse> getPushCodeList();

    PushCodeResponse getPushCode(Integer pushCodeId);

    void addPushCode(PushCodeRequest request);

    void updatePushCode(Integer pushCodeId, PushCodeRequest request);

    void deletePushCode(Integer pushCodeId);

    PageResponse<PushResponse> getPushHistory(int page, int size, String pushCode, String receiverId, String startDate, String endDate);

    int sendAdminPush(AdminPushRequest request);

    List<Map<String, String>> searchUsersForPush(String keyword);

    int sendPushToAllUsers(AdminPushRequest request);
}