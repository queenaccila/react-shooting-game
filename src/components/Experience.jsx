// Experience.jsx
// code referenced from https://github.com/wass08/r3f-playroom-multiplayer-shooter-game/blob/main/src/components/Experience.jsx
import React, { useState, useEffect } from 'react';
import { Environment } from "@react-three/drei";
import {
  Joystick,
  insertCoin,
  isHost,
  myPlayer,
  onPlayerJoin,
  useMultiplayerState,
  addBot,
} from "playroomkit";
import { BoxGeometry, MeshStandardMaterial, Mesh } from "three";
import { Bullet } from "./Bullet";
import { BulletHit } from "./BulletHit";
import { CharacterController } from "./CharacterController";
import { Map } from "./Map";
import { v4 as uuidv4 } from 'uuid';
import QuizModal from './QuizModal'; //included other components for custom block hitting

// custom component made by us
const generateRandomBoxes = (numBoxes, xRange, zRange) => {
  const boxes = [];
  for (let i = 0; i < numBoxes; i++) {
    const boxGeometry = new BoxGeometry(1, 1, 1);
    const boxMaterial = new MeshStandardMaterial({ color: "green" });
    const box = new Mesh(boxGeometry, boxMaterial);
    box.position.set(
      Math.random() * (xRange[1] - xRange[0]) + xRange[0],
      0.5,
      Math.random() * (zRange[1] - zRange[0]) + zRange[0]
    );
    box.castShadow = true;
    box.receiveShadow = true;

    boxes.push({ id: uuidv4(), mesh: box });
  }
  return boxes;
};

// continuation of the template code
export const Experience = ({ downgradedPerformance = false }) => {
  const [players, setPlayers] = useState([]);
  const [boxes, setBoxes] = useState(generateRandomBoxes(1000, [-50, 50], [-50, 50]));
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [currentPlayerId, setCurrentPlayerId] = useState(null);
  const [currentPlayerPosition, setCurrentPlayerPosition] = useState([0, 0, 0]);

  const start = async () => {
    await insertCoin({ matchmaking: true });

    onPlayerJoin((state) => {
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

  const [bullets, setBullets] = useState([]);
  const [hits, setHits] = useState([]);

  const [networkBullets, setNetworkBullets] = useMultiplayerState("bullets", []);
  const [networkHits, setNetworkHits] = useMultiplayerState("hits", []);

  const onFire = (bullet) => {
    setBullets((bullets) => [...bullets, bullet]);
    console.log("Bullet fired:", bullet);
  };

  const onHit = (position, boxId, playerId, bulletId) => {
    if (boxId) {
      setHits((hits) => [...hits, { id: boxId, position }]);
      console.log("Bullet hit at position:", position, "with box ID:", boxId);
      removeBox(boxId);
      removeBullet(bulletId);
      if (playerId === myPlayer()?.id) {
        setIsQuizOpen(true);
        setCurrentPlayerId(playerId);
        setCurrentPlayerPosition(position);
      }
    } else {
      console.warn("Box ID is undefined. Cannot remove box.");
    }
  };

  const onHitEnded = (hitId) => {
    setHits((hits) => hits.filter((h) => h.id !== hitId));
    console.log("Bullet hit effect ended for hit ID:", hitId);
  };

  useEffect(() => {
    setNetworkBullets(bullets);
  }, [bullets]);

  useEffect(() => {
    setNetworkHits(hits);
  }, [hits]);

  // included more custom code to fit the blocks logic of the game
  const removeBox = (boxId) => {
    setBoxes((prevBoxes) => {
      console.log(`Removing health box with ID ${boxId}`);
      const newBoxes = prevBoxes.filter((box) => box.id !== boxId);
      console.log("New boxes length:", newBoxes.length);
      return newBoxes;
    });
  };

  const removeBullet = (bulletId) => {
    setBullets((prevBullets) => {
      const newBullets = prevBullets.filter((bullet) => bullet.id !== bulletId);
      return newBullets;
    });
  };

  const handleQuizSuccess = () => {
    const player = players.find((p) => p.state.id === currentPlayerId);
    if (player) {
      player.state.setState("health", Math.min(player.state.state.health + 20, 100));
      setIsQuizOpen(false);
    }
  };

  const handleQuizClose = () => {
    setIsQuizOpen(false);
  };

  const onKilled = (_victim, killer) => {
    const killerState = players.find((p) => p.state.id === killer).state;
    killerState.setState("kills", killerState.state.kills + 1);
  };

  return (
    <>
      <Map boxes={boxes} removeBox={removeBox} />
      {players.map(({ state, joystick }, index) => (
        <CharacterController
          key={state.id}
          state={state}
          userPlayer={state.id === myPlayer()?.id}
          joystick={joystick}
          onKilled={onKilled}
          onFire={onFire}
          downgradedPerformance={downgradedPerformance}
        />
      ))}
      {(isHost() ? bullets : networkBullets).map((bullet) => ( // part of the template
        <Bullet
          key={bullet.id}
          {...bullet}
          onHit={(position, boxId) => {
            onHit(position, boxId, bullet.player, bullet.id);
          }}
        />
      ))}
      {(isHost() ? hits : networkHits).map((hit) => (
        <BulletHit key={hit.id} {...hit} onEnded={() => onHitEnded(hit.id)} />
      ))}
      <Environment preset="sunset" />
      <QuizModal
        isOpen={isQuizOpen}
        onClose={handleQuizClose}
        onSuccess={handleQuizSuccess}
        position={currentPlayerPosition}
      />
    </>
  );
};
