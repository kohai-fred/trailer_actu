import { burgerIsOpen, burgerIsClosed } from "./burger_menu";

const body = document.querySelector("body");
const burgerElem = document.querySelector(".burger_menu");
const contentPosterElem = document.querySelector(".news__content");

let calc;
let modal;

const createCalc = () => {
  calc = document.createElement("div");
  calc.classList.add("calc");
};
const createModal = (content) => {
  modal = document.createElement("div");
  modal.classList.add("modal");

  contentPosterElem.classList.add("position-relative");
  modal.append(content);
  contentPosterElem.appendChild(modal);
};
export const closeModal = () => {
  calc.remove();
  modal.remove();
  burgerIsOpen();
};
export const openModal = (content) => {
  createCalc();
  createModal(content);
  // calc.append(modal);
  body.append(calc);
  burgerIsClosed();
  calc.addEventListener("click", closeModal);
  console.log("IN MODAL : ", content);
};

// export const createModal = (target) => {
//   target.parentNode.classList.add("position-relative");

//   const modal = document.createElement("div");
//   modal.classList.add("modal", `${target.id}`);
//   target.parentNode.append(modal);
//   contentModal(target, modal);
//   console.log(target);
// };

// const contentModal = (target, modal) => {
//   const contentModal = document.createElement("div");
//   contentModal.classList.add("content-modal");

//   const input = document.createElement("input");
//   // input.classList.add("content-modal");
//   input.value = target.dataset.where;

//   const btn = document.createElement("button");
//   btn.classList.add("btn", "btn-validate");
//   btn.innerText = "Valider";

//   contentModal.append(input, btn);
//   modal.append(contentModal);
//   console.log(target.childNodes);
//   console.log(target.children);

//   btn.addEventListener("click", () => {
//     // displayTiles(); // not defined
//     // console.log("target : ", target);
//     target.parentNode.classList.remove("position-relative");
//     modal.remove();
//     // removeModal(modal);
//   });
// };

// export const removeModal = (modal) => {
//   modal.remove();
// };
// console.log(btn);
/*********************************** 
    AddEventLiseteners
************************************/
