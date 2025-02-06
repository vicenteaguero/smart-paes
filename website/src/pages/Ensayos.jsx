// website/src/pages/Ensayos.jsx

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import EnsayosSheet from "../components/EnsayosSheet";
import {
  loadStoredAnswers,
  generateAnswersJSON,
  sendAnswersJSON,
  saveAnswersToStorage,
  forceSendAnswers,
  clearAnswers, // <-- import the new function
} from "../utils/answerUtils";
import "../styles/ensayos.css";

export default function Ensayos() {
  const [questionsData, setQuestionsData] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [noTestFound, setNoTestFound] = useState(false);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const TOTAL_TIME_SEC = 600;

  useEffect(() => {
    const stored = loadStoredAnswers();
    if (stored && stored.questions) {
      setQuestionsData(stored.questions);

      if (!stored.started_at) {
        stored.started_at = new Date().toISOString();
        saveAnswersToStorage(stored);
      }

      const startedAtMs = new Date(stored.started_at).getTime();
      const nowMs = Date.now();
      const elapsedSec = Math.floor((nowMs - startedAtMs) / 1000);
      const remain = TOTAL_TIME_SEC - elapsedSec;
      setTimeLeft(remain > 0 ? remain : 0);
    } else {
      setNoTestFound(true);
    }
  }, []);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      setTimeLeft(0);
      forceSendAnswers(questionsData);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timeLeft, questionsData]);

  const handleGenerateJSON = () => {
    const updated = generateAnswersJSON(questionsData);
    setQuestionsData(updated.questions);
  };

  const handleSendJSON = () => {
    sendAnswersJSON(questionsData);
  };

  // NEW handleReset
  const handleReset = () => {
    // Clear only the sheet, preserve ID & started_at
    const updated = clearAnswers(10, 4);
    setQuestionsData(updated.questions);
    // We do NOT reset the timer -> keep timeLeft as is
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  if (noTestFound) {
    return (
      <div>
        <h2>No se ha encontrado un ensayo activo</h2>
        <p>
          Para acceder a la sección de ensayos, primero debes iniciar un nuevo
          ensayo.
        </p>
        <button onClick={() => navigate("/start-ensayo")}>
          Iniciar Nuevo Ensayo
        </button>
        <button onClick={() => navigate("/")}>Volver al Inicio</button>
      </div>
    );
  }

  return (
    <div className="ensayos-container">
      <h1 className="page-title">Ensayos</h1>

      {timeLeft !== null && <div>Tiempo restante: {formatTime(timeLeft)}</div>}

      <div className="ensayos-buttons">
        <button onClick={handleReset} id="restoreAnswersSheet">
          Eliminar Respuestas
        </button>
        <button onClick={handleGenerateJSON} id="generateAnswersJSON">
          Guardar Respuestas
        </button>
      </div>

      <EnsayosSheet
        questionsData={questionsData}
        setQuestionsData={setQuestionsData}
      />

      <div className="ensayos-buttons-centered">
        <button onClick={handleGenerateJSON} id="generateAnswersJSON">
          Guardar Respuestas
        </button>
        <button onClick={handleSendJSON} id="saveAnswersJSON">
          Guardar y Finalizar Ensayo
        </button>
      </div>
    </div>
  );
}
