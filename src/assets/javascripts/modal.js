export const createModal = (target) => {
  target.parentNode.classList.add("position-relative");

  const modal = document.createElement("div");
  modal.classList.add("modal", `${target.id}`);
  target.parentNode.append(modal);
  contentModal(target, modal);
  console.log(target);
};

const contentModal = (target, modal) => {
  const contentModal = document.createElement("div");
  contentModal.classList.add("content-modal");

  const input = document.createElement("input");
  // input.classList.add("content-modal");
  input.value = target.dataset.where;

  const btn = document.createElement("button");
  btn.classList.add("btn", "btn-validate");
  btn.innerText = "Valider";

  contentModal.append(input, btn);
  modal.append(contentModal);
  console.log(target.childNodes);
  console.log(target.children);

  btn.addEventListener("click", () => {
    // displayTiles(); // not defined
    // console.log("target : ", target);
    target.parentNode.classList.remove("position-relative");
    modal.remove();
    // removeModal(modal);
  });
};

export const removeModal = (modal) => {
  modal.remove();
};
// console.log(btn);
/*********************************** 
    AddEventLiseteners
************************************/
