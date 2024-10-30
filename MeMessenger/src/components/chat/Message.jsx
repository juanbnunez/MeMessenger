import { useContext, useEffect, useRef } from "react";
import CryptoJS from "crypto-js";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { deleteField, doc,  updateDoc} from "firebase/firestore";
import { db } from "../../firebase";
import { useState } from "react";

export const Message = ({ message }) => {

  const { currentUser } = useContext(AuthContext);
  const { data, dispatch } = useContext(ChatContext);

  const [updateMessage, setUpdateMessage] = useState(false);

  const decryptedMessage = CryptoJS.AES.decrypt(message.text, '@pTSCA42vm94yl4EE4Tjb').toString(CryptoJS.enc.Utf8);
  const [text, setText] = useState(decryptedMessage);

  let dateMessage = message.date.toDate();

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const handleUpdateMessage = () => {
    setUpdateMessage(true);
  }
  
  const handleDeleteMessage = async() => {
    await updateDoc(doc(db, "chats", data.chatId), {
      ["messages." + message.id]: deleteField()
    });

    if(message.text === data.lastMessage) {
      const encryptedMessage = CryptoJS.AES.encrypt('Se eliminó este mensaje', '@pTSCA42vm94yl4EE4Tjb').toString();

      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatId + ".lastMessage"]: {
          text: encryptedMessage
        }
      });

      dispatch({ type: "CHANGE_LASTMESSAGE", payload: encryptedMessage});
    }
  }

  const handleCancel = () => {
    setUpdateMessage(false);
  }
  
  const handleSaveMessage = async() => {
    const encryptedMessage = CryptoJS.AES.encrypt(text, '@pTSCA42vm94yl4EE4Tjb').toString();

    if(message.text === data.lastMessage) {
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatId + ".lastMessage"]: {
          text: encryptedMessage
        }
      });
    }

    await updateDoc(doc(db, "chats", data.chatId), {
      ["messages." + message.id + ".text"]: encryptedMessage
    });

    dispatch({ type: "CHANGE_LASTMESSAGE", payload: encryptedMessage});

    setUpdateMessage(false);
  }
  
  return (
      <div ref={ref} className={`message ${message.senderId === currentUser.uid ? "owner" : ""}`}>
        <div className="messageInfo">
            <img 
              src={
                message.senderId === currentUser.uid
                  ? currentUser.photoURL
                  : data.user.photoURL
              }
              alt="" 
            />
            <span>{`${dateMessage.getFullYear()}/${dateMessage.getMonth() + 1}/${dateMessage.getDate()}`}</span>
            <span>{`${dateMessage.getHours()}:${dateMessage.getMinutes() > 9 ? dateMessage.getMinutes() : '0'+dateMessage.getMinutes()}`}</span>
        </div>
        <div className="options">
          {
            message.senderId === currentUser.uid
            && (updateMessage 
                ? (
                  <>
                    <i className="fa-solid fa-floppy-disk" onClick={handleSaveMessage}></i>
                    <i className="fa-solid fa-ban" onClick={handleCancel}></i>
                  </>
                )
                : (
                  <>
                    <i className="fa-solid fa-pen-to-square" onClick={handleUpdateMessage}></i>
                    <i className="fa-solid fa-trash" onClick={handleDeleteMessage}></i>
                  </>
                ))
          }
        </div>
        <div className={`${message.senderId !== currentUser.uid ? "messageContent" : "owner-messageContent"}`}>
          {
            updateMessage ? <input type="text" onChange={event => setText(event.target.value)} value={text} /> : <p>{decryptedMessage}</p>  
          }
          {message.type === 'image' && <img src={message.file} alt="" />}
          {message.type === 'video' && <video src={message.file} controls></video>}
          {message.type === 'audio' && <audio src={message.file} controls></audio>}
        </div>
      </div>

    
  )
}