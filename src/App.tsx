import "./css/App.css";
import LoginScreen from "./pages/login";
import HomeScreen from "./pages/home";

function App() {
  let path = window.location.pathname.split("/")[1];
  if (path === "login") return LoginScreen();
  return HomeScreen();
}

export default App;
