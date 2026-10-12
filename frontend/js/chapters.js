// Temporary local data; will come from the backend (Supabase) later.
const CHAPTERS = [
  "IUPAC",
  "Isomerism",
  "Living world",
  "Biological classification",
  "Plant kingdom",
  "Animal kingdom",
  "Morphology",
  "Anatomy",
  "Structural organisation",
  "Cell unit",
  "Cell cycle",
  "Biomolecules (B)",
  "Photosynthesis",
  "Respiration",
  "Plant growth",
  "Breathing",
  "Body fluid",
  "Locomotion",
  "Neural",
  "Excretory",
  "Chemical coordination",
  "GOC",
  "Hydrocarbons",
  "Haloalkane",
  "Aldehyde",
  "Alcohol",
  "Amines",
  "Biomolecules (C)",
  "U & me",
  "1D",
  "2D",
  "Laws of motion",
  "Work energy power",
  "System of particles",
  "Gravitation",
  "Families",
  "P blk",
  "D & F blk",
  "Chem bond",
  "Period classification",
  "Coordination compounds",
];

// Local backend while developing; replace the Render URL after deploying.
const API_BASE_URL = ["localhost", "127.0.0.1", ""].includes(location.hostname)
  ? "http://localhost:8080/api"
  : "https://neetpreparation.onrender.com/api";

// Returns { read: [ids], completed: [ids] } from the backend.
async function fetchProgress() {
  const res = await fetch(`${API_BASE_URL}/progress`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// status is "READ", "COMPLETED" or "NONE" (back to Chapters).
async function saveStatus(id, status) {
  const res = await fetch(`${API_BASE_URL}/progress/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

// Loads progress, showing a message while the backend wakes up or if it fails.
async function loadProgress(list) {
  const note = document.createElement("p");
  note.className = "empty";
  note.textContent = "Loading chapters…";
  list.before(note);
  try {
    const progress = await fetchProgress();
    note.remove();
    return progress;
  } catch {
    note.textContent = "Could not reach the server. Please refresh in a moment.";
    return null;
  }
}

// Saves a move; on failure tells the user and reloads to show the real state.
function moveChapter(id, status) {
  saveStatus(id, status).catch(() => {
    alert("Could not save. The page will reload.");
    location.reload();
  });
}

function createChapterBox(id) {
  const box = document.createElement("div");
  box.className = "chapter";
  box.dataset.id = id;
  box.innerHTML = `<div class="num">${id}</div><span class="name">${CHAPTERS[id - 1]}</span>`;
  return box;
}

// Renders chapters that can be selected one at a time. Each action is
// { button, onClick }: clicking the button passes the selected id to onClick
// and removes its box from the list. selectOn is "click" or "dblclick".
function renderSelectableList(list, ids, actions, selectOn = "click") {
  let selectedBox = null;
  const setEnabled = (on) => actions.forEach((a) => (a.button.disabled = !on));

  const unselect = () => {
    if (!selectedBox) return;
    selectedBox.classList.remove("selected");
    selectedBox.setAttribute("aria-checked", "false");
    selectedBox = null;
    setEnabled(false);
  };

  ids.forEach((id) => {
    const box = createChapterBox(id);
    box.setAttribute("role", "radio");
    box.setAttribute("aria-checked", "false");
    box.tabIndex = 0;

    const select = () => {
      unselect();
      selectedBox = box;
      box.classList.add("selected");
      box.setAttribute("aria-checked", "true");
      setEnabled(true);
    };

    box.addEventListener(selectOn, select);
    box.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        select();
      }
    });
    list.appendChild(box);
  });

  // Clicking anywhere other than the selected chapter or an action button unselects.
  document.addEventListener("click", (e) => {
    const onAction = actions.some((a) => a.button.contains(e.target));
    if (!onAction && selectedBox && !selectedBox.contains(e.target)) unselect();
  });

  actions.forEach(({ button, onClick }) => {
    button.addEventListener("click", () => {
      if (!selectedBox) return;
      const box = selectedBox;
      unselect();
      onClick(Number(box.dataset.id));
      box.remove();
    });
  });
}
