import './Home.css';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { socket } from '../../Socket';

function App() {
  const [room, setRoom] = useState("");
  const [roomIn, setRoomIn] = useState("");
  const [clientsCount, setClientsCount] = useState("");
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const [bossNotifiedMessage, setBossNotifiedMessage] = useState("");
  const [placeholderJoinRoom, setPlaceholderJoinRoom] = useState("Room...");

  const joinRoom = () => {
    socket.emit("join_room", room );
  };

  const sendMessage = () => {
    socket.emit("send_message", { message });
  };

  const accessPage = () => {
    socket.emit("access_page");
  }

  useEffect(() => {
    accessPage();
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message);
    });
    socket.on("clients_count", (data) => {
      setClientsCount(data);
    });
    socket.on("boss_notified", (data) => {
      setBossNotifiedMessage(data);
    });
    socket.on("room_response", (data) => {
      setRoomIn(data);
      setPlaceholderJoinRoom(data);
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
        {roomIn && <h3>Room {roomIn}</h3>}
        {bossNotifiedMessage && <h3>{bossNotifiedMessage}</h3>}
      </div>
      <div class="gameLaunchInfos">
        {clientsCount && <h3>Players : {clientsCount}</h3>}
        {bossNotifiedMessage && <Link className="link" to="/game">Play</Link>}
      </div>
      <br/><br/>
    </div>
  );
}

export default App;
