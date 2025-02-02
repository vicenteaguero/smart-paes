// assets/js/generateSheet.js

function generateAnswerSheet(n_questions, n_options) {

    const container = document.getElementById('answerSheet');

    container.innerHTML = '';

    for (let i = 1; i <= n_questions; i++) {

        const questionDiv = document.createElement('div');

        questionDiv.className = 'question';

        const questionHeader = document.createElement('div');
        questionHeader.className = 'questionHeader';

        const questionLabel = document.createElement('label');

        questionLabel.textContent = `Pregunta ${i}`;
        questionHeader.appendChild(questionLabel);

        const confidenceSelect = document.createElement('select');

        for (let j = 0; j <= 100; j += 10) {

            const option = document.createElement('option');
            option.value = j;
            option.textContent = `${j}%`;
            confidenceSelect.appendChild(option);

        }

        questionHeader.appendChild(confidenceSelect);

        questionDiv.appendChild(questionHeader);

        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'optionsSection';

        for (let k = 0; k < n_options; k++) {

            const optionContainer = document.createElement('div');
            optionContainer.className = 'optionRow';

            const optionLabel = document.createElement('span');
            optionLabel.className = 'optionLabel';
            optionLabel.textContent = String.fromCharCode(65 + k) + ') ';
            optionContainer.appendChild(optionLabel);

            const starContainer = document.createElement('div');
            starContainer.className = 'stars';
            starContainer.style.display = 'none';

            for (let s = 1; s <= 5; s++) {

                const star = document.createElement('span');
                star.className = 'star';

                star.textContent = '★';
                star.dataset.value = s;
                star.onclick = function () {
                    highlightStars(this);
                };

                starContainer.appendChild(star);

            }

            optionContainer.appendChild(starContainer);

            const toggleButton = document.createElement('button');
            toggleButton.className = 'discard';
            toggleButton.textContent = "Descartar";

            toggleButton.onclick = function () {
                toggleDiscardState(optionLabel, optionContainer, questionDiv, starContainer, toggleButton);
            };

            optionContainer.appendChild(toggleButton);

            optionLabel.onclick = function () {
                optionLabelClick(optionLabel, optionContainer, questionDiv);
            };

            optionsDiv.appendChild(optionContainer);

        }

        questionDiv.appendChild(optionsDiv);
        container.appendChild(questionDiv);
    }
}

function highlightStars(star) {
    const stars = star.parentNode.children;
    for (let i = 0; i < stars.length; i++) {
        stars[i].classList.toggle('highlight', i < star.dataset.value);
    }
}

function removeHighlightedStars(optionContainer) {
    const stars = optionContainer.querySelectorAll('.star');
    stars.forEach(star => star.classList.remove('highlight'));
}

function optionLabelClick(optionLabel, optionContainer, questionDiv) {
    const currentAnswer = questionDiv.getAttribute('data-answer');
    if (currentAnswer === optionLabel.textContent[0]) {
        questionDiv.removeAttribute('data-answer');
        optionContainer.classList.remove('answered');
    } else {
        if (optionContainer.classList.contains('discarded')) {
            optionContainer.classList.remove('discarded');
            optionContainer.querySelector('.discard').textContent = "Descartar";
            optionContainer.querySelector('.stars').style.display = 'none';
        }
        questionDiv.setAttribute('data-answer', optionLabel.textContent[0]);
        document.querySelectorAll('.question[data-answer]').forEach(q => {
            if (q === questionDiv) {
                q.querySelectorAll('.optionRow').forEach(row => {
                    row.classList.remove('answered');
                });
            }
        });
        optionContainer.classList.add('answered');
    }
}

function toggleDiscardState(optionLabel, optionContainer, questionDiv, starContainer, toggleButton) {
    const isDiscarded = optionContainer.classList.contains('discarded');
    if (isDiscarded) {
        optionContainer.classList.remove('discarded');
        starContainer.style.display = 'none';
        toggleButton.textContent = "Descartar";
        removeHighlightedStars(optionContainer);
    } else {
        optionContainer.classList.add('discarded');
        starContainer.style.display = 'inline';
        toggleButton.textContent = "No Descartar";
        const currentAnswer = questionDiv.getAttribute('data-answer');
        if (currentAnswer === optionLabel.textContent[0]) {
            questionDiv.removeAttribute('data-answer');
            optionContainer.classList.remove('answered');
        }
    }
}
