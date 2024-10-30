import { useContext } from "react";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { AuthContext } from "../../../context/AuthContext";
import { ChatContext } from "../../../context/ChatContext";
import { ModalsContext } from "../../../context/ModalsContext";
import swal from 'sweetalert';

export const ModalBlock = () => {

  const { currentUser } = useContext(AuthContext);
  const { data, dispatch } = useContext(ChatContext);
  const { stateModalBlock, setStateModalBlock } = useContext(ModalsContext);


  const handleBlock = async() => {
    setStateModalBlock(!stateModalBlock);

    const chatsC = collection(db, 'userChats');
    const chatsSP = await getDocs(chatsC);

    let tempUserChat = []
    chatsSP.docs.forEach((element) => {
      if(element.id === data.user?.uid){
        tempUserChat = element.data()
      }
    })

    let tempIBlock = false
    Object.entries(tempUserChat).forEach((element) => {
      if(element[0] === data.chatId){
        if(element[1].userInfo.block === true){
          tempIBlock = true
        }
      }
    })

    if(!tempIBlock){
      let block = (data.user?.block)

      const newOwnerInfo =  {
        uid: data.user?.uid,
        displayName: data.user?.displayName,
        photoURL: data.user?.photoURL,
        block: !block
      }

      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatId + ".userInfo"]: newOwnerInfo
      });

      dispatch({ type: "CHANGE_BLOCK", payload: newOwnerInfo });
    }else{;
      swal("It could not",`${ data.user?.displayName } blocked you`,"warning");
    }
  }


  return (
    <>
      {stateModalBlock && 
        <div className="containerModal">
          <div className="ModalBlock">
            <p>Do you want {data.user?.block ? 'to unblock': 'block'} { data.user?.displayName }?</p>
            <div className="ModalBlock-buttons">
              <button className="button-block" onClick={ handleBlock }>{data.user?.block ? 'Unblock': 'Block'}</button>
              <button className="button-cancel" onClick={ () => setStateModalBlock(!stateModalBlock) }>Cancel</button>
            </div>
          </div>
        </div>
      }
    </>
  )
}