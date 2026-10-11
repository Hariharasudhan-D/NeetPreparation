const list = document.getElementById("chapter-list");
const empty = document.getElementById("empty");
const congrats = document.getElementById("congrats");

const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");

function updateMessage(count) {
  const percent = Math.round((count / CHAPTERS.length) * 100);
  progressText.textContent = `${percent}% · ${count}/${CHAPTERS.length} chapters`;
  progressFill.style.width = `${percent}%`;
  empty.hidden = count > 0;
  congrats.hidden = count === 0;
  congrats.textContent = count === CHAPTERS.length
    ? "🎉 Congratulations! You have completed all chapters!"
    : `🎉 Congratulations! You have completed ${count} of ${CHAPTERS.length} chapters. Keep it up!`;
}

(async () => {
  const progress = await loadProgress(list);
  if (!progress) return;

  updateMessage(progress.completed.length);

  // Double-click selects (so a stray click can't lead to a removal);
  // Remove sends the chapter back to Read.
  renderSelectableList(list, progress.completed, [{
    button: document.getElementById("remove-btn"),
    onClick: (id) => {
      moveChapter(id, "READ");
      updateMessage(list.children.length - 1);
    },
  }], "dblclick");
})();
