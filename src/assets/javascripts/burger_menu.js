const burger = document.querySelector(".burger_menu");

burger.addEventListener("click", (event) => {
  event.preventDefault();
  if (burger.classList.contains("is-opened")) {
    burger.classList.remove("is-opened");
    burger.classList.add("is-closed");
  } else {
    burger.classList.add("is-opened");
    burger.classList.remove("is-closed");
  }
});
