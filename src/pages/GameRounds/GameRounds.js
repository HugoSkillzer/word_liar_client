import './GameRounds.css';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { socket } from '../../Socket';

function GameRounds() {
  const navigate = useNavigate();
  const [bossNotifiedMessage, setBossNotifiedMessage] = useState("");
  const [roomIn, setRoomIn] = useState("");
  const [clientsCount, setClientsCount] = useState("");
  const [roundNumber, setRoundNumber] = useState("");
  const [resumeWords, setResumeWords] = useState({});
  const [wordToGuess, setWordToGuess] = useState("");
  const [otherPlayers, setOtherPlayers] = useState([]);
  const [isTraitorVoted, setIsTraitorVoted] = useState(false);
  const [isTraitor, setIsTraitor] = useState(false);
  const [traitor, setTraitor] = useState("");
  const [innocent, setInnocent] = useState("");
  const [secretWordsOpened, setSecretWordsOpened] = useState(false);
  const [lastRound, setLastRound] = useState(false);
  const [noInnocentVote, setNoInnocentVote] = useState(false);

  const accessPage = () => {
    socket.emit("access_page");
  }

  const handleClickTraitor = (event) => {
    // accessible
    var elems = document.querySelectorAll('.voteTraitorButtons button');
    elems.forEach(elem => {
      elem.classList.add('notVoted');
      elem.disabled = true;
    })
    event.target.classList.remove("notVoted");
    setIsTraitorVoted(true);
    setTraitor(event.target.innerText);
    if(noInnocentVote === true) {
      console.log("pas d'innocent");
      setInnocent("personne");
    }
 }

  const handleClickInnocent = (event) => {
    var elems = document.querySelectorAll('.voteInnocentButtons button');
    elems.forEach(elem => {
      elem.classList.add('notVoted');
      elem.disabled = true;
    })
    event.target.classList.remove("notVoted");
    setInnocent(event.target.innerText);
  }

  const displayOrNotDisplaySecretWords = () => {
    if(secretWordsOpened == true) {
      setSecretWordsOpened(false);
    } else {
      setSecretWordsOpened(true);
    }
  }

  const disableNextButton = (choice) => {
    var elems = document.querySelectorAll('.playNextBlock button');
    elems.forEach(elem => {
      elem.disabled = choice;
    })
  }

  const gameRoundsInit = () => {
    socket.emit("game_rounds_init");
  }

  const playNextRound = () => {
    socket.emit("play_next_round");
  }

  const showResults = () => {
    socket.emit("show_results");
  }

  const sendVotes = () => {
    if(innocent && traitor && innocent && wordToGuess) {
      socket.emit("vote", {roundNumber, traitor, innocent, wordToGuess});
    }
  }

  const goHome = () => {
    socket.emit("disconnect_from_game");
    navigate("/");
  }

  useEffect(() => {
    sendVotes();
  }, [innocent]);

  useEffect(() => {
    accessPage();
    gameRoundsInit();
    socket.on("room_response", (data) => {
      setRoomIn(data);
    });
    socket.on("clients_count", (data) => {
      setClientsCount(data);
    });
    socket.on("boss_notified", (data) => {
      setBossNotifiedMessage(data);
    });
    socket.on("resume_words", (data) => {
      const dataParsed = JSON.parse(data)
      setResumeWords(dataParsed);
    });
    socket.on("round_number", (data) => {
      disableNextButton(true);
      setIsTraitorVoted(false);
      setWordToGuess("")
      setOtherPlayers([]);
      setTraitor("");
      setInnocent("");
      if(data != "end") {
        setRoundNumber(data);
      } else {
        setLastRound(true);
      }
    });
    socket.on("word_to_guess", (data) => {
      setWordToGuess(data);
    });
    socket.on("traitor", (data) => {
      setIsTraitor(data);
    });
    socket.on("other_players", (data) => {
      setOtherPlayers(data);
    });
    socket.on("vote_complete", () => {
      disableNextButton(false);
    });
    socket.on("no_innocent_vote", () => {
      setNoInnocentVote(true);
    })
    socket.on("no_enough_player", () => {
      alert("Game ended because there is not enough players");
      goHome();
    })
    socket.on("go_to_results", () => {
      navigate("/results");
    });
  }, [socket]);

  return (
    <div className="gameRounds">
       <div className="top">
          {roomIn && <h3>Room {roomIn}</h3>}
          {bossNotifiedMessage && <h3>{bossNotifiedMessage}</h3>}
          {clientsCount && <h3>Players : {clientsCount}</h3>}
          <button onClick={goHome}>Home</button>
        </div>
        <div className='resumeWordsBlock' onClick={displayOrNotDisplaySecretWords}>
          <h3>Secret words</h3>
          {secretWordsOpened && <div className='resumeWords'>
            {Object.keys(resumeWords).map((pseudo,i) => (
              <div>
                <h4>{pseudo}</h4>
                <p>{resumeWords[pseudo]}</p>
              </div>
              ))}
          </div>}
        </div>
        <div className='playNextBlock'>
          {roundNumber && <h3>Round {roundNumber}</h3>}
          {!lastRound && bossNotifiedMessage && <button className="playNextRound" onClick={playNextRound}>Next Round</button>}
          {lastRound && bossNotifiedMessage && <button className="showResults" onClick={showResults}>Show results</button>}
        </div>
        {wordToGuess &&<div className='playingArea'>
          <h3>The word to guess is : </h3>
          <h3 className='wordToGuess'>{wordToGuess}</h3>
          <div className='voteArea'>
            {isTraitor && <h4>You are the traitor</h4>}
            {!isTraitor && <h4>Vote for the traitor</h4>}
            <div className='voteTraitorButtons'>
              {otherPlayers.map((player) => (
                <button onClick={e => handleClickTraitor(e)}>{player}</button>
              ))}
            </div>
            {!noInnocentVote && isTraitorVoted && <div>
              <h4>Vote for the person it's absolutely not</h4>
              <div className='voteInnocentButtons'>
                {otherPlayers.map((player) => (
                  player != traitor && <button onClick={e => handleClickInnocent(e)}>{player}</button>
                ))}
              </div>
            </div>}
          </div>
        </div>}
    </div>
  );
}

export default GameRounds;
