import './Results.css';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { socket } from '../../Socket';

function GameRounds() {
  const navigate = useNavigate();
  const [bossNotifiedMessage, setBossNotifiedMessage] = useState("");
  const [roomIn, setRoomIn] = useState("");
  const [clientsCount, setClientsCount] = useState("");
  const [ranking, setRanking] = useState();
  const [message, setMessage] = useState("");

  const accessPage = () => {
    socket.emit("access_page");
    socket.emit("ask_results");
  }

  const goHome = () => {
    socket.emit("disconnect_from_game");
    navigate("/");
  }

  useEffect(() => {
    accessPage();
    socket.on("room_response", (data) => {
      setRoomIn(data);
    });
    socket.on("clients_count", (data) => {
      setClientsCount(data);
    });
    socket.on("boss_notified", (data) => {
      setBossNotifiedMessage(data);
    });
    socket.on("ranking", (data) => {
      const dataParsed = JSON.parse(data)
      setRanking(dataParsed);
    });
    socket.on("victory", () => {
      console.log("reçu victoire");
      setMessage("You won!! You're definitely Sherlock Holmes");
    });
    socket.on("defeat", () => {
      console.log("reçu defaite");
      setMessage("You lost... LOOSER, t'as les cramptés ?");
    });
    socket.on("no_enough_player", () => {
      alert("Game ended because there is not enough players");
      goHome();
    })
  }, [socket]);

  return (
    <div className="results">
       <div className="top">
          {roomIn && <h3>Room {roomIn}</h3>}
          {bossNotifiedMessage && <h3>{bossNotifiedMessage}</h3>}
          {clientsCount && <h3>Players : {clientsCount}</h3>}
          <button onClick={goHome}>Home</button>
        </div>
        {ranking && <div className='ranking'>
          <h3>Ranking</h3>
          <h4>
            <span className='rank'>Rank</span>
            <span className='player'>Player</span>
            <span className='points'>Points</span>
          </h4>
          {Object.keys(ranking).map((player,i) => (
            <p>
              <span className='rank'>{i+1}.</span>
              <span className='player'>{player}</span>
              <span className='points'>{ranking[player]} {ranking[player] > 1 ? 'points' : 'point'}</span>
            </p>
            ))}
          <p><b>{message}</b></p>
        </div>}
        
    </div>
  );
}

export default GameRounds;
