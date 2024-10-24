import React from 'react';
import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { db } from "../../firebase";

const ItemChat = () => {

  const [chats, setChats] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      }
    }

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (user, lastMessage) => {
    dispatch({ type: "CHANGE_USER", payload: {user, lastMessage}});

      // if(window.innerWidth<=632){
      //   document.getElementById("chat").classList.remove("close");
      //   document.getElementById("sidebar").classList.remove("open");

      //   document.getElementById("sidebar").classList.add("close");
      //   document.getElementById("chat").classList.add("open");
      // }
  }

  return (
    <div className="itemChat">
      {Object.entries(chats)?.sort((a,b) => b[1].date - a[1].date).map(chat => (
        <div 
          className="userChat" 
          key={chat[0]} 
          onClick={() => handleSelect(chat[1].userInfo, chat[1].lastMessage?.text)}
        >
          {/* <img className="search-image" src={chat[1].userInfo.photoURL} alt="" /> */}
          <div className="userChatInfo">
            <span>{chat[1].userInfo.displayName}</span>
            {/* <p>{decrypt(chat[1].lastMessage?.text)}</p> */}
            <p>{chat[1].lastMessage?.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemChat;
