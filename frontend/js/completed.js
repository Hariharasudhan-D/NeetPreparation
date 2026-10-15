const list = document.getElementById("chapter-list");
const empty = document.getElementById("empty");
const congrats = document.getElementById("congrats");

const grid = document.getElementById("progress-grid");

// One small box per chapter, coloured by its section.
const cells = CHAPTERS.map((name, i) => {
  const cell = document.createElement("i");
  cell.className = "cell";
  cell.title = `${i + 1}. ${name}`;
  grid.appendChild(cell);
  return cell;
});

function setCell(id, state) {
  cells[id - 1].className = state ? `cell ${state}` : "cell";
}

function updateMessage(count) {
  const percent = Math.round((count / CHAPTERS.length) * 100);
  document.getElementById("progress-count").textContent = count;
  document.getElementById("progress-percent").textContent = `${percent}%`;
  empty.hidden = count > 0;
  congrats.hidden = count === 0;
  congrats.textContent = count === CHAPTERS.length
    ? "🎉 Congratulations! You have completed all chapters!"
    : `🎉 Congratulations! You have completed ${count} of ${CHAPTERS.length} chapters. Keep it up!`;
}

(async () => {
  const progress = await loadProgress(list);
  if (!progress) return;

  progress.lecture.forEach((id) => setCell(id, "lecture"));
  progress.read.forEach((id) => setCell(id, "read"));
  progress.completed.forEach((id) => setCell(id, "completed"));
  updateMessage(progress.completed.length);

  // Double-click selects (so a stray click can't lead to a removal);
  // Remove sends the chapter back to Read.
  renderSelectableList(list, progress.completed, [{
    button: document.getElementById("remove-btn"),
    onClick: (id) => {
      moveChapter(id, "READ");
      setCell(id, "read");
      updateMessage(list.children.length - 1);
    },
  }], "dblclick");
})();
