package com.moa.product.service;

public interface ProductNameResolver {
	String getProductName(Integer productId);

	String getProductNameByPartyId(Integer partyId);
}
