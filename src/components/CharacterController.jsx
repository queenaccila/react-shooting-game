import React, { useEffect, useRef, useState } from "react";
import { Wizard } from "./Wizard";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { isHost } from "playroomkit";

const MOVEMENT_SPEED = 200;

export const CharacterController = ({ state, joystick, userPlayer, ...props }) => {
  const group = useRef();
  const character = useRef();
  const rigidbody = useRef();
  const [animation, setAnimation] = useState("Idle");

  useFrame((_, delta) => {
    const angle = joystick.angle();
    if(joystick.isJoystickPressed() && angle){
      setAnimation("Run");
      character.current.rotation.y = angle;

      // moves character in its own direction
      const impulse = {
        x: Math.sin(angle) * MOVEMENT_SPEED * delta,
        y: 0,
        z: Math.cos(angle) * MOVEMENT_SPEED * delta,
      };
      rigidbody.current.applyImpulse(impulse, true);
    } else {
      setAnimation("Idle");
    }

    if (isHost()) {
      state.setState("pos", rigidbody.current.translation());
    } else {
      const pos = state.getState("pos");
      if (pos) {
        rigidbody.current.setTranslation(pos);
      }
    }
  });

  return (
    <group ref={group} {...props}>
      <RigidBody
        ref={rigidbody}
        colliders={false}
        linearDamping={12}
        lockRotations
        type={isHost() ? "dynamic" : "kinematicPosition"}
      >
        <group ref={character}>
          <Wizard 
            color={state.state.profile?.color}
            animation={animation}
          />
        </group>
        <CapsuleCollider args={[0.7, 0.6]} position={[0, 1.28, 0]} />
      </RigidBody>
    </group>
  );
};
