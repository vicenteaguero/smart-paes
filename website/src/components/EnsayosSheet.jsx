// website/src/components/EnsayosSheet.jsx

import { useEffect } from "react";
import PropTypes from "prop-types";
import { defaultQuestions } from "../utils/answerUtils";
import "../styles/ensayos.css";

export default function EnsayosSheet({ questionsData, setQuestionsData }) {
  useEffect(() => {
    if (!questionsData || questionsData.length === 0) {
      setQuestionsData(defaultQuestions(10, 4));
    }
  }, [questionsData, setQuestionsData]);

  const handleSelectConfidence = (qIndex, value) => {
    setQuestionsData((prev) => {
      const updated = [...prev];
      updated[qIndex].confidence = value;
      return updated;
    });
  };

  // If user clicks a discarded option to answer:
  //  1) Temporarily remove discard
  //  2) If user unselects the same option (clicks again), restore discard
  const handleAnswerSelect = (qIndex, optionIndex) => {
    setQuestionsData((prev) => {
      const updated = [...prev];
      const question = updated[qIndex];
      const selectedOption = question.options[optionIndex];

      // Already the selected answer => unselect
      if (question.answer === selectedOption.label) {
        // If it was originally discarded, restore it
        if (selectedOption.wasDiscarded) {
          selectedOption.discarded = false;
          selectedOption.wasDiscarded = false;
        }
        question.answer = null;
        return updated;
      }

      // Selecting a different option:
      //  If that option is currently discarded, undo discard but remember the old state
      if (selectedOption.discarded) {
        selectedOption.wasDiscarded = true;
        selectedOption.discarded = false;
      }
      // Set as new answer
      question.answer = selectedOption.label;
      return updated;
    });
  };

  // If toggling discard:
  //  - If discarding an answered option, remove its answer
  //  - If discarding again, reset stars to 0
  const toggleDiscard = (qIndex, optionIndex) => {
    setQuestionsData((prev) => {
      const updated = [...prev];
      const opt = updated[qIndex].options[optionIndex];
      const wasDiscarded = opt.discarded;
      opt.discarded = !wasDiscarded;

      // If discarding from false -> true a second time, reset stars
      if (!wasDiscarded) {
        opt.highlightedStars = 0;
      }

      // Remove answer if discarding the answered option
      if (opt.discarded && updated[qIndex].answer === opt.label) {
        updated[qIndex].answer = null;
      }

      // Clear any memory of "wasDiscarded" when toggling from UI
      if (wasDiscarded) {
        opt.wasDiscarded = false;
      }
      return updated;
    });
  };

  const highlightStars = (qIndex, optionIndex, starValue) => {
    setQuestionsData((prev) => {
      const updated = [...prev];
      updated[qIndex].options[optionIndex].highlightedStars = starValue;
      return updated;
    });
  };

  return (
    <div id="answersSheet">
      {questionsData &&
        questionsData.map((q, qIndex) => (
          <div
            key={qIndex}
            className={`question ${q.answer ? "answered" : ""}`}
            data-answer={q.answer || ""}
          >
            <div className="questionHeader">
              <label>{q.question}</label>
              <select
                value={q.confidence ?? -1}
                onChange={(e) =>
                  handleSelectConfidence(qIndex, parseInt(e.target.value, 10))
                }
              >
                <option value={-1}>--</option>
                {[...Array(11)].map((_, i) => {
                  const val = i * 10; // 0, 10, 20, ... 100
                  return (
                    <option key={val} value={val}>
                      {val}%
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="optionsSection">
              {q.options.map((opt, optIndex) => (
                <div
                  key={optIndex}
                  className={`optionRow ${
                    opt.discarded ? "discarded" : ""
                  } ${q.answer === opt.label ? "answered" : ""}`}
                >
                  <span
                    className="optionLabel"
                    onClick={() => handleAnswerSelect(qIndex, optIndex)}
                  >
                    {opt.label})
                  </span>
                  <div
                    className="stars"
                    style={{ display: opt.discarded ? "inline" : "none" }}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star ${
                          star <= opt.highlightedStars ? "highlight" : ""
                        }`}
                        onClick={() => highlightStars(qIndex, optIndex, star)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <button
                    className="discard"
                    onClick={() => toggleDiscard(qIndex, optIndex)}
                  >
                    {opt.discarded ? "No Descartar" : "Descartar"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}

EnsayosSheet.propTypes = {
  questionsData: PropTypes.array.isRequired,
  setQuestionsData: PropTypes.func.isRequired,
};
