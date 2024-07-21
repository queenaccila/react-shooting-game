import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useMemo } from "react";
import { BoxGeometry, MeshStandardMaterial, Mesh } from "three";

const generateRandomBoxes = (numBoxes, xRange, zRange) => {
  const boxes = [];
  for (let i = 0; i < numBoxes; i++) {
    const boxGeometry = new BoxGeometry(1, 1, 1);
    const boxMaterial = new MeshStandardMaterial({ color: "green" });
    const box = new Mesh(boxGeometry, boxMaterial);
    box.position.set(
      Math.random() * (xRange[1] - xRange[0]) + xRange[0],
      0.5,  // 将Y坐标调整为0.5，使它们稍微低一点
      Math.random() * (zRange[1] - zRange[0]) + zRange[0]
    );
    box.castShadow = true;
    box.receiveShadow = true;

    boxes.push(box);
  }
  return boxes;
};

export const Map = ({ boxes, removeBox }) => {
  const map = useGLTF("/models/game-scene_3.glb");

  useEffect(() => {
    map.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [map]);

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
        >
          <primitive object={box.mesh} />
        </RigidBody>
      ))}
    </>
  );
};

useGLTF.preload("/models/game-scene_3.glb");
