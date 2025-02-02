let answer_json = {};

// Load answer_json from localStorage if it exists
function loadStoredAnswers() {
    const storedAnswers = localStorage.getItem('answer_json');
    if (storedAnswers) {
        answer_json = JSON.parse(storedAnswers);
        console.log("✅ Cargado answer_json desde localStorage:", answer_json);
    }
}

// Store answer_json in localStorage
function saveAnswersToStorage() {
    localStorage.setItem('answer_json', JSON.stringify(answer_json));
    console.log("✅ answer_json guardado en localStorage:", answer_json);
}

// Generate unique user ID
function generateUniqueID() {
    let uniqueID = localStorage.getItem('uniqueID');
    if (uniqueID) return uniqueID;
    uniqueID = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('uniqueID', uniqueID);
    return uniqueID;
}

// Generate JSON of answers and store in localStorage
function generateAnswersJSON() {
    const answerSheet = document.getElementById('answersSheet');
    const questions = answerSheet.querySelectorAll('.question');
    const questionsData = [];

    questions.forEach(question => {
        const questionData = {};

        const optionQuestionLabel = question.querySelector('.questionHeader label');
        questionData.question = optionQuestionLabel ? optionQuestionLabel.textContent.trim() : null;

        const confidenceSelect = question.querySelector('.questionHeader select');
        questionData.confidence = confidenceSelect ? confidenceSelect.value : null;

        if (question.hasAttribute('data-answer')) {
            questionData.answered = true;
            questionData.answer = question.getAttribute('data-answer');
        } else {
            questionData.answered = false;
            questionData.answer = null;
        }

        const optionRows = question.querySelectorAll('.optionRow');
        const optionsData = [];

        optionRows.forEach(optionRow => {
            const optionData = {};

            const labelSpan = optionRow.querySelector('.optionLabel');
            optionData.label = labelSpan ? labelSpan.textContent.trim() : null;
            optionData.discarded = optionRow.classList.contains('discarded');

            const stars = optionRow.querySelectorAll('.star');
            let highlightedStars = 0;
            stars.forEach(star => {
                if (star.classList.contains('highlight')) highlightedStars++;
            });

            optionData.highlightedStars = highlightedStars;
            optionsData.push(optionData);
        });

        questionData.options = optionsData;
        questionsData.push(questionData);
    });

    answer_json = {
        id: generateUniqueID(),
        questions: questionsData
    };

    saveAnswersToStorage(); // ✅ Store in localStorage
    console.log(answer_json);

    return answer_json;
}

// Send answers to Google Apps Script and store locally
function sendAnswersJSON() {
    const scriptURL = "https://script.google.com/macros/s/AKfycbzF8xMtL6ZPaV8oQT-xc0XCLLYsmNhRLoBSX_h-QlWrV90pv3ImhCQrUE9p0GsuM1jD0A/exec";
    const answerData = generateAnswersJSON();

    const allQuestions = document.querySelectorAll('.question');
    const allAnswered = Array.from(allQuestions).every(q =>
        q.hasAttribute('data-answer') && q.getAttribute('data-answer').trim() !== ""
    );

    if (!allAnswered) {
        alert("❌ Por favor, responde todas las preguntas antes de enviar tus respuestas.");
        allQuestions.forEach(q => {
            if (!q.hasAttribute('data-answer') || q.getAttribute('data-answer').trim() === "") {
                q.classList.add('unanswered');
            }
        });
        return;
    }

    fetch(scriptURL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answerData)
    })
        .then(response => console.log("Response (opaque):", response))
        .catch(error => console.error("Error:", error));
}

// Load stored data on page load
document.addEventListener('DOMContentLoaded', function () {
    generateUniqueID();
    loadStoredAnswers(); // ✅ Load stored answers on page load
    document.getElementById('generateAnswersJSON').addEventListener('click', generateAnswersJSON);
    document.getElementById('saveAnswersJSON').addEventListener('click', sendAnswersJSON);
});