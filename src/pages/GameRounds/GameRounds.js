import './GameRounds.css';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { socket } from '../../Socket';

function GameRounds() {
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
    <div className="gameRounds">
       <div className="top">
          {roomIn && <h3>Room {roomIn}</h3>}
          {bossNotifiedMessage && <h3>{bossNotifiedMessage}</h3>}
          {clientsCount && <h3>Players : {clientsCount}</h3>}
          <Link className="link" to="/">Home</Link>
        </div>
        <h4>Le jeu va commencer</h4>
    </div>
  );
}

export default GameRounds;
