import './Home.css';
import { useEffect, useState } from "react";
import { socket } from '../../Socket';
import { useNavigate } from "react-router-dom";
import { ReactComponent as HomeSvg } from '../../assets/fun.svg';

function App() {
  const navigate = useNavigate();
  const [room, setRoom] = useState("");
  const [roomIn, setRoomIn] = useState("");
  const [clientsCount, setClientsCount] = useState("");
  const [bossNotifiedMessage, setBossNotifiedMessage] = useState("");
  const [placeholderJoinRoom, setPlaceholderJoinRoom] = useState("Room...");
  const [defaultPseudo, setDefaultPseudo] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [canPlay, setCanPlay] = useState(false);

  const joinRoom = () => {
    socket.emit("join_room", {room, pseudo});
  };

  const launchGame = () => {
    socket.emit("launch_game");
  };

  const accessPage = () => {
    socket.emit("access_page");
  }

  useEffect(() => {
    accessPage();
    socket.on("can_play", () => {
      console.log("can play");
      setCanPlay(true);
    })
    socket.on("default_pseudo", (data) => {
      setDefaultPseudo(data);
      setPseudo(data);
    });
    socket.on("clients_count", (data) => {
      setClientsCount(data);
    });
    socket.on("boss_notified", (data) => {
      if(data == "Boss") {
        setBossNotifiedMessage(data);
      } else {
        setBossNotifiedMessage("");
      }
    });
    socket.on("room_response", (data) => {
      setRoomIn(data);
      setPlaceholderJoinRoom(data);
    });
    socket.on("room_occupied", (data) => {
      alert(data);
    });
    socket.off("game_launched").on("game_launched", () => {
      navigate("/game_initialization");
    });
  }, [socket]);

  return (
    <div className="home">
      <div className="top">
        <div>
          <input className="joinRoom" placeholder={placeholderJoinRoom} onChange={(event) => {
            setRoom(event.target.value);
          }}/>
          <button onClick={joinRoom}>Join</button>
        </div>
        {!roomIn && <input className="pseudo" placeholder={defaultPseudo} onChange={(event) => {
            setPseudo(event.target.value);
            }}/>}
        {roomIn && <h3>Room {roomIn}</h3>}
        {bossNotifiedMessage && <h3>{bossNotifiedMessage}</h3>}
      </div>
      <div className="gameLaunchInfos">
        {clientsCount && <h3>Players : {clientsCount}</h3>}
        {bossNotifiedMessage && canPlay && <button className="link" onClick={launchGame}>Play</button>}
      </div>
      <br/>
      <h1 className='gameName'>F*ck <br/>the liar</h1>
      <HomeSvg />
    </div>
  );
}

export default App;
