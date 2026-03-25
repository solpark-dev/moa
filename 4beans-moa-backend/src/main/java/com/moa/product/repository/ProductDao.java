package com.moa.product.repository;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.moa.product.domain.Product;

@Mapper
public interface ProductDao {

	public void addProduct(Product product) throws Exception;

	public Product getProduct(int productId) throws Exception;

	public List<Product> getProductList() throws Exception;

	public void updateProduct(Product product) throws Exception;

	public void deleteProduct(int productId) throws Exception;

	public List<Product> getCategoryList() throws Exception;
}
