import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { Physics } from "@react-three/rapier";
import { Experience } from "./components/Experience";
import { SoftShadows } from "@react-three/drei";
import { generateRandomBoxes } from "./components/Map";

function App() {
  const [boxes, setBoxes] = useState(generateRandomBoxes(10, [-10, 10], [-10, 10]));

  const removeBox = (id) => {
    setBoxes((prevBoxes) => prevBoxes.filter((box) => box.id !== id));
  };

  const addBox = () => {
    const newBox = generateRandomBoxes(1, [-10, 10], [-10, 10])[0];
    setBoxes((prevBoxes) => [...prevBoxes, newBox]);
  };

  return (
    <Canvas shadows camera={{ position: [0, 30, 0], fov: 30 }}>
      <color attach="background" args={["#242424"]} />
      <SoftShadows size={42} />
      <Suspense fallback={null}>
        <Physics>
          <Experience boxes={boxes} removeBox={removeBox} addBox={addBox} />
        </Physics>
      </Suspense>
    </Canvas>
  );
}

export default App;
