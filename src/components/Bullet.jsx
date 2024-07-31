// start of code from https://github.com/wass08/r3f-playroom-multiplayer-shooter-game/blob/main/src/components/Bullet.jsx
import { RigidBody, vec3 } from "@react-three/rapier";
import { isHost } from "playroomkit";
import { useEffect, useRef } from "react";
import { MeshBasicMaterial } from "three";
import { WEAPON_OFFSET } from "./CharacterController";

const BULLET_SPEED = 20;

const bulletMaterial = new MeshBasicMaterial({
  color: "white", // assigned different color
  toneMapped: false,
});

bulletMaterial.color.multiplyScalar(42);

export const Bullet = ({ player, angle, position, onHit }) => {
  const rigidbody = useRef();

  useEffect(() => {
    const audio = new Audio("/audios/rifle.mp3"); // intended to add new audio but didn't have time
    audio.play();
    const velocity = {
      x: Math.sin(angle) * BULLET_SPEED,
      y: 0,
      z: Math.cos(angle) * BULLET_SPEED,
    };

    rigidbody.current.setLinvel(velocity, true);
    console.log("Bullet fired with velocity:", velocity);
  }, []);

  // following code was modified from https://github.com/wass08/r3f-playroom-multiplayer-shooter-game/blob/main/src/components/Bullet.jsx
  return (
    <group position={[position.x, position.y, position.z]} rotation-y={angle}>
      <group
        position-x={WEAPON_OFFSET.x}
        position-y={WEAPON_OFFSET.y}
        position-z={WEAPON_OFFSET.z}
      >
        <RigidBody
          ref={rigidbody}
          gravityScale={0}
          onIntersectionEnter={(e) => {
            console.log("Bullet intersection detected with:", e.other.rigidBody.userData.type);
            if (isHost() && e.other.rigidBody.userData?.type === "healthBox") {
              console.log("Health box hit detected");
              rigidbody.current.setEnabled(false); // 禁用子弹
              const boxId = e.other.rigidBody.userData.id;
              onHit(vec3(rigidbody.current.translation()), boxId, player);
              
              // 禁用并移除小方块
              e.other.rigidBody.setEnabled(false);
              const healthBoxMesh = e.other.object;
              if (healthBoxMesh) {
                console.log("Health box mesh found, removing from scene");
                healthBoxMesh.visible = false; // 隐藏网格对象
                healthBoxMesh.removeFromParent(); // 从场景中移除网格对象
                console.log(`Health box with ID ${boxId} removed from scene.`);
              } else {
                console.log("Health box mesh not found");
              }
            }
            if (isHost() && e.other.rigidBody.userData?.type !== "bullet") {
              rigidbody.current.setEnabled(false);
              onHit(vec3(rigidbody.current.translation()));
            }
          }}
          sensor
          userData={{
            type: "bullet",
            player,
            damage: 10,
          }}
        >
          <mesh position-z={0.25} material={bulletMaterial} castShadow>
            <boxGeometry args={[0.05, 0.05, 0.5]} />
          </mesh>
        </RigidBody>
      </group>
    </group>
  );
};
