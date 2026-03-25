package com.moa.product.service;

import com.moa.product.dto.ProductDTO;
import java.util.List;

public interface ProductService {

    public void addProduct(ProductDTO productDTO) throws Exception;

    public ProductDTO getProduct(int productId) throws Exception;

    public List<ProductDTO> getProductList() throws Exception;

    public void updateProduct(ProductDTO productDTO) throws Exception;

    public void deleteProduct(int productId) throws Exception;

    public List<ProductDTO> getCategoryList() throws Exception;
}
