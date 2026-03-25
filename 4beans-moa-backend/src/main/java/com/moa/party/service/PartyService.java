package com.moa.party.service;

import java.util.List;

import com.moa.party.dto.request.PartyCreateRequest;
import com.moa.party.dto.request.UpdateOttAccountRequest;
import com.moa.party.dto.response.PartyDetailResponse;
import com.moa.party.dto.response.PartyListResponse;
import com.moa.party.dto.partymember.response.PartyMemberResponse;
import com.moa.payment.dto.request.PaymentRequest;

public interface PartyService {

	PartyDetailResponse createParty(String userId, PartyCreateRequest request);

	PartyDetailResponse processLeaderDeposit(Integer partyId, String userId, PaymentRequest paymentRequest);

	PartyDetailResponse getPartyDetail(Integer partyId, String userId);

	List<PartyListResponse> getPartyList(Integer productId, String partyStatus, String keyword,
			java.time.LocalDate startDate, int page, int size, String sort);

	PartyDetailResponse updateOttAccount(Integer partyId, String userId, UpdateOttAccountRequest request);

	PartyMemberResponse joinParty(Integer partyId, String userId, PaymentRequest paymentRequest);

	List<PartyMemberResponse> getPartyMembers(Integer partyId);

	void leaveParty(Integer partyId, String userId);

	List<PartyListResponse> getMyParties(String userId, boolean includeClosed);

	List<PartyListResponse> getMyLeadingParties(String userId, boolean includeClosed);

	List<PartyListResponse> getMyParticipatingParties(String userId, boolean includeClosed);

	List<PartyListResponse> getMyClosedParties(String userId);

	void closeParty(Integer partyId, String reason);

	void cancelExpiredParty(Integer partyId, String reason);
}