import { createContext, useState } from "react";

export const ModalsContext = createContext();

export const ModalsContextProvider = ({ children }) => {

    const [stateModalOption, setStateModalOption] = useState(false);

    const [stateModalFilter, setStateModalFilter] = useState(false);

    const [stateModalSearch, setStateModalSearch] = useState(false);

    const [stateModalBlock, setStateModalBlock] = useState(false);

    const [stateModalStadistics, setStateModalStadistics] = useState(false);

    return(
        <ModalsContext.Provider value={
            { 
                stateModalOption, 
                setStateModalOption,
                stateModalFilter, 
                setStateModalFilter,
                stateModalSearch, 
                setStateModalSearch,
                stateModalBlock, 
                setStateModalBlock,
                stateModalStadistics, 
                setStateModalStadistics 
            }
        }>
            { children }
        </ModalsContext.Provider>
    )
}