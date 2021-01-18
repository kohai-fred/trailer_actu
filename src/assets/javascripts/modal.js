// import { reject } from "core-js/fn/promise";
import { burgerIsOpen, burgerIsClosed } from "./burger_menu";

const body = document.querySelector("body");
const burgerElem = document.querySelector(".burger_menu");
const contentPosterElem = document.querySelector(".news__content");

let calc;
let modal;
let btnValidate;

const createCalc = () => {
  calc = document.createElement("div");
  calc.classList.add("calc");
};
const createModal = (content) => {
  modal = document.createElement("div");
  modal.classList.add("modal");
  const test = contentModal(content);
  contentPosterElem.classList.add("position-relative");
  modal.append(test);
  contentPosterElem.appendChild(modal);
};
const contentModal = (content) => {
  const div = document.createElement("div");
  div.classList.add("content-modal");

  btnValidate = document.createElement("button");
  btnValidate.innerText = "Valider";
  btnValidate.classList.add("btn", "btn-validate");
  div.append(content, btnValidate);
  return div;
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

  return new Promise((resolve, reject) => {
    calc.addEventListener("click", () => {
      resolve(false);
      closeModal();
    });

    btnValidate.addEventListener("click", () => {
      resolve(true);
      closeModal();
    });
  });
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
