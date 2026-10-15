package com.example.demo.progress;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class ProgressControllerTests {

	@Autowired
	private ProgressController controller;

	@Test
	void chapterMovesThroughLectureReadAndCompleted() {
		controller.setStatus(5, Map.of("status", "LECTURE"));
		assertThat(controller.getProgress().get("lecture")).isEqualTo(List.of(5));

		controller.setStatus(5, Map.of("status", "READ"));
		assertThat(controller.getProgress().get("lecture")).isEmpty();
		assertThat(controller.getProgress().get("read")).isEqualTo(List.of(5));

		controller.setStatus(5, Map.of("status", "COMPLETED"));
		assertThat(controller.getProgress().get("completed")).isEqualTo(List.of(5));

		controller.setStatus(5, Map.of("status", "NONE"));
		assertThat(controller.getProgress().get("completed")).isEmpty();
	}
}
