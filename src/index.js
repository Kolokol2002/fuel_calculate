import "./styles/main.scss";
import changeIcon from "./images/settings-svgrepo-com.svg";
import { Notify } from "notiflix/build/notiflix-notify-aio";

const importantInputsEl = document.querySelectorAll(".input");
const comeEl = document.querySelector(".come");
const inputsEl = document.querySelector(".js-inputs");
const iconsEl = document.querySelectorAll(".icon");
const buttonEl = document.querySelector(".button_calculate");
const inputA = document.querySelector(".input_a");
const inputB = document.querySelector(".input_b");

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
inputsEl.addEventListener("click", onFocusInput);
comeEl.addEventListener("change", onSet);
buttonEl.addEventListener("click", distant);
inputA.addEventListener("click", onClearInputAddress);
inputB.addEventListener("click", onClearInputAddress);

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
      // el.classList.remove("current_answer");
    });
    return;
  }
  comeEl.checked = false;
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
  if ([km, fuel, cost].every((el) => el.value === "")) {
    return;
  }
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

function onFocusInput(e) {
  if (!e.target.classList.contains("input")) {
    return;
  }
  outlineInput(e.target);
  [km, fuel, cost].forEach((el) => {
    el.value = "";
    // el.classList.remove("current_answer");
  });
}

function onClearInputAddress(e) {
  e.target.value = "";
}

let cordA = null;
let cordB = null;

function initAutocomplete() {
  const searchBoxA = new google.maps.places.SearchBox(inputA);
  const searchBoxB = new google.maps.places.SearchBox(inputB);

  searchBoxA.addListener("places_changed", () => {
    const places = searchBoxA.getPlaces();

    if (places.length == 0) {
      return;
    }

    const bounds = new google.maps.LatLngBounds();

    places.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    // map.fitBounds(bounds);
    cordA = bounds;
  });

  searchBoxB.addListener("places_changed", () => {
    const places = searchBoxB.getPlaces();

    if (places.length == 0) {
      return;
    }

    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();

    places.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    // map.fitBounds(bounds);
    cordB = bounds;
  });
}

function distant() {
  const service = new google.maps.DistanceMatrixService();
  console.log(cordA);
  const A = { lat: cordA.Ua.lo, lng: cordA.Ha.lo };
  const B = { lat: cordB.Ua.lo, lng: cordB.Ha.lo };
  const request = {
    origins: [A],
    destinations: [B],
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC,
  };

  service.getDistanceMatrix(request).then((response) => {
    const { distance, duration } = response.rows[0].elements[0];
    outlineInput(km);
    km.value = (distance.value / 1000).toFixed(1);
    fuel.value = ((average.value * km.value) / 100).toFixed(1);
    cost.value = (fuel.value * priceFuel.value).toFixed(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

window.initAutocomplete = initAutocomplete;
