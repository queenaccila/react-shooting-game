import { Environment } from "@react-three/drei";
import {
  Joystick,
  insertCoin,
  myPlayer,
  onPlayerJoin,
} from "playroomkit";
import { useEffect, useState } from "react";
import { CharacterController } from "./CharacterController";
import { Map } from "./Map";

export const Experience = () => {
  const [players, setPlayers] = useState([]);
  const start = async () => {
    // Start the game
    await insertCoin();

    // Create a joystick controller for each joining player
    onPlayerJoin((state) => {
      // Joystick will only create UI for current player (myPlayer)
      // For others, it will only sync their state
      const joystick = new Joystick(state, {
        type: "angular",
        buttons: [{ id: "fire", label: "Fire" }],
      });
      const newPlayer = { state, joystick };
      state.setState("health", 100);
      state.setState("deaths", 0);
      state.setState("kills", 0);
      setPlayers((players) => [...players, newPlayer]);
      state.onQuit(() => {
        setPlayers((players) => players.filter((p) => p.state.id !== state.id));
      });
    });
  };

  useEffect(() => {
    start();
  }, []);
  
  return (
    <>
      <directionalLight 
        position={[30, 20, -30]}
        intensity={0.1}
        castShadow
        shadow-camera-near={10}
        shadow-camera-far={50}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-bias={0}
      />
      <Map />
      {players.map(({ state, joystick }, index) => (
        <CharacterController
          key={state.id}
          state={state}
          userPlayer={state.id === myPlayer()?.id}
          joystick={joystick}
        />
      ))}
      <Environment preset="sunset" />
    </>
  );
};
