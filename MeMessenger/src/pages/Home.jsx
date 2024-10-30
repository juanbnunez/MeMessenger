import { Chat } from "../components/chat/Chat"
import Sidebar from "../components/sideBar/SideBar";
import { ModalsContextProvider } from "../context/ModalsContext";
import { ChatContextProvider } from "../context/ChatContext"; // Importa ChatContextProvider
import ItemChat from "../components/sideBar/ItemChat"; // Importa ItemChat

const Home = () => {

  const changeWindow = () => {
    // if(window.innerWidth > 632){
    //   document.getElementById("sidebar").classList.remove("close");
    //   document.getElementById("sidebar").classList.remove("open");
    //   document.getElementById("chat").classList.remove("close");
    //   document.getElementById("chat").classList.remove("open");
    // }
  }
  window.addEventListener("resize", changeWindow);  

  return (
    <div className='home'>
      <div className="container-home">
        <ModalsContextProvider>
          <ChatContextProvider> {/* Envuelve con ChatContextProvider */}
            <Sidebar id="sidebar"/>
            <ItemChat /> {/* Añade ItemChat aquí */}
            <Chat id="chat"/>
          </ChatContextProvider>
        </ModalsContextProvider>
      </div>
    </div>
  )
}

export default Home;