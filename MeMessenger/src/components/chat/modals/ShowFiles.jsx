import { useContext } from "react";
import CryptoJS from "crypto-js";
import { AuthContext } from "../../../context/AuthContext";
import { ChatContext } from "../../../context/ChatContext";

export const ShowFiles = ({file}) => {
    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    let dateFile = file.date.toDate();
    const decryptedFile = CryptoJS.AES.decrypt(file.text, '@pTSCA42vm94yl4EE4Tjb').toString(CryptoJS.enc.Utf8);

  return (
        <div className={`message ${file.senderId === currentUser.uid ? "owner" : ""}`}>
            <div className="messageInfo">
                <img 
                    src={
                    file.senderId === currentUser.uid
                        ? currentUser.photoURL
                        : data.user.photoURL
                    }
                    alt="" 
                />
                <span>{`${dateFile.getFullYear()}/${dateFile.getMonth()+1}/${dateFile.getDate()}`}</span>
                <span>{`${dateFile.getHours()}:${dateFile.getMinutes() > 9 ? dateFile.getMinutes() : '0'+dateFile.getMinutes()}`}</span>
            </div>
            
            <div className={`${file.senderId !== currentUser.uid ? "messageContent" : "owner-messageContent"}`}>
                <p>{decryptedFile}</p> 
                {file.type === 'image' && <img src={file.file} alt="" />}
                {file.type === 'video' && <video src={file.file} controls></video>}
                {file.type === 'audio' && <audio src={file.file} controls></audio>}
            </div>
        </div>
  )
}