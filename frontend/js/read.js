const list = document.getElementById("chapter-list");
const empty = document.getElementById("empty");

(async () => {
  const progress = await loadProgress(list);
  if (!progress) return;

  empty.hidden = progress.read.length > 0;

  // Submit moves the chapter to Completed; Remove sends it back to Chapters.
  const move = (status) => (id) => {
    moveChapter(id, status);
    empty.hidden = list.children.length > 1;
  };
  renderSelectableList(list, progress.read, [
    { button: document.getElementById("submit-btn"), onClick: move("COMPLETED") },
    { button: document.getElementById("remove-btn"), onClick: move("NONE") },
  ]);
})();
