import "./Home.css";

function Home({setNavRoute}: {setNavRoute: (route: string) => void}) {
    return (
    <div className="home-container container">
        <h1>Proj-Man</h1>
        <p>Welcome to proj-man, your project management tool!</p>
        <button className="home-btn" onClick={()=>{setNavRoute("/new-project")}}>Create a new project</button>
    </div>
);
}
export default Home;