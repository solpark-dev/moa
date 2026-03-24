import { useState, useEffect } from 'react';
import { getCategories } from '../../api/productApi';

const INITIAL_FORM_STATE = {
    productName: '',
    price: '',
    categoryId: '',
    image: '',
    productStatus: 'ACTIVE'
};

export const useProductForm = (initialData = null) => {
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [categories, setCategories] = useState([]);

    // 카테고리 로딩
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                if (response.success) {
                    setCategories(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };
        fetchCategories();
    }, []);

    // 데이터 초기화 (initialData가 있으면 해당 값으로, 없으면 초기값으로)
    useEffect(() => {
        if (initialData) {
            setFormData({
                productName: initialData.productName || '',
                price: initialData.price || '',
                categoryId: initialData.categoryId || '',
                image: initialData.image || '',
                productStatus: initialData.productStatus || 'ACTIVE'
            });
        } else {
            // initialData가 명시적으로 null/undefined일 때만 초기화 권장
            // 하지만 여기서는 간단히 처리
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData(INITIAL_FORM_STATE);
    };

    return {
        formData,
        setFormData,
        handleChange,
        categories,
        resetForm
    };
};
