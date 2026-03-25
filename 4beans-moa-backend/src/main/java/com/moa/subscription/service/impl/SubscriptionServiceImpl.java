package com.moa.subscription.service.impl;

import com.moa.subscription.repository.SubscriptionDao;
import com.moa.subscription.domain.Subscription;
import com.moa.subscription.dto.SubscriptionDTO;
import com.moa.subscription.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SubscriptionServiceImpl implements SubscriptionService {

    @Autowired
    private SubscriptionDao subscriptionDao;

    @Override
    public void addSubscription(SubscriptionDTO subscriptionDTO) throws Exception {
        Subscription subscription = subscriptionDTO.toEntity();
        subscriptionDao.addSubscription(subscription);
    }

    @Override
    public SubscriptionDTO getSubscription(int subscriptionId) throws Exception {
        return subscriptionDao.getSubscription(subscriptionId);
    }

    @Override
    public List<SubscriptionDTO> getSubscriptionList(String userId) throws Exception {
        return subscriptionDao.getSubscriptionList(userId);
    }

    @Override
    public void updateSubscription(SubscriptionDTO subscriptionDTO) throws Exception {
        subscriptionDao.updateSubscription(subscriptionDTO);
    }

    @Override
    public void cancelSubscription(int subscriptionId) throws Exception {
        SubscriptionDTO subscription = subscriptionDao.getSubscription(subscriptionId);
        if (subscription != null) {
            subscription.setSubscriptionStatus("CANCELLED");
            subscriptionDao.updateSubscription(subscription);
        }
    }
}
