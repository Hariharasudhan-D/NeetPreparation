package com.example.demo.progress;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

	private static final int CHAPTER_COUNT = 41;

	private final ChapterProgressRepository repository;

	public ProgressController(ChapterProgressRepository repository) {
		this.repository = repository;
	}

	/** Returns chapter ids in each section, oldest move first. */
	@GetMapping
	public Map<String, List<Integer>> getProgress() {
		return Map.of(
				"read", idsWithStatus(ChapterStatus.READ),
				"completed", idsWithStatus(ChapterStatus.COMPLETED));
	}

	/** Moves a chapter to READ or COMPLETED; status NONE sends it back to Chapters. */
	@PutMapping("/{chapterId}")
	public ResponseEntity<Void> setStatus(@PathVariable int chapterId, @RequestBody Map<String, String> body) {
		if (chapterId < 1 || chapterId > CHAPTER_COUNT) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
		String status = body.get("status");
		if ("NONE".equals(status)) {
			repository.deleteById(chapterId);
			return ResponseEntity.noContent().build();
		}
		ChapterStatus newStatus;
		try {
			newStatus = ChapterStatus.valueOf(status);
		} catch (IllegalArgumentException | NullPointerException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
		ChapterProgress progress = repository.findById(chapterId)
				.orElseGet(() -> new ChapterProgress(chapterId, newStatus));
		progress.setStatus(newStatus);
		repository.save(progress);
		return ResponseEntity.noContent().build();
	}

	private List<Integer> idsWithStatus(ChapterStatus status) {
		return repository.findByStatusOrderByUpdatedAtAsc(status).stream()
				.map(ChapterProgress::getChapterId)
				.toList();
	}
}
