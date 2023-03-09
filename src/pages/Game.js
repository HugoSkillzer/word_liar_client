import '../App.css';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { socket } from '../Socket';

function Game() {
  const [bossNotifiedMessage, setBossNotifiedMessage] = useState("");
  const [room, setRoom] = useState("");
  const [clientsCount, setClientsCount] = useState("");

  const accessPage = () => {
    socket.emit("access_page");
  }

  useEffect(() => {
    accessPage();
    socket.on("clients_count", (data) => {
        setClientsCount(data);
      });
    socket.on("boss_notified", (data) => {
        setBossNotifiedMessage(data);
      });
    socket.on("room_response", (data) => {
        setRoom(data);
    });
  }, [socket]);

  return (
    <div>
        <div>{room && <h1>Room {room}</h1>}</div>
        <div>{bossNotifiedMessage && <h3>{bossNotifiedMessage}</h3>}</div>
        <div>{clientsCount && <h3>Nombre de joueurs : {clientsCount}</h3>}</div>
        <Link to="/">Home</Link>
    </div>
  );
}

export default Game;
