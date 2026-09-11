const board = document.querySelector("#board");

function updateCounts() {
  board.querySelectorAll(".column").forEach((column) => {
    const count = column.querySelector("[data-cards]").children.length;
    column.querySelector("[data-count]").textContent = count;
  });
}

function createCard(title) {
  const card = document.createElement("article");
  card.className = "card";
  card.draggable = true;
  card.textContent = title;

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
    const title = input.value.trim();
    if (!title) return;

    const list = form.closest(".column").querySelector("[data-cards]");
    list.append(createCard(title));
    input.value = "";
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
