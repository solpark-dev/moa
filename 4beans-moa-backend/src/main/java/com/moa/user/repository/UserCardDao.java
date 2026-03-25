package com.moa.user.repository;

import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.moa.user.domain.UserCard;

@Mapper
public interface UserCardDao {
    int insertUserCard(UserCard userCard);

    Optional<UserCard> findByUserId(@Param("userId") String userId);

    int deleteUserCard(@Param("userId") String userId);
    int updateUserCard(UserCard userCard); // 추가
}
