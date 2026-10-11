package com.example.demo.progress;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ChapterProgressRepository extends JpaRepository<ChapterProgress, Integer> {

	List<ChapterProgress> findByStatusOrderByUpdatedAtAsc(ChapterStatus status);
}
