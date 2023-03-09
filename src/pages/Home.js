import '../App.css';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { socket } from '../Socket';

function App() {
  const [room, setRoom] = useState("");
  const [clientsCount, setClientsCount] = useState("");
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const [bossNotifiedMessage, setBossNotifiedMessage] = useState("");
  const [placeholderJoinRoom, setPlaceholderJoinRoom] = useState("Room...");

  const joinRoom = () => {
    socket.emit("join_room", room );
  };

  const sendMessage = () => {
    socket.emit("send_message", { message, room });
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
      setRoom(data);
      setPlaceholderJoinRoom(data);
    });
  }, [socket]);

  return (
    <div className="App">
      <input placeholder={placeholderJoinRoom} onChange={(event) => {
        setRoom(event.target.value);
      }}/>
      <button onClick={joinRoom}>Join Room</button>
      <input placeholder='Message...' onChange={(event) => {
        setMessage(event.target.value);
      }}/>
      <button onClick={sendMessage}>Send Message</button>
      <div>{room && <h1>Room {room}</h1>}</div>
      <div>{bossNotifiedMessage && <h3>{bossNotifiedMessage}</h3>}</div>
      <div>{clientsCount && <h3>Nombre de joueurs : {clientsCount}</h3>}</div>
      <div>
        <h2>Message :</h2>
        {messageReceived}
      </div>
      <br/><br/>
      <Link to="/game">Game on</Link>
    </div>
  );
}

export default App;
