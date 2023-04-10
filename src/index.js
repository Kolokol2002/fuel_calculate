import "./styles/main.scss";
import { calculate } from "./js/calculate";

const inputsEl = document.querySelectorAll(".input");
const formEl = document.querySelector(".form");
const comeEl = document.querySelector(".come");

const [average, priceFuel, km, fuel, cost] = inputsEl;

average.value = localStorage.getItem("average") ?? "";
priceFuel.value = localStorage.getItem("priceFuel") ?? "";

average.addEventListener("input", onStrogateAverage);
priceFuel.addEventListener("input", onStrogatePriceFuel);
km.addEventListener("input", onCalculateKm);
fuel.addEventListener("input", onCalculateFuel);
comeEl.addEventListener("change", onSet);

function onStrogateAverage(e) {
  localStorage.setItem("average", e.target.value);
}

function onStrogatePriceFuel(e) {
  localStorage.setItem("priceFuel", e.target.value);
}

function onCalculateKm(e) {
  e.preventDefault();
  fuel.value = (average.value * km.value) / 100;
  cost.value = fuel.value * priceFuel.value;
}

function onCalculateFuel(e) {
  e.preventDefault();
  km.value = (fuel.value * 100) / average.value;
  cost.value = e.target.value * priceFuel.value;
}

function onSet(e) {
  if (e.target.checked) {
    console.log("Checkbox is checked..");
    km.value *= 2;
    fuel.value *= 2;
    cost.value *= 2;
  } else {
    console.log("Checkbox is not checked..");
    km.value /= 2;
    fuel.value /= 2;
    cost.value /= 2;
  }
}
