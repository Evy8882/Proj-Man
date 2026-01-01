import { useState } from "react";
import Home from "./pages/Home";
import NewProject from "./pages/NewProject";
import "./App.css";

function App() {
  const [navRoute, setNavRoute] = useState("/");



  return (
    <main className="main-container">
      {
        navRoute === "/" ? <Home setNavRoute={setNavRoute} /> :
        navRoute === "/new-project" ? <NewProject setNavRoute={setNavRoute} /> :
        null
      }
    
    </main>
  )
}

export default App;
