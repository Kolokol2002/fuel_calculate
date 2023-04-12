import "./styles/main.scss";
import changeIcon from "./images/settings-svgrepo-com.svg";
import { Notify } from "notiflix/build/notiflix-notify-aio";

const importantInputsEl = document.querySelectorAll(".input");
const comeEl = document.querySelector(".come");
const inputsEl = document.querySelector(".js-inputs");
const iconsEl = document.querySelectorAll(".icon");

// console.dir(iconsEl);
iconsEl.forEach((el) => {
  el.style.background = `url('${changeIcon}')`;
  el.addEventListener("click", onChangeSettings);
});

const [average, priceFuel, km, fuel, cost] = importantInputsEl;

average.value = localStorage.getItem("average") ?? "";
priceFuel.value = localStorage.getItem("priceFuel") ?? "";

average.addEventListener("input", onStrogateAverage);
priceFuel.addEventListener("input", onStrogatePriceFuel);
inputsEl.addEventListener("input", onInput);
comeEl.addEventListener("change", onSet);
iconsEl;

function onInput(e) {
  e.preventDefault();
  if (e.target.name === "switch") {
    return;
  }
  if (!average.value || !priceFuel.value) {
    Notify.failure(
      "Зверніть увагу, що перші два поля мають бути обов'язково заповнені"
    );
    return;
  }
  if (e.target.value === "") {
    [km, fuel, cost].forEach((el) => {
      el.value = "";
      el.classList.remove("current_answer");
    });
    return;
  }
  comeEl.checked = false;
  outlineInput(e.target);
  if (e.target.name === "km") {
    fuel.value = ((average.value * km.value) / 100).toFixed(1);
    cost.value = (fuel.value * priceFuel.value).toFixed(1);
  } else if (e.target.name === "fuel") {
    km.value = ((fuel.value * 100) / average.value).toFixed(1);
    cost.value = (e.target.value * priceFuel.value).toFixed(1);
  } else if (e.target.name === "cost") {
    fuel.value = (cost.value / priceFuel.value).toFixed(1);
    km.value = ((fuel.value * 100) / average.value).toFixed(1);
  }
}

function onStrogateAverage(e) {
  localStorage.setItem("average", e.target.value);
}

function onStrogatePriceFuel(e) {
  localStorage.setItem("priceFuel", e.target.value);
}

function onSet(e) {
  if (e.target.checked) {
    [km, fuel, cost].forEach((el) => (el.value *= (2).toFixed(1)));
  } else {
    [km, fuel, cost].forEach((el) => (el.value /= (2).toFixed(1)));
  }
}

function outlineInput(curentInput) {
  [km, fuel, cost].forEach((el) => {
    if (el === curentInput) {
      el.classList.remove("current_answer");
      return;
    }
    el.classList.add("current_answer");
  });
}

function onChangeSettings(e) {
  const currentEl = e.target.parentElement.children[0];
  currentEl.classList.toggle("setting");
}
