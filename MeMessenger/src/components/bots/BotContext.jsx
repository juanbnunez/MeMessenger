
import { createContext, useState, useContext } from "react";
import { doc,  updateDoc} from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { db } from "../../firebase";
import { AuthContext } from "../../context/AuthContext";


export const BotContext = createContext();




export const BotContextProvider = ({ children }) => {

    const [botResponse, setResponse] = useState("");
    const { currentUser } = useContext(AuthContext);

    async function getTime(ubi) {
        const options = {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": "fbdaf512afmshc7a75e85d8f3e7bp1c3597jsnf7e77454c39d",
            "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
          },
        };
        fetch(
          `https://weatherapi-com.p.rapidapi.com/current.json?q=${ubi}`,
          options
        )
          .then((response) => response.json())
          .then((response) => {
            fetch(
              `https://api.timezonedb.com/v2.1/get-time-zone?key=SEVNR5J5MGZW&format=json&by=position&lat=${response.location.lat}&lng=${response.location.lon}`
            )
              .then((response) => response.json())
              .then((response) => {
                let splitTime = new Date(response.formatted);
                setResponse(
                  "En " +
                    response.cityName +
                    " son las: " +
                    splitTime.toLocaleTimeString("en-US")
                );
                return response.formatted;
              })
              .catch((err) => console.error(err));
              return response.formatted;
          })
          .catch((err) => console.error(err));
      }
    
      async function getWeather(ubi) {
        const options = {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": "fbdaf512afmshc7a75e85d8f3e7bp1c3597jsnf7e77454c39d",
            "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
          },
        };
        fetch(
          `https://weatherapi-com.p.rapidapi.com/current.json?q=${ubi}`,
          options
        )
          .then((response) => response.json())
          .then((response) => {
            let xhttp = new XMLHttpRequest();
            xhttp.open(
              "GET",
              `https://api.openweathermap.org/data/2.5/onecall?lat=${response.location.lat}&lon=${response.location.lon}&exclude=hourly,daily&appid=e976bbe171f636fea08ecb4a2aebf739`
            );
            xhttp.send();
            xhttp.onreadystatechange = function () {
              if (this.readyState === 4 && this.status === 200) {
                let dW = JSON.parse(this.responseText);
                var celcius = Math.round(parseFloat(dW.current.feels_like) - 273.15);
                setResponse(
                  `Clima en ${ubi}: ` +
                    dW.current.weather[0].description +
                    ", Temperatura: " +
                    celcius +
                    " °C"
                );
                return (
                  "The weather is " +
                  dW.current.weather[0].description +
                  " and the temperature is " +
                  celcius +
                  " grades."
                );
              }
            };       
              return response.formatted;
          })
          .catch((err) => console.error(err));
      }
    
      async function getJoke(){ 
        let xhttp = new XMLHttpRequest();
        xhttp.open("GET", `https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit`);
        xhttp.send();
        xhttp.onreadystatechange = function () {
          if (this.readyState === 4 && this.status === 200) {
            let dW = JSON.parse(this.responseText);
            if(dW.type === "twopart"){
              setResponse(dW.setup + " " + dW.delivery);
            }else{
              setResponse(dW.joke);
            }
          }
        }; 
      }
    
      async function setReminder(text, date){ 
        const id = uuid();
        await updateDoc(doc(db, 'reminders', currentUser.uid), {
          ["reminders" + `.${id}`]: {
              id,
              text,
              completed: false,
              date
            }
        });
        setResponse("Reminder set!");
      }
    

    return (
        <BotContext.Provider
          value={{
            botResponse,
            getTime,
            getWeather,
            getJoke, 
            setReminder
          }}
        >
          {children}
        </BotContext.Provider>
      )
}