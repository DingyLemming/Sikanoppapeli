"use strict";

let players = ["Player 1", "Player 2"];
let scores = [0, 0];
let currentPlayerIndex = 0;
let numDice = 1; // Initially, there is one dice

function editNames() {
    for (let i = 0; i < players.length; i++) {
        let newName = prompt(`Change ${players[i]} Name`);
        if (newName && newName.trim() !== "") {
            document.getElementById(`name_${i}`).textContent = newName;
            players[i] = newName;
        }
    }
}

function switchPlayer() {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    document.querySelector(".turn-indicator").textContent = `${players[currentPlayerIndex]}'s Turn`;
}

function init() {
    currentPlayerIndex = 0; // Reset to first player
    document.querySelector(".turn-indicator").textContent = `${players[0]}'s Turn`;
    scores = Array(players.length).fill(0);
    for (let i = 0; i < players.length; i++) {
        document.getElementById(`score_${i}`).textContent = scores[i];
        document.getElementById(`current_${i}`).textContent = 0;
    }
}

init();

function rollDice() {
    // Roll each dice and store their scores
    const diceScores = [];
    for (let i = 0; i < numDice; i++) {
        let dice = Math.floor(Math.random() * 6) + 1; // Generate random number between 1 and 6
        diceScores.push(dice);
    }

    // Calculate the total score based on the sum of individual dice scores
    const diceTotal = diceScores.reduce((sum, dice) => sum + dice, 0);

    // Set the images for each dice based on their individual scores
    for (let i = 0; i < numDice; i++) {
        const diceEl = document.getElementById(`dice_${i + 1}`);
        diceEl.src = `./kuvat/dice-${diceScores[i]}.png`;
    }

    // Update the current player's current score on the UI
    const currentPlayerCurrentScore = parseInt(document.getElementById(`current_${currentPlayerIndex}`).textContent);
    document.getElementById(`current_${currentPlayerIndex}`).textContent = currentPlayerCurrentScore + diceTotal;

    // Check for special scoring cases
    if (numDice === 1) {
        // If only one dice is rolled, apply special scoring rules
        if (diceScores[0] === 1) {
            // If the dice shows 1, clear the current score and end the turn
            document.getElementById(`current_${currentPlayerIndex}`).textContent = 0;
            switchPlayer();
            return;
        }
    } else {
        // If two dice are rolled, check for special scoring cases
        if (diceScores.every(dice => dice === 1)) {
            // If both dice show 1, add 25 points to the current score
            document.getElementById(`current_${currentPlayerIndex}`).textContent = currentPlayerCurrentScore + 25;
            return;
        } else if (diceScores.includes(1) && diceScores.indexOf(1) !== diceScores.lastIndexOf(1)) {
            // If two dice show 1, add 25 points to the current score
            document.getElementById(`current_${currentPlayerIndex}`).textContent = currentPlayerCurrentScore + 25;
            return;
        } else if (diceScores[0] === diceScores[1]) {
            // If both dice show the same number, double the current score
            const doubleScore = diceTotal * 2;
            document.getElementById(`current_${currentPlayerIndex}`).textContent = doubleScore;
            return;
        }
    }

    // If any of the dice shows 1, end the turn
    if (diceScores.includes(1)) {
        document.getElementById(`current_${currentPlayerIndex}`).textContent = 0;
        switchPlayer();
        return;
    }

    // If no special cases, continue the turn
}

function hold() {
    // Get the current player's current score
    const currentPlayerCurrentScore = parseInt(document.getElementById(`current_${currentPlayerIndex}`).textContent);
    
    // Add the current score to the total score
    scores[currentPlayerIndex] += currentPlayerCurrentScore;

    // Update the total score on the UI
    document.getElementById(`score_${currentPlayerIndex}`).textContent = scores[currentPlayerIndex];

    // Reset the current score to 0
    document.getElementById(`current_${currentPlayerIndex}`).textContent = 0;

    // Check if the game should end
    if (scores[currentPlayerIndex] >= 100) {
        alert(`${players[currentPlayerIndex]} wins!`);
        init();
        return; // Exit the function early to prevent further rolls after game end
    }
    
    // Switch to the next player
    switchPlayer();
}

function addDice() {
    if (numDice < 2) {
        numDice++;
        document.querySelector(".dice-container").insertAdjacentHTML("beforeend", '<img src="./kuvat/dice-1.png" alt="Playing dice" class="dice" id="dice_2" />');
        document.querySelector(".btn_remove_dice").disabled = false;
    }
}

function removeDice() {
    if (numDice > 1) {
        numDice--;
        document.querySelector(".dice-container").removeChild(document.getElementById("dice_2"));
        if (numDice === 1) {
            document.querySelector(".btn_remove_dice").disabled = true;
        }
    }
}

const btnRoll = document.querySelector(".btn_roll");
btnRoll.addEventListener("click", rollDice);

const btnHold = document.querySelector(".btn_hold");
btnHold.addEventListener("click", hold);

const btnNew = document.querySelector(".btn_new");
btnNew.addEventListener("click", init);

const btnAddPlayer = document.querySelector(".btn_add_player");
btnAddPlayer.addEventListener("click", function () {
    const newPlayerName = prompt("Enter the new player's name");
    if (newPlayerName && newPlayerName.trim() !== "") {
        players.push(newPlayerName);
        scores.push(0);

        const newPlayerIndex = players.length - 1;
        const newPlayerSection = document.createElement("section");
        newPlayerSection.classList.add("player");
        newPlayerSection.classList.add(`player_${newPlayerIndex}`);
        newPlayerSection.innerHTML = `
            <h2 class="name" id="name_${newPlayerIndex}">${newPlayerName}</h2>
            <p class="score" id="score_${newPlayerIndex}">0</p>
            <div class="current">
                <p class="current_label">Current</p>
                <p class="current_score" id="current_${newPlayerIndex}">0</p>
            </div>
        `;
        if (players.length % 2 === 0) {
            document.querySelector(".player-container.right").appendChild(newPlayerSection);
            newPlayerSection.classList.add("right");
        } else {
            document.querySelector(".player-container.left").appendChild(newPlayerSection);
            newPlayerSection.classList.add("left");
        }
    }
});

const btnEditNames = document.querySelector(".btn_edit_names");
btnEditNames.addEventListener("click", editNames);

const btnAddDice = document.querySelector(".btn_add_dice");
btnAddDice.addEventListener("click", addDice);

const btnRemoveDice = document.querySelector(".btn_remove_dice");
btnRemoveDice.addEventListener("click", removeDice);
