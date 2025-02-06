// website/src/utils/answerUtils.js

export function generateUniqueID() {
  let uniqueID = localStorage.getItem("uniqueID");
  if (uniqueID) return uniqueID;
  uniqueID = crypto.randomUUID();
  localStorage.setItem("uniqueID", uniqueID);
  console.log(uniqueID);
  return uniqueID;
}

export function defaultQuestions(nQuestions, nOptions) {
  const questions = [];
  for (let i = 1; i <= nQuestions; i++) {
    const options = [];
    for (let j = 0; j < nOptions; j++) {
      options.push({
        label: String.fromCharCode(65 + j),
        discarded: false,
        highlightedStars: 0,
      });
    }
    questions.push({
      question: `Pregunta ${i}`,
      confidence: -1,
      answer: null,
      options,
    });
  }
  return questions;
}

export function loadStoredAnswers() {
  const stored = localStorage.getItem("answer_json");
  if (!stored) return null;
  return JSON.parse(stored);
}

export function saveAnswersToStorage(data) {
  localStorage.setItem("answer_json", JSON.stringify(data));
}

// Add started_at if missing, keep ended_at if any
// Insert userID if missing
function finalizeAnswerData(questionsData) {
  const existing = loadStoredAnswers();
  let started_at = existing?.started_at || new Date().toISOString();
  // ended_at will be set on forced or final submit
  let ended_at = existing?.ended_at || null;

  const answerData = {
    id: generateUniqueID(),
    started_at,
    ended_at,
    questions: questionsData.map((q) => ({
      question: q.question,
      confidence: q.confidence,
      answered: !!q.answer,
      answer: q.answer,
      options: q.options.map((o) => ({
        label: o.label,
        discarded: o.discarded,
        highlightedStars: o.highlightedStars,
      })),
    })),
  };
  saveAnswersToStorage(answerData);
  return answerData;
}

export function generateAnswersJSON(questionsData) {
  // Just store the new data but no ended_at
  const answerData = finalizeAnswerData(questionsData);
  return answerData;
}

/** Normal Submit With Validations */
export function sendAnswersJSON(questionsData) {
  const answerData = generateAnswersJSON(questionsData);

  // 1) All questions must be answered
  const allAnswered = answerData.questions.every(
    (q) => q.answered && q.answer?.trim() !== "",
  );
  if (!allAnswered) {
    alert("❌ Por favor, responde todas las preguntas antes de enviar.");
    return;
  }

  // 2) No question can have confidence “--” (=-1)
  const hasMissingConfidence = answerData.questions.some(
    (q) => q.confidence === -1,
  );
  if (hasMissingConfidence) {
    alert("❌ Selecciona un nivel de confianza válido para cada pregunta.");
    return;
  }

  // 3) Discarded options must have at least 1 star
  const hasDiscardNoStars = answerData.questions.some((q) =>
    q.options.some((o) => o.discarded && o.highlightedStars === 0),
  );
  if (hasDiscardNoStars) {
    alert(
      "❌ Tienes una opción descartada con 0 estrellas. Destaca al menos una estrella o anula el descarte.",
    );
    return;
  }

  // If all checks pass, set ended_at and proceed
  answerData.ended_at = new Date().toISOString();
  saveAnswersToStorage(answerData);

  doPostToGoogleAppsScript(answerData);
}

/** Forced Submit Without Validations */
export function forceSendAnswers(questionsData) {
  const answerData = finalizeAnswerData(questionsData);
  answerData.ended_at = new Date().toISOString();
  saveAnswersToStorage(answerData);

  // Bypass all validations and send
  doPostToGoogleAppsScript(answerData);
}

/** Common function to do the fetch POST */
function doPostToGoogleAppsScript(answerData) {
  const scriptURL =
    "https://script.google.com/macros/s/AKfycbzF8xMtL6ZPaV8oQT-xc0XCLLYsmNhRLoBSX_h-QlWrV90pv3ImhCQrUE9p0GsuM1jD0A/exec";

  fetch(scriptURL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(answerData),
  })
    .then(() => {
      setTimeout(() => {
        window.location.href = "/ensayos/saved";
      }, 1000);
    })
    .catch((err) => {
      console.error("❌ Error:", err);
    });
}

/** Reset only the sheet (questions), keep user ID, keep started_at */
export function clearAnswers(nQuestions = 10, nOptions = 4) {
  let existing = loadStoredAnswers() || {};
  // Preserve user ID and started_at if they exist
  const started_at = existing.started_at || new Date().toISOString();
  const id = existing.id || generateUniqueID();

  // Build fresh questions
  const questions = defaultQuestions(nQuestions, nOptions);

  // ended_at reset so user can start fresh
  const updatedData = {
    id,
    started_at,
    ended_at: null,
    questions,
  };

  saveAnswersToStorage(updatedData);
  return updatedData;
}
