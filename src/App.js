import './App.css';
import io from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io.connect("http://localhost:1234");

function App() {
  const [room, setRoom] = useState("");
  const [clientsCount, setClientsCount] = useState("");
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");

  const joinRoom = () => {
    socket.emit("join_room", room );
  };

  const sendMessage = () => {
    socket.emit("send_message", { message, room });
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message);
    });
    socket.on("clients_count", (data) => {
      setClientsCount(data);
    });
  }, [socket]);

  return (
    <div className="App">
      <input placeholder='Room...' onChange={(event) => {
        setRoom(event.target.value);
      }}/>
      <button onClick={joinRoom}>Join Room</button>
      <input placeholder='Message...' onChange={(event) => {
        setMessage(event.target.value);
      }}/>
      <button onClick={sendMessage}>Send Message</button>
      <h1>Nombre de joueurs : </h1>
      {clientsCount}
      <h2>Message :</h2>
      {messageReceived}
    </div>
  );
}

export default App;
