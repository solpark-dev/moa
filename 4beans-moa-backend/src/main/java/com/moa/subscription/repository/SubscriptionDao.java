package com.moa.subscription.repository;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.moa.subscription.domain.Subscription;
import com.moa.subscription.dto.SubscriptionDTO;

@Mapper
public interface SubscriptionDao {

	public void addSubscription(Subscription subscription) throws Exception;

	public SubscriptionDTO getSubscription(int subscriptionId) throws Exception;

	public List<SubscriptionDTO> getSubscriptionList(String userId) throws Exception;

	public void updateSubscription(SubscriptionDTO subscription) throws Exception;
}
