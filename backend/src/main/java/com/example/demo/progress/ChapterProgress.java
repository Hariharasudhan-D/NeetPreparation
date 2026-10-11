package com.example.demo.progress;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "chapter_progress")
public class ChapterProgress {

	@Id
	private Integer chapterId;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private ChapterStatus status;

	@Column(nullable = false)
	private Instant updatedAt;

	protected ChapterProgress() {
	}

	public ChapterProgress(Integer chapterId, ChapterStatus status) {
		this.chapterId = chapterId;
		setStatus(status);
	}

	public Integer getChapterId() {
		return chapterId;
	}

	public ChapterStatus getStatus() {
		return status;
	}

	public void setStatus(ChapterStatus status) {
		this.status = status;
		this.updatedAt = Instant.now();
	}
}
