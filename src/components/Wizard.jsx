import React, { useRef, useEffect, useMemo } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useGraph } from "@react-three/fiber";
import { Color, LoopOnce, MeshStandardMaterial } from "three";
import { SkeletonUtils } from "three-stdlib";

export function Wizard({
    color = "red",
    animation = "Idle",
    ...props
  }) {
  const group = useRef()
  const { scene, materials, animations } = useGLTF('/models/Wizard.gltf')
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes } = useGraph(clone);
  const { actions } = useAnimations(animations, group)

  if (actions["Death"]) {
    actions["Death"].loop = LoopOnce;
    actions["Death"].clampWhenFinished = true;
  }
  
  useEffect(() => {
    actions[animation].reset().fadeIn(0.2).play();
    return () => actions[animation]?.fadeOut(0.2);
  }, [animation]);

  const playerColorMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: new Color(color),
      }),
    [color]
  );

  useEffect(() => {
    // ASSIGNING CHARACTER COLOR
    clone.traverse((child) => {
      if (child.isMesh) {
        if (child.material.name === 'Clothes' || child.material.name === 'Hat') {
          child.material = playerColorMaterial;
        }
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [clone, playerColorMaterial]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="CharacterArmature">
          <primitive object={nodes.Bone} />
          <group name="Body_1">
            <skinnedMesh name="Cube004" geometry={nodes.Cube004.geometry} material={materials.Skin} skeleton={nodes.Cube004.skeleton} />
            <skinnedMesh name="Cube004_1" geometry={nodes.Cube004_1.geometry} material={playerColorMaterial} skeleton={nodes.Cube004_1.skeleton} />
            <skinnedMesh name="Cube004_2" geometry={nodes.Cube004_2.geometry} material={materials.Belt} skeleton={nodes.Cube004_2.skeleton} />
            <skinnedMesh name="Cube004_3" geometry={nodes.Cube004_3.geometry} material={materials.Gold} skeleton={nodes.Cube004_3.skeleton} />
            <skinnedMesh name="Cube004_4" geometry={nodes.Cube004_4.geometry} material={playerColorMaterial} skeleton={nodes.Cube004_4.skeleton} />
            <skinnedMesh name="Cube004_5" geometry={nodes.Cube004_5.geometry} material={materials.Hair} skeleton={nodes.Cube004_5.skeleton} />
            <skinnedMesh name="Cube004_6" geometry={nodes.Cube004_6.geometry} material={materials.Face} skeleton={nodes.Cube004_6.skeleton} />
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/Wizard.gltf')
