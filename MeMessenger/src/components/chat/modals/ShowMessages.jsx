import { useContext } from "react";
import CryptoJS from "crypto-js";
import { AuthContext } from "../../../context/AuthContext";
import { ChatContext } from "../../../context/ChatContext";

export const ShowMessages = ({ message }) => {

    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    let dateMessage = message.date.toDate();
    const decryptedMessage = CryptoJS.AES.decrypt(message.text, '@pTSCA42vm94yl4EE4Tjb').toString(CryptoJS.enc.Utf8);

  return (
        <div className={`message ${message.senderId === currentUser.uid ? "owner" : ""}`}>
            <div className="messageInfo">
                <img 
                    src={
                    message.senderId === currentUser.uid
                        ? currentUser.photoURL
                        : data.user.photoURL
                    }
                    alt="" 
                />
                <span>{`${dateMessage.getFullYear()}/${dateMessage.getMonth()+1}/${dateMessage.getDate()}`}</span>
                <span>{`${dateMessage.getHours()}:${dateMessage.getMinutes() > 9 ? dateMessage.getMinutes() : '0'+dateMessage.getMinutes()}`}</span>
            </div>
            
            <div className={`${message.senderId !== currentUser.uid ? "messageContent" : "owner-messageContent"}`}>
                <p>{decryptedMessage}</p> 
                {message.type === 'image' && <img src={message.file} alt="" />}
                {message.type === 'video' && <video src={message.file} controls></video>}
                {message.type === 'audio' && <audio src={message.file} controls></audio>}
            </div>
        </div>
  )
}