import { useState } from "react";
import Home from "./pages/Home";
import NewProject from "./pages/NewProject";
import "./App.css";
import ProjectPage from "./pages/Project";

function App() {
  const [navRoute, setNavRoute] = useState("/");



  return (
    <main className="main-container">
      {
        navRoute === "/" ? <Home setNavRoute={setNavRoute} /> :
        navRoute === "/new-project" ? <NewProject setNavRoute={setNavRoute} /> :
        navRoute.startsWith("/project/") ? <ProjectPage setNavRoute={setNavRoute} projectId={navRoute.split("/project/")[1]} /> :
        null
      }
    
    </main>
  )
}

export default App;
