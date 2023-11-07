// Seleção de elementos
const slForm = document.querySelector("#sl-form");
const slInput = document.querySelector("#sl-input");
const slList = document.querySelector("#sl-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");

let oldInputValue;

// Função para adicionar uma tarefa
const saveSlForm = (text) => {
  // Verificar se o item já existe
  const existingItems = Array.from(slList.getElementsByClassName("sl"));
  const existingTitles = existingItems.map((item) => item.querySelector("h3").innerText);

  if (existingTitles.includes(text)) {
    alert("Este item já existe na lista!");
    return;
  }

  const slItem = document.createElement("div");
  slItem.classList.add("sl");

  const slTitle = document.createElement("h3");
  slTitle.innerText = text;
  slItem.appendChild(slTitle);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-sl");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  slItem.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-sl");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  slItem.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-sl");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  slItem.appendChild(deleteBtn);

  slList.appendChild(slItem);

  slInput.value = "";
  slInput.focus();

  // Salvar a tarefa no localStorage
  const sls = JSON.parse(localStorage.getItem("sls")) || [];
  sls.push(text);
  localStorage.setItem("sls", JSON.stringify(sls));
};

// Função para carregar tarefas do localStorage
const loadSlsFromLocalStorage = () => {
  const sls = JSON.parse(localStorage.getItem("sls")) || [];

  sls.forEach((text) => {
    // Verificar se o item já existe na lista atual
    const existingItems = Array.from(slList.getElementsByClassName("sl"));
    const existingTitles = existingItems.map((item) => item.querySelector("h3").innerText);

    if (!existingTitles.includes(text)) {
      saveSlForm(text);
    }
  });
};

// Chame a função para carregar tarefas do localStorage quando a página carregar
loadSlsFromLocalStorage();

const toggleForms = () => {
  editForm.classList.toggle("hide");
  slForm.classList.toggle("hide");
  slList.classList.toggle("hide");
};

const updatesl = (text) => {
  const sls = document.querySelectorAll(".sl");
  sls.forEach((sl) => {
    let slTitle = sl.querySelector("h3");

    if (slTitle.innerText === oldInputValue) {
      slTitle.innerText = text;
    }
  });

  // Atualizar o localStorage após a edição
  const slsArray = Array.from(sls);
  const slsText = slsArray.map((sl) => sl.querySelector("h3").innerText);
  localStorage.setItem("sls", JSON.stringify(slsText));
};

// Eventos
slForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = slInput.value;

  if (inputValue) {
    saveSlForm(inputValue);
  }
});

document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let slTitle;

  if (parentEl && parentEl.querySelector("h3")) {
    slTitle = parentEl.querySelector("h3").innerText;
  }

  if (targetEl.classList.contains("finish-sl")) {
    parentEl.classList.toggle("done");
  }

  if (targetEl.classList.contains("remove-sl")) {
    parentEl.remove();

    // Atualizar o localStorage após a remoção
    const sls = document.querySelectorAll(".sl");
    const slsArray = Array.from(sls);
    const slsText = slsArray.map((sl) => sl.querySelector("h3").innerText);
    localStorage.setItem("sls", JSON.stringify(slsText));
  }

  if (targetEl.classList.contains("edit-sl")) {
    toggleForms();

    editInput.value = slTitle;
    oldInputValue = slTitle;
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();

  toggleForms();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const editInputValue = editInput.value;
  if (editInputValue) {
    updatesl(editInputValue);
  }

  toggleForms();
});
