package com.moa.web.subscription;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.moa.dto.subscription.SubscriptionDTO;
import com.moa.service.subscription.SubscriptionService;

@RestController
@RequestMapping("/api/subscription")
public class SubscriptionRestController {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private SubscriptionService subscriptionService;

    // @PostMapping
    // public void addSubscription(@RequestBody SubscriptionDTO subscriptionDTO)
    // throws Exception {
    // logger.debug("Request [addSubscription] Time: {}, Content: {}",
    // java.time.LocalDateTime.now(), subscriptionDTO);
    // subscriptionService.addSubscription(subscriptionDTO);
    // }
    @PostMapping
    public ResponseEntity<?> addSubscription(@RequestBody SubscriptionDTO subscriptionDTO) throws Exception {
        logger.debug("Request [addSubscription] Time: {}, Content: {}", java.time.LocalDateTime.now(), subscriptionDTO);
        subscriptionService.addSubscription(subscriptionDTO);

        // 성공 응답 반환
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "구독이 성공적으로 신청되었습니다."));
    }

    @GetMapping("/{subscriptionId}")
    public SubscriptionDTO getSubscription(@PathVariable int subscriptionId) throws Exception {
        logger.debug("Request [getSubscription] Time: {}, subscriptionId: {}", java.time.LocalDateTime.now(),
                subscriptionId);
        return subscriptionService.getSubscription(subscriptionId);
    }

    @GetMapping
    public List<SubscriptionDTO> getSubscriptionList(
            @org.springframework.web.bind.annotation.RequestParam String userId) throws Exception {
        logger.debug("Request [getSubscriptionList] Time: {}, userId: {}", java.time.LocalDateTime.now(), userId);
        return subscriptionService.getSubscriptionList(userId);
    }

    @PutMapping
    public void updateSubscription(@RequestBody SubscriptionDTO subscriptionDTO) throws Exception {
        logger.debug("Request [updateSubscription] Time: {}, Content: {}", java.time.LocalDateTime.now(),
                subscriptionDTO);
        subscriptionService.updateSubscription(subscriptionDTO);
    }

    @PostMapping("/{subscriptionId}/cancel")
    public void cancelSubscription(@PathVariable int subscriptionId) throws Exception {
        logger.debug("Request [cancelSubscription] Time: {}, subscriptionId: {}", java.time.LocalDateTime.now(),
                subscriptionId);
        subscriptionService.cancelSubscription(subscriptionId);
    }
}
