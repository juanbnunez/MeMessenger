import { useState } from "react";
import { useContext } from "react";
import CryptoJS from "crypto-js";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";
import { ModalsContext } from "../../../context/ModalsContext";
import { ChatContext } from "../../../context/ChatContext";
import { ShowMessages } from "./ShowMessages";
//const icons = require.context('../../../assets', true);

import backIcon from '../../../assets/back.svg';
import searchIcon from '../../../assets/search.svg';



export const ModalSearch = () => {

  const { stateModalSearch, setStateModalSearch } = useContext(ModalsContext);
  const { data } = useContext(ChatContext);
  
  const [messages, setMessages] = useState([])
  const [phrase, setPhrase] = useState("");
  const [showMessages, setShowMessages] = useState([])
  const [error, setError] = useState(false)

  const search = async() => {
    setPhrase(document.getElementById("search-input-message").value)

    setMessages(null);
    await onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      setMessages(doc.data());
    });
    
    Object.entries(messages)?.map( message => (
      handleSearch(message[1])
    ))
  }

  const handleSearch = (message) => {
    let listShowMessages = []
    //console.log(listShowMessages)
    //console.log(phrase)
    if(phrase !== ""){

      Object.entries(message).sort((a,b)=>a[1].date - b[1].date).forEach((oneMessage) => {
        let decryptedMessage = CryptoJS.AES.decrypt(oneMessage[1].text, '@pTSCA42vm94yl4EE4Tjb').toString(CryptoJS.enc.Utf8)
        if(decryptedMessage.toLowerCase().includes(phrase.toLowerCase())){
          listShowMessages = [...listShowMessages, oneMessage]
        }
      })
      //console.log(listShowMessages)
      setShowMessages(listShowMessages)
      if(listShowMessages.length === 0){
        setError(true)
      }else{
        setError(false)
      }
    }else{
      setError(false)
      setShowMessages(listShowMessages)
    }
  }

  const handleBack = () => {
    setStateModalSearch(!stateModalSearch)
    const listEmpty = []
    setShowMessages(listEmpty)
  }

  const handleKey = (e) => {
    e.keyCode === 13 && search();
  }

  return (
    <>
      { stateModalSearch &&
        <div className="containerModal">
          <div className="ModalSearch">
            <div className="ModalSearch-input">
            <img className='img-darkBack' src={backIcon} alt="Back" onClick={handleBack} />
              <input 
                type="text" 
                className="search-input" 
                id="search-input-message"
                placeholder="Search for a message" 
                onKeyDown={ handleKey } 
                onChange={ e=>setPhrase(e.target.value) }
              />
              <img className='img-darkBack' src={searchIcon} alt="Search" onClick={search} />
            </div>
            {!error 
              ?
              <div className="messages-search">
                {showMessages.map( message => (<ShowMessages message={message[1]} key={message[0]}/>))}
              </div>
              :
              <span className="not-found">Not found! 😧</span>
            }
            
          </div>
        </div>
      }
    </>
    
  )
}