window.addEventListener("DOMContentLoaded", () => {
  showInputToggle();
  cityInputValue();
});
//captura el valor de la
const cityInputValue = () => {
  const form = document.querySelector("form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const cityInput = document.querySelector(".cityInput").value;
    const zipInput = document.querySelector(".zipInput").value;
    if (zipInput === "") {
      apiCallByCity(cityInput);
    }
    if (cityInput === "") {
      apiCallByZipCode(zipInput);
    }
    form.reset();
  });
};

//se encarga de leer el api dependiendo de la ciudad
async function apiCallCity(city) {
  try {
    const apiKey = "5fdd018affada79ddabf045dc106948c";
    const weatherFetch = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`
    );
    const weatherResult = await weatherFetch.json();
    document.getElementById("error-msg").innerText = "";
    return weatherResult;
  } catch (error) {
    document.getElementById("error-msg").innerText =
      "No se encuentra esa ciudad :(";
  }
}
//api que hace llamado por zipCode y codigo de ciudad
async function apiCallZipCode(zipCode) {
  try {
    const apiKey = "5fdd018affada79ddabf045dc106948c";
    const weatherFetch = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${apiKey}&units=imperial`
    );
    const weatherResult = await weatherFetch.json();
    document.getElementById("error-msg").innerText = "";
    return weatherResult;
  } catch (error) {
    document.getElementById("error-msg").innerText =
      "No se encuentra esa ciudad :(";
  }
}

//Se encagar de hacer el llamado a la api por ciudad y llamar a la función tarjeta
const apiCallByCity = async (city) => {
  try {
    const weatherResult = await apiCallCity(city);
    const { main, name, weather } = weatherResult;
    const divWeatherCard = document.querySelector(".cityWeatherCard");
    divWeatherCard?.remove();
    createWeatherCard(main, name, weather);
  } catch (error) {
    document.getElementById("error-msg").innerText =
      "No se encuentra esa ciudad :(";
  }
};

const apiCallByZipCode = async (zipCode) => {
  try {
    const weatherResult = await apiCallZipCode(zipCode);
    const { main, name, weather } = weatherResult;
    const divWeatherCard = document.querySelector(".cityWeatherCard");
    divWeatherCard?.remove();
    createWeatherCard(main, name, weather);
  } catch (error) {
    document.getElementById("error-msg").innerText =
      "No se encuentra esa ciudad :( wdadaw";
  }
};

/* crea la tarjeta con los datos que provienen del api y si es necesario
llama a la función de agregar a la
lista de favoritos */
const createWeatherCard = (main, name, weather) => {
  const section = document.querySelector("#weatherCard");

  const div = document.createElement("div");

  div.classList.add("cityWeatherCard");
  const cardHtml = html(main, name, weather, "fav");
  div.innerHTML = cardHtml;
  section.appendChild(div);
  addCardToFavList(main, name, weather);
};
let cityNames = [];
//Se encarga de agregar las tarjetas que quedan como favoritas
const addCardToFavList = (main, name, weather) => {
  const addFav = document.querySelector(".fav-button");
  const advTitle = document.getElementById("advTitle");
  addFav?.addEventListener("click", () => {
    if (cityNames.includes(name)) {
      advTitle.innerText =
        "This city is already in favorites, please try with a different city ;)";
    } else {
      cityNames.push(name);
      const list = document.querySelector(".city-list");
      const newItemList = document.createElement("li");
      newItemList.classList.add("cityWeatherCard");

      const cardHtml = html(main, name, weather, "remove");
      newItemList.innerHTML = cardHtml;
      list.appendChild(newItemList);
      advTitle.innerText = "";
      lea();
    }
  });
};

//realiza el seguimiento del Api para estár el pendiente de los cambios de temperatura
const lea = () => {
  setInterval(async () => {
    const cityWeatherCards = Array.from(
      document.querySelectorAll("li.cityWeatherCard")
    );
    cityWeatherCards.forEach(async (element) => {
      const nameCity = element
        .querySelector(".name-city")
        ?.innerHTML.split("<")[0];
      const inputWeather = element.querySelector(".inputWeather").value;
      const lea = await apiCallCity(nameCity);
      const { main, name, weather } = lea;
      element.innerHTML = html(main, name, weather, "remove", inputWeather);
    });
  }, 6000);
};

//eliminar los items de la lista de favoritos
const removeFavlistItem = (name) => {
  const li = document.querySelectorAll("li.cityWeatherCard");
  li.forEach((element) => {
    const nameLi = element
      .querySelector(".name-city")
      ?.innerHTML?.split("<")[0];
    if (nameLi === name) {
      element.remove();
    }
  });
};

//Devuelve el html para que este pueda ser utilizado donde se necesite
function html(main, name, weather, textBtn, inputWeather) {
  try {
    let classForButton;
    let buttonFunction;
    let weatherInput;
    let weatherAlert;
    const inputWeatherRound = Math.round(inputWeather);
    if (textBtn === "remove") {
      classForButton = "remove-button";
      buttonFunction = `removeFavlistItem('${name}')`;
      if (inputWeather == undefined || inputWeather == "") inputWeather = "";
      if (weatherAlert === undefined) weatherAlert = "";
      if (inputWeather >= Math.round(main.temp)) {
        weatherAlert = "Temp Alert!";
      }
      weatherInput = `
      <p id="weatherP">Weather Alert at: ${inputWeather}</p>
      <input class="inputWeather" type="text" id="inputWeather" value="${inputWeather}">
      <div class="weatherAlert">${weatherAlert}</div>
      `;
    } else {
      classForButton = "fav-button";
      buttonFunction = "";
      weatherInput = "";
    }

    const icon = `http://openweathermap.org/img/w/${weather[0]?.icon}.png`;
    const cardHtml = `<h2 class="name-city">${name}<sup><button onclick="${buttonFunction}" class="${classForButton}">${textBtn}</button></sup></h2>
                                <span class="temp-city">${Math.round(
                                  main.temp
                                )}<sup>°F</sup></span>
                                <figure>
                                    <img class="icon-city" src=${icon}></img>
                                    <figcaption>${
                                      weather[0].description
                                    }</figcaption>
                                </figure>
                                ${weatherInput}`;
    return cardHtml;
  } catch (error) {
    document.getElementById("error-msg").innerText = "Can't find the city :(";
  }
}

const showInputToggle = () => {
  const btnCity = document.querySelector("#cityButton");
  const btnZip = document.querySelector("#zipCodeButton");
  const cityInput = document.querySelector(".cityInput");
  const zipInput = document.querySelector(".zipInput");

  btnCity.addEventListener("click", () => {
    if (!zipInput.classList.contains("zipInputDisabled")) {
      zipInput.classList.add("zipInputDisabled");
    }
    cityInput.classList.toggle("cityInputDisabled");
    cityInput.focus();
  });

  btnZip.addEventListener("click", () => {
    if (!cityInput.classList.contains("cityInputDisabled")) {
      cityInput.classList.add("cityInputDisabled");
    }
    zipInput.classList.toggle("zipInputDisabled");
    zipInput.focus();
  });
};
