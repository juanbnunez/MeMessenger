import { useContext } from "react";
import { useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";
import { ModalsContext } from "../../../context/ModalsContext";
import { ChatContext } from "../../../context/ChatContext";
import { ShowFiles } from "./ShowFiles";
//const icons = require.context('../../../assets', true);
import backIcon from '../../../assets/back.svg';

export const ModalFilter = () => {

  const { stateModalFilter, setStateModalFilter } = useContext(ModalsContext);
  const { data } = useContext(ChatContext);
  
  const [files, setFiles] = useState([])
  const [dateFilter, setDateFilter] = useState("");
  const [showFiles, setShowFiles] = useState([])
  const [error, setError] = useState(false)

  const filter = async() => {
    setFiles(null);
    //console.log(document.getElementById("date-filter").value)
    setDateFilter(document.getElementById("date-filter").value)
    await onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      setFiles(doc.data());
    });
    
    Object.entries(files)?.map( file => (
      handleSearch(file[1])
    ))
  }
  const handleSearch = (file) => {
    let listShowFiles = []
    setShowFiles(listShowFiles)
    if(dateFilter !== ""){
      Object.entries(file).sort((a,b)=>a[1].date - b[1].date).forEach((onefile) => {
        let year = (onefile[1].date.toDate().getFullYear())
        let month = (onefile[1].date.toDate().getMonth())+1
        let day = (onefile[1].date.toDate().getDate())
        if((onefile[1]?.type === 'image' || onefile[1]?.type === 'video') && dateFilter.includes(year) && dateFilter.includes(month) && dateFilter.includes(day)){
          listShowFiles = [...listShowFiles, onefile]
        }
      })

      setShowFiles(listShowFiles)
      if(listShowFiles.length === 0){
        setError(true)
      }else{
        setError(false)
      }
    }else{
      setError(false)
      listShowFiles = []
      setShowFiles(listShowFiles)
    }
  }

  const handleBack = () => {
    setStateModalFilter(!stateModalFilter)
    const listEmpty = []
    setShowFiles(listEmpty)
    document.getElementById("date-filter").value=""
  }

  return (
    <>
      { stateModalFilter &&
        <div className="containerModal">
          <div className="ModalSearch">
            <div className="ModalSearch-input">
            <img className='img-darkBack' src={backIcon} alt="Back" onClick={handleBack} />
              <input 
                type="date"
                id="date-filter" 
                className="search-input" 
                placeholder="Search for a message" 
              />
              <button onClick={filter}>Filter</button>
            </div>
            {!error 
              ?
              <div className="messages-search">
                {
                  showFiles.map( file => (<ShowFiles file={file[1]} key={file[0]}/>))
                }
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