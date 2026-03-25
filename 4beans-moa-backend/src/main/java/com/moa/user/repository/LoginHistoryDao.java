package com.moa.user.repository;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.moa.user.domain.LoginHistory;

@Mapper
public interface LoginHistoryDao {

	void insert(LoginHistory history);

	List<LoginHistory> findByUserId(@Param("userId") String userId, @Param("offset") int offset,
			@Param("limit") int limit);

	long countByUserId(@Param("userId") String userId);
}
