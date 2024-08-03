import React, { useState, useEffect } from 'react'; // Importing React and hooks for state and effects
import { useFrame } from '@react-three/fiber'; // Importing a hook to run on each frame, though it's not used here

const Block = ({ initialHealth, position, onCollision }) => {
  // State to keep track of the block's health
  const [health, setHealth] = useState(initialHealth);
  // State to determine whether the block is visible or not
  const [isVisible, setIsVisible] = useState(true);

  // Function to handle collision logic
  const handleCollision = () => {
    // Decrease health by 1
    setHealth(health - 1);
    // If health reaches zero, make the block invisible
    if (health - 1 <= 0) {
      setIsVisible(false);
    }
    // Call the external onCollision function prop
    onCollision();
  };

  // Effect hook to check for collisions at regular intervals
  useEffect(() => {
    // Set an interval to check for collisions every 100 milliseconds
    const interval = setInterval(() => {
      // Check for collision at the current position
      const hit = checkCollision(position);
      // If a collision is detected, handle it
      if (hit) {
        handleCollision();
      }
    }, 100);

    // Clean up the interval on component unmount or when dependencies change
    return () => clearInterval(interval);
  }, [position]);

  // Function to check for collisions based on position
  const checkCollision = (position) => {
    // Simple collision detection logic based on position
    return position[0] === 1 && position[1] === 1 && position[2] === 1;
  };

  // Render the block if it is visible
  return isVisible ? (
    // Mesh component that represents the block
    <mesh onClick={handleCollision} position={position}>
      {/* Define the geometry and material of the block */}
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  ) : null; // Return null if the block is not visible
};

export default Block; // Export the Block component
