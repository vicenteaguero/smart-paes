// assets/js/generateAnswersJSON.js

let answer_json = {};

function generateUniqueID() {
    let uniqueID = localStorage.getItem('uniqueID');
    if (uniqueID) return uniqueID;
    uniqueID = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('uniqueID', uniqueID);
    return uniqueID;
}

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

    console.log(answer_json);

    return answer_json;

}

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
        mode: "cors", // ✅ Enable CORS
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(answerData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Server responded with an error");
            }
            return response.json();
        })
        .then(data => console.log("✅ Datos guardados con éxito:", data))
        .catch(error => console.error("❌ Error al enviar datos:", error));
}



document.addEventListener('DOMContentLoaded', function () {
    generateUniqueID();
    document.getElementById('generateAnswersJSON').addEventListener('click', generateAnswersJSON);
    document.getElementById('saveAnswersJSON').addEventListener('click', sendAnswersJSON);
});