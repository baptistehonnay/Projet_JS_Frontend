/* In a template literal, the ` (backtick), \ (backslash), and $ (dollar sign) characters should be 
escaped using the escape character \ if they are to be included in their template value. 
By default, all escape sequences in a template literal are ignored.*/
import {getUserSessionData, setUserSessionData} from "../utils/Session.js";
import { RedirectUrl } from "./Router.js";
import {escapeHtml} from "../utils/Utils.js"
import Navbar from "./NavBar.js";
// condition username
let loginPage = `
<form>
  <div class="row mx-0">
    <div class="col-lg-4 col-md-2"></div>
    <div class="col-lg-4 col-md-8">
      <h1 class="my-5">Connexion</h1>
      <div class="form-group">
      
        <label for="username">Pseudo</label>
        <input class="form-control" id="username" type="text" name="username" placeholder="Enter your username" minlength="4" required/>
      </div>
      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input class="form-control" id="password" type="password" name="password" placeholder="Enter your password" required/>
      </div>
      <button class="btn btn-primary" id="btn" type="submit">Se connecter</button>
      <!-- Create an alert component with bootstrap that is not displayed by default-->
      <div class="alert alert-danger mt-2 d-none" id="messageBoard"></div>
    </div>
  </div>
</form>`;

const LoginPage = () => {
  let page = document.querySelector("#page");
  page.innerHTML = loginPage;
  let loginForm = document.querySelector("form");
  const user = getUserSessionData();
  if (user) {
    // re-render the navbar for the authenticated user
    Navbar();
    RedirectUrl("/");
  } else loginForm.addEventListener("submit", onLogin);
};

const onLogin = (e) => {
  e.preventDefault();
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  username = escapeHtml("" + username);
  password = escapeHtml("" + password);

  let user = {
    username: username,
    password: password,
  };

  fetch("/api/users/login", {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    body: JSON.stringify(user), // body data type must match "Content-Type" header
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok)
        throw new Error(
          "Error code : " + response.status + " : " + response.statusText
        );
      return response.json();
    })
    .then((data) => onUserLogin(data))
    .catch((err) => onError(err));
};

const onUserLogin = (userData) => {
  console.log("onUserLogin");
  const user = { ...userData, isAutenticated: true };  
  setUserSessionData(user);
  // re-render the navbar for the authenticated user
  Navbar();
  RedirectUrl("/");
};

const onError = (err) => {
  let messageBoard = document.querySelector("#messageBoard");
  let errorMessage = "";
  if (err.message.includes("401")) errorMessage = "Wrong username or password.";
  else errorMessage = err.message;
  messageBoard.innerText = errorMessage;
  // show the messageBoard div (add relevant Bootstrap class)
  messageBoard.classList.add("d-block");
};


export default LoginPage;


