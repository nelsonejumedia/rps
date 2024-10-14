const choices = ['R', 'P', 'S'];
let playerScore = 0;
let computerScore = 0;
let highlightInterval;

const nameOverlay = document.getElementById('nameOverlay');
const nameForm = document.getElementById('nameForm');
const playerNameInput = document.getElementById('playerNameInput');
const gameContainer = document.getElementById('gameContainer');
const playerNameDisplay = document.getElementById('playerName');
const playerScoreDisplay = document.getElementById('playerScore');
const computerScoreDisplay = document.getElementById('computerScore');
const playerChoices = document.querySelectorAll('.choice');
const computerChoices = document.querySelectorAll('.computer-choice');
const resultOverlay = document.getElementById('resultOverlay');
const resultMessage = document.getElementById('resultMessage');
const nextRoundButton = document.getElementById('nextRoundButton');

nameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const playerName = playerNameInput.value.trim();
    if (playerName) {
        nameOverlay.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        playerNameDisplay.textContent = `Player: ${playerName}`;
        startComputerAnimation();
    }
});

function startComputerAnimation() {
    let highlightIndex = 0;
    highlightInterval = setInterval(() => {
        computerChoices.forEach((choice, index) => {
            choice.classList.toggle('highlighted', index === highlightIndex);
        });
        highlightIndex = (highlightIndex + 1) % 3;
    }, 500);
}

playerChoices.forEach(choice => {
    choice.addEventListener('click', () => handlePlayerChoice(choice.dataset.choice));
});

function handlePlayerChoice(playerChoice) {
    clearInterval(highlightInterval);
    playerChoices.forEach(choice => {
        choice.classList.toggle('highlighted', choice.dataset.choice === playerChoice);
    });

    const computerChoice = choices[Math.floor(Math.random() * 3)];
    computerChoices.forEach(choice => {
        choice.classList.toggle('highlighted', choice.dataset.choice === computerChoice);
    });

    const result = determineWinner(playerChoice, computerChoice);
    updateScores();

    // Delay showing the result without displaying an overlay
    setTimeout(() => {
        showResult(result, playerChoice, computerChoice);
    }, 1000);
}


function determineWinner(player, computer) {
    if (player === computer) return 'tie';
    if (
        (player === 'R' && computer === 'S') ||
        (player === 'P' && computer === 'R') ||
        (player === 'S' && computer === 'P')
    ) {
        playerScore++;
        return 'win';
    } else {
        computerScore++;
        return 'lose';
    }
}

function updateScores() {
    playerScoreDisplay.textContent = `You: ${playerScore}`;
    computerScoreDisplay.textContent = `Computer: ${computerScore}`;
}

function showResult(result, playerChoice, computerChoice) {
    let resultText;
    const outcomes = {
        'R': 'Rock',
        'P': 'Paper',
        'S': 'Scissors'
    };

    if (result === 'tie') {
        resultText = `It's a tie! Both chose ${outcomes[playerChoice]}.`;
    } else {
        let action;
        if ((playerChoice === 'R' && computerChoice === 'S') || (playerChoice === 'S' && computerChoice === 'R')) {
            action = 'breaks';
        } else if ((playerChoice === 'P' && computerChoice === 'R') || (playerChoice === 'R' && computerChoice === 'P')) {
            action = 'covers';
        } else {
            action = 'cuts';
        }

        if (result === 'win') {
            resultText = `${outcomes[playerChoice]} ${action} ${outcomes[computerChoice]}. You win!`;
        } else {
            resultText = `${outcomes[computerChoice]} ${action} ${outcomes[playerChoice]}. Computer wins!`;
        }
    }

    resultMessage.textContent = resultText;
    resultOverlay.classList.remove('hidden'); // Ensure the overlay is shown when displaying the result
}

nextRoundButton.addEventListener('click', () => {
    resultOverlay.classList.add('hidden');
    playerChoices.forEach(choice => choice.classList.remove('highlighted'));
    computerChoices.forEach(choice => choice.classList.remove('highlighted'));
    startComputerAnimation();
});
