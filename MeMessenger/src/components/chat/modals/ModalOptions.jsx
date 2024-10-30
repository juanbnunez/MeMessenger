import { useContext } from "react";
import { ChatContext } from "../../../context/ChatContext";
import { ModalsContext } from "../../../context/ModalsContext";

export const ModalOptions = () => {

    const { data } = useContext(ChatContext);    
    
    const 
        { 
            stateModalOption, setStateModalOption, 
            stateModalBlock, setStateModalBlock, 
            stateModalSearch, setStateModalSearch,
            stateModalFilter, setStateModalFilter 
        } = useContext(ModalsContext);

    const handleFilter = () =>{
        setStateModalOption(!stateModalOption);
        setStateModalFilter(!stateModalFilter);
    }

    const handleSearch = () =>{
        setStateModalOption(!stateModalOption);
        setStateModalSearch(!stateModalSearch)
    }

    const handleBlock = () =>{
        setStateModalOption(!stateModalOption);
        setStateModalBlock(!stateModalBlock)
    }

  return (
    <>
        {stateModalOption &&
        <div className="containerModalOptions">
            <div className="modalOptions">
                <p onClick={handleFilter}>Filter files</p>
                <p onClick={handleSearch}>Search messages</p>
                <p className="block" onClick={handleBlock}>{data.user?.block ? 'Unblock': 'Block'}</p>
            </div>
        </div>
        }
    </>
  )
}