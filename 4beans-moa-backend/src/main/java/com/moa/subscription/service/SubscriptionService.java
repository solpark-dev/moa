package com.moa.subscription.service;

import com.moa.subscription.dto.SubscriptionDTO;
import java.util.List;

public interface SubscriptionService {

    public void addSubscription(SubscriptionDTO subscriptionDTO) throws Exception;

    public SubscriptionDTO getSubscription(int subscriptionId) throws Exception;

    public List<SubscriptionDTO> getSubscriptionList(String userId) throws Exception;

    public void updateSubscription(SubscriptionDTO subscriptionDTO) throws Exception;

    public void cancelSubscription(int subscriptionId) throws Exception;
}
