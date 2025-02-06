// website/src/pages/StartEnsayo.jsx

import { useNavigate } from "react-router-dom";
import {
  loadStoredAnswers,
  defaultQuestions,
  saveAnswersToStorage,
} from "../utils/answerUtils";
import { useEffect, useState } from "react";

export default function StartEnsayo() {
  const navigate = useNavigate();
  const [hasCurrentTest, setHasCurrentTest] = useState(false);

  useEffect(() => {
    const stored = loadStoredAnswers();
    // If there's stored data with no ended_at, we consider it "in progress"
    if (stored && !stored.ended_at) {
      setHasCurrentTest(true);
    }
  }, []);

  // Creates new data from scratch
  const handleBeginNewTest = () => {
    // Generate fresh data
    const freshQuestions = defaultQuestions(10, 4); // or any custom number
    // Clear out localStorage answer_json
    localStorage.removeItem("answer_json");

    // Create a minimal JSON object with started_at
    const newData = {
      started_at: new Date().toISOString(),
      ended_at: null,
      questions: freshQuestions,
    };
    // Store in localStorage
    saveAnswersToStorage(newData);
    navigate("/ensayos");
  };

  const handleContinueTest = () => {
    // If a test is in progress, just go
    navigate("/ensayos");
  };

  return (
    <div>
      <h1>Iniciar Ensayo</h1>
      {hasCurrentTest ? (
        <>
          <p>Ya tienes un ensayo en progreso.</p>
          <button onClick={handleContinueTest}>Continuar Ensayo</button>
          <button onClick={handleBeginNewTest}>Nuevo Ensayo</button>
        </>
      ) : (
        <>
          <p>No hay ensayos en progreso.</p>
          <button onClick={handleBeginNewTest}>Iniciar Nuevo Ensayo</button>
        </>
      )}
    </div>
  );
}
