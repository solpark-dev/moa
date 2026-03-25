package com.moa.chat.repository;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.moa.chat.domain.ChatKnowledge;

@Mapper
public interface ChatKnowledgeDao {

	List<ChatKnowledge> searchTop(@Param("keyword") String keyword, @Param("limit") int limit);

	List<ChatKnowledge> findAllWithEmbedding();

	void updateEmbedding(@Param("id") Long id, @Param("embedding") String embeddingJson);

	List<ChatKnowledge> searchByKeyword(@Param("keyword") String keyword);

	void insert(ChatKnowledge k);
}
