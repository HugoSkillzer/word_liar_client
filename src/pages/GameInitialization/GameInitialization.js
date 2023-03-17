import './GameInitialization.css';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { socket } from '../../Socket';
import { useNavigate } from "react-router-dom";
import { ReactComponent as ValidSvg } from '../../assets/accept-icon.svg';

function GameInitialization() {
  const navigate = useNavigate();
  const [bossNotifiedMessage, setBossNotifiedMessage] = useState("");
  const [roomIn, setRoomIn] = useState("");
  const [clientsCount, setClientsCount] = useState("");
  const [myWords, setMyWords] = useState("");
  const [resumeWord, setResumeWord] = useState("");
  const [isResumeWordSent, setIsResumeWordSent] = useState(false);
  const [nonReadyPlayersNumber, setNonReadyPlayersNumber] = useState("");

  const accessPage = () => {
    socket.emit("access_page");
  }

  const sendResumeWord = () => {
    socket.emit("resume_word", resumeWord);
    setIsResumeWordSent(true);
  };

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
    socket.on("your_words", (data) => {
      setMyWords(data);
    });
    socket.on("players_ready", (data) => {
      setNonReadyPlayersNumber(data);
    });
    socket.on("play_game", () => {
      navigate("/game_rounds");
    });
  }, [socket]);

  return (
    <div className="gameInitialization">
       <div className="top">
          {roomIn && <h3>Room {roomIn}</h3>}
          {bossNotifiedMessage && <h3>{bossNotifiedMessage}</h3>}
          {clientsCount && <h3>Players : {clientsCount}</h3>}
          <Link className="link" to="/">Home</Link>
        </div>
        {myWords &&
          <div className="gameInitializationSpace">
            <h4>My words</h4>
            <p>{myWords}</p>
            <div className='resumeWordBlock'>
              <input className="resumeWord" placeholder='My Resume Word' disabled={isResumeWordSent} onChange={(event) => {
                setResumeWord(event.target.value);
              }}/>
              {!isResumeWordSent && <button onClick={sendResumeWord}>Confirm</button>}
              {isResumeWordSent && <ValidSvg />}
            </div>
          </div>
        }
        {nonReadyPlayersNumber && <p>{nonReadyPlayersNumber}</p>}
    </div>
  );
}

export default GameInitialization;
