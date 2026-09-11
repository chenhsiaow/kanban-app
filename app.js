const board = document.querySelector("#board");

function updateCounts() {
  board.querySelectorAll(".column").forEach((column) => {
    const count = column.querySelector("[data-cards]").children.length;
    column.querySelector("[data-count]").textContent = count;
  });
}

function todayStart() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function formatDueLabel(isoDate) {
  const [year, month, day] = isoDate.split("-");
  return `${Number(year)}/${Number(month)}/${Number(day)}`;
}

function isDueUrgent(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const due = new Date(year, month - 1, day);
  return due <= todayStart();
}

function createCard(title, dueDate = "") {
  const card = document.createElement("article");
  card.className = "card";
  card.draggable = true;

  const titleEl = document.createElement("span");
  titleEl.className = "card-title";
  titleEl.textContent = title;
  card.append(titleEl);

  if (dueDate) {
    const dueEl = document.createElement("span");
    dueEl.className = "due-label";
    dueEl.textContent = formatDueLabel(dueDate);
    if (isDueUrgent(dueDate)) {
      dueEl.classList.add("is-urgent");
    }
    card.append(dueEl);
  }

  card.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", title);
    event.dataTransfer.effectAllowed = "move";
    card.classList.add("dragging");
  });

  card.addEventListener("dragend", () => {
    card.classList.remove("dragging");
    board.querySelectorAll("[data-cards]").forEach((list) => {
      list.classList.remove("drag-over");
    });
  });

  return card;
}

board.querySelectorAll("[data-add]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = form.querySelector("input[name=title]");
    const dueInput = form.querySelector("input[name=due]");
    const title = input.value.trim();
    if (!title) return;

    const list = form.closest(".column").querySelector("[data-cards]");
    list.append(createCard(title, dueInput.value));
    input.value = "";
    dueInput.value = "";
    updateCounts();
  });
});

board.querySelectorAll("[data-cards]").forEach((list) => {
  list.addEventListener("dragover", (event) => {
    event.preventDefault();
    list.classList.add("drag-over");
  });

  list.addEventListener("dragleave", () => {
    list.classList.remove("drag-over");
  });

  list.addEventListener("drop", (event) => {
    event.preventDefault();
    const dragging = document.querySelector(".card.dragging");
    if (dragging) {
      list.append(dragging);
      updateCounts();
    }
    list.classList.remove("drag-over");
  });
});

["規劃看板欄位", "加入拖放互動", "完成第一次提交"].forEach((title, index) => {
  const columns = board.querySelectorAll("[data-cards]");
  columns[Math.min(index, columns.length - 1)].append(createCard(title));
});

updateCounts();
