package com.moa.product.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.moa.party.domain.Party;
import com.moa.party.repository.PartyDao;
import com.moa.product.domain.Product;
import com.moa.product.repository.ProductDao;
import com.moa.product.service.ProductNameResolver;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductNameResolverImpl implements ProductNameResolver {

	private final ProductDao productDao;
	private final PartyDao partyDao;

	@Override
	public String getProductName(Integer productId) {
		if (productId == null)
			return "OTT 서비스";

		try {
			Product product = productDao.getProduct(productId);
			return (product != null && product.getProductName() != null) ? product.getProductName() : "OTT 서비스";
		} catch (Exception e) {
			log.warn("상품 조회 실패: productId={}", productId);
			return "OTT 서비스";
		}
	}

	@Override
	public String getProductNameByPartyId(Integer partyId) {
		try {
			Party party = partyDao.findById(partyId).orElse(null);
			if (party == null || party.getProductId() == null)
				return "OTT 서비스";
			return getProductName(party.getProductId());
		} catch (Exception e) {
			return "OTT 서비스";
		}
	}
}
