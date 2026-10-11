const list = document.getElementById("chapter-list");
const empty = document.getElementById("empty");

(async () => {
  const progress = await loadProgress(list);
  if (!progress) return;

  const taken = [...progress.read, ...progress.completed];
  const pending = CHAPTERS.map((_, i) => i + 1).filter((id) => !taken.includes(id));
  empty.hidden = pending.length > 0;

  // Submit adds the chapter to Read and stays on this page.
  renderSelectableList(list, pending, [{
    button: document.getElementById("submit-btn"),
    onClick: (id) => {
      moveChapter(id, "READ");
      empty.hidden = list.children.length > 1;
    },
  }]);
})();
