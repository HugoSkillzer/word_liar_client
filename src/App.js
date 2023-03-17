import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import WebFont from 'webfontloader';
import { useEffect } from "react";
import GameInitialization from "./pages/GameInitialization/GameInitialization";
import GameRounds from "./pages/GameRounds/GameRounds";

export default function App() {
  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Single Day']
      }
    });
   }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="game_initialization" element={<GameInitialization />} />
          <Route path="game_rounds" element={<GameRounds />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}