import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useEffect } from "react";
import { BoxGeometry, MeshStandardMaterial, Mesh } from "three";

const generateRandomBoxes = (numBoxes, xRange, zRange) => {
  const boxes = [];
  for (let i = 0; i < numBoxes; i++) {
    const boxGeometry = new BoxGeometry(1, 1, 1);
    const boxMaterial = new MeshStandardMaterial({ color: "green" });
    const box = new Mesh(boxGeometry, boxMaterial);
    box.position.set(
      Math.random() * (xRange[1] - xRange[0]) + xRange[0],
      0.5,  // Set Y coordinate to 0.5 to make them a bit lower
      Math.random() * (zRange[1] - zRange[0]) + zRange[0]
    );
    box.castShadow = true;
    box.receiveShadow = true;

    boxes.push({ id: i, mesh: box });
  }
  return boxes;
};

// Map is the only code referenced from https://github.com/wass08/r3f-playroom-multiplayer-shooter-game/blob/main/src/components/Map.jsx
export const Map = ({ boxes, removeBox }) => {
  const map = useGLTF("/models/game-scene_6.glb");

  useEffect(() => {
    map.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [map]);
// end of referenced code

  return (
    <>
      <RigidBody colliders="trimesh" type="fixed">
        <primitive object={map.scene} />
      </RigidBody>
      {boxes.map((box) => (
        <RigidBody
          key={box.id}
          colliders="cuboid"
          type="fixed"
          userData={{ type: "healthBox", id: box.id }}
          position={box.mesh.position}
          onClick={() => removeBox(box.id)} // Handle click event to remove box
        >
          <primitive object={box.mesh} />
        </RigidBody>
      ))}
    </>
  );
};

useGLTF.preload("/models/game-scene_6.glb");

export { generateRandomBoxes };
