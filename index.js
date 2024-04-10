//Load after de dom content is loaded
document.addEventListener("DOMContentLoaded", () => {
  loginFunction();
});
function loginFunction() {
  const form = document.querySelector("form");
  form.addEventListener("submit", (event) => {
    const user = document.getElementById("user").value;
    const pwd = document.getElementById("pwd").value;
    event.preventDefault();
    if (user === logUser()[0].user && pwd === logUser()[0].pwd) {
      window.location.href = "./pages/weather/weather.html";
    } else {
      alert("invalid user");
      form.reset();
    }
  });
}

const logUser = () => {
  return [
    {
      user: "solvo",
      pwd: "1234",
    },
  ];
};
