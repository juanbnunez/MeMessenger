import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { db } from "../../firebase";
import { Message } from "./Message";


export const Messages = () => {

  const { data } = useContext(ChatContext);
  
  const [messages, setMessages] = useState([]);

  

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages)  
    })
  
    return () => {
      unSub()
    }
  }, [data.chatId]);

  

  return (
    <div className="messages">
        {Object.entries(messages)?.sort((a,b)=>a[1].date - b[1].date).map( message => (
            <Message message={message[1]} key={message[0]} />
          ))}
        
        {data.user?.block &&
          <div className="infoBlock">
            <div className="infoBlock-Content"><p>You have blocked { data.user?.displayName }</p></div>
          </div>
        }
    </div>
  )
}