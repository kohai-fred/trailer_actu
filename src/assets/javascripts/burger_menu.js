const burgerElem = document.querySelector(".burger_menu");

export const burgerIsOpen = () => {
  if (burgerElem.classList.contains("is-opened")) {
    burgerElem.classList.remove("is-opened");
    burgerElem.classList.add("is-closed");
  }
};
export const burgerIsClosed = () => {
  if (burgerElem.classList.contains("is-closed")) {
    burgerElem.classList.remove("is-closed");
    burgerElem.classList.add("is-opened");
  }
};
// burger.addEventListener("click", (event) => {
//   event.preventDefault();
//   if (burger.classList.contains("is-opened")) {
//     burger.classList.remove("is-opened");
//     burger.classList.add("is-closed");
//   } else {
//     burger.classList.add("is-opened");
//     burger.classList.remove("is-closed");
//   }
// });
