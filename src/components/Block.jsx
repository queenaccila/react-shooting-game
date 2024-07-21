import React, { useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

const Block = ({ initialHealth, position, onCollision }) => {
  const [health, setHealth] = useState(initialHealth);
  const [isVisible, setIsVisible] = useState(true);

  const handleCollision = () => {
    setHealth(health - 1);
    if (health - 1 <= 0) {
      setIsVisible(false);
    }
    onCollision();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const hit = checkCollision(position);
      if (hit) {
        handleCollision();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [position]);

  const checkCollision = (position) => {
    return position[0] === 1 && position[1] === 1 && position[2] === 1;
  };

  return isVisible ? (
    <mesh onClick={handleCollision} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  ) : null;
};

export default Block;
