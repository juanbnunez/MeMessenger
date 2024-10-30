import React, { useContext } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { ModalsContext } from '../../context/ModalsContext';
import { Input } from './Input';
import { Messages } from './Messages';
import { ModalOptions } from "./modals/ModalOptions";

import "./styles.css"
import { ModalBlock } from './modals/ModalBlock';
import { ModalSearch } from './modals/ModalSearch';
import { ModalFilter } from './modals/ModalFilter';
//const icons = require.context('../../assets', true);
import backIcon from '../../assets/back.svg';
import moreIcon from '../../assets/more.svg';

export const Chat = () => {

  const { data } = useContext(ChatContext);

  const { stateModalOption, setStateModalOption } = useContext(ModalsContext);

  const handleSelect = () => {
    if(window.innerWidth<=632){
      document.getElementById("sidebar").classList.remove("close");
      document.getElementById("chat").classList.remove("open");

      document.getElementById("chat").classList.add("close");
      document.getElementById("sidebar").classList.add("open");
    }
  }

  const handleOptions = () => {
    if(data.chatId !== "null"){
      setStateModalOption(!stateModalOption)
    }
    
  }



  return (
    <div className="chat" id='chat'>
      <div className='main-chatInfo'>
      <img className="img-back" src={backIcon} alt="Back" onClick={handleSelect} />
        <div className="chatInfo">
          <span>{ data.user?.displayName }</span>
          <ModalOptions/>
          <div className="chatIcons">
            {/* <img src={icons('./addFriend.svg')} alt="" /> */}
            <img src={moreIcon} alt="More" onClick={handleOptions} />
          </div>
        </div>
      </div>
      <Messages/>
      <Input/>
      <ModalFilter/>
      <ModalSearch/>
      <ModalBlock/>
    </div>
  )
}