import { Environment, OrbitControls } from "@react-three/drei";
import { Map } from "./map";
import { useEffect, useState } from "react";
import { insertCoin, myPlayer, onPlayerJoin, Joystick } from "playroomkit";
import { CharacterController } from "./CharacterController";

export const Experience = () => { 
  const [players, setPlayers] = useState([]);

  const start = async () => {
    await insertCoin();
  }
  
  useEffect(() => {
    start();

    // joystick adds to each player UI when joining
    onPlayerJoin((state) => {
      const joystick = new Joystick(state, {
        type: "angular",
        buttons: [{id: "fire", label: "Fire"}],
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
      <OrbitControls />
      <Map />
      {
        players.map(({ state, joystick }, idx) => (
          <CharacterController
            key={state.id}
            position-x={idx * 2}
            state={state}
            joystick={joystick}
            userPlayer={state.id === myPlayer()?.id}
          />
        ))
      }
      <Environment preset="sunset" />
    </>
  );
};
