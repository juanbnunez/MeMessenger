// import { Chat } from "../components/chat/Chat"
import Sidebar from "../components/sideBar/SideBar";
import { ModalsContextProvider } from "../context/ModalsContext"
// import "./styles.css"
const Home = () => {

  const changeWindow = () => {
    if(window.innerWidth>632){
      document.getElementById("sidebar").classList.remove("close");
      document.getElementById("sidebar").classList.remove("open");
      document.getElementById("chat").classList.remove("close");
      document.getElementById("chat").classList.remove("open");
    }
  }
  window.addEventListener("resize", changeWindow);  
  return (
    <div className='home'>
      <div className="container-home">
        <ModalsContextProvider>
           <Sidebar id="sidebar"/>
          {/*<Chat id="chat"/> */}
        </ModalsContextProvider>
      </div>
    </div>
  )
}

export default Home