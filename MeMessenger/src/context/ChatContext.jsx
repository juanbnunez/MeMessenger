import { createContext, useContext, useReducer } from "react";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const INITIAL_STATE = {
    chatId: "null",
    user: {},
    lastMessage: ""
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user: action.payload.user,
          lastMessage: action.payload.lastMessage,
          chatId:
            currentUser.uid > action.payload.user.uid
              ? currentUser.uid + action.payload.user.uid
              : action.payload.user.uid + currentUser.uid,
        };
        case "CHANGE_LASTMESSAGE":
          return {
            ...state,
            lastMessage: action.payload
          };
        case "CHANGE_BLOCK":
          return {
            ...state,
            user: action.payload,
          };
        case "CHANGE_IBLOCK":
          return {
            ...state,
            user: action.payload,
          };
      
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data:state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};