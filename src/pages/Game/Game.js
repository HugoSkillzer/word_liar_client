import './Game.css';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { socket } from '../../Socket';

function Game() {
  const [bossNotifiedMessage, setBossNotifiedMessage] = useState("");
  const [roomIn, setRoomIn] = useState("");
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
        setRoomIn(data);
    });
  }, [socket]);

  return (
    <div className="game">
       <div className="top">
          <div>{roomIn && <h3 className="room">Room {roomIn}</h3>}</div>
          <Link className="link" to="/">Home</Link>
        </div>
        <div>{bossNotifiedMessage && <h3>{bossNotifiedMessage}</h3>}</div>
        <div>{clientsCount && <h3>Nombre de joueurs : {clientsCount}</h3>}</div>
    </div>
  );
}

export default Game;
