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
  const div = contentModal(content);
  contentPosterElem.classList.add("position-relative");
  modal.append(div);
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
};
