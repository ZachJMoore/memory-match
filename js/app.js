//Main ariables and constants

const gameContainer = document.querySelector("#gameContainer");
const victoryModal = document.querySelector("#victory");
const gameCanvas = document.querySelector("#gameCanvas");
const startGame = document.querySelector("#startGame");
const reset = document.querySelector("#reset");
const movesMade = document.querySelector("#movesMade");
const movesMadeEnd = document.querySelector("#movesMadeEnd");
const headText = document.querySelector("h1");
const starsContainer = document.querySelector("#stars");
const starsContainerEnd = document.querySelector("#starsEnd");
const timeTaken = document.querySelector("#timeTaken");
const timer = document.querySelector("#timer");
const content = {
    gameHidden: "game-container content-hidden",
    gameShown: "game-container",
    modalHidden: "victory flex-container",
    modalShown: "victory flex-container content-visible"
};
const icons = ["", "linux", "eye", "flag", "envira", "cut", "key", "anchor", "code"];
let selectionCounter = 1;
let movesMadeCounter = -1;
let matchProgress = 0;
let endTime;
let timerIndex = 0;
let timerOn = false;

//this resets the match when pressing the little undo icon
reset.addEventListener("click", function () {
    resetGame();
});

//this listens for clicks either on the start button or if the game has already started and the player is selecting a card.
gameCanvas.addEventListener("click", function (event) {
    if (event.target.nodeName === "H2") {
        resetGame();
    } else if (event.target.nodeName === "DIV" || "I") {
        selectCard(event);
    };
});

//this restarts the game if the end restart button is pressed as well as unhides the main area and then hides the modal.
document.querySelector("#restart").addEventListener("click", function () {
    resetGame();
    gameContainer.className = content.gameShown;
    victoryModal.className = content.modalHidden;
});

//Functions

function resetGame() {
    //Creates cards
    let fragment = document.createDocumentFragment();
    for (let e = 1; e <= 2; e++) { //this loops twice to create two of each card
        for (let i = 1; i <= 8; i++) {
            //this y and if statement let me count to 16 gradually 1 number per every loop allowing me to assign unique id names while also creating two cards of the same kind
            let y = 0;
            y += i;
            if (e === 2) {
                y = 8 + i;
            }
            let newDiv = document.createElement("div");
            let newIcon = document.createElement("i");
            newDiv.className = "card flex-container";
            newDiv.id = `card${y}`;
            newIcon.className = `fa fa-custom fa-${icons[i]}`;
            newIcon.id = `cardContent${y}`;
            newDiv.appendChild(newIcon);
            fragment.appendChild(newDiv);

        };
    };
    //erases the contents of the game canvas and appends all of the cards created above into it
    gameCanvas.innerHTML = "";
    gameCanvas.appendChild(fragment);

    //Randomize Cards
    for (let i = 1; i <= 16; i++) {
        //generates 2 random number between 1 and 16 and applies them to seperate variables
        let randomNumber = Math.floor(Math.random() * 16);
        if (randomNumber === 0) {
            randomNumber = 1;
        };
        let randomNumber2 = Math.floor(Math.random() * 16);
        if (randomNumber === 0) {
            randomNumber = 1;
        };
        //using the first random number, select a card with id of card[randomNumber], then randomly select another card. Take these two cards and switch them around. loop once per card in the game (which is 16). This may not be the most effective way to do it, but it seems fast and it gives a good randomization.
        let card = document.querySelector(`#card${randomNumber}`);
        let card2 = document.querySelector(`#card${randomNumber2}`);
        gameCanvas.insertBefore(card, card2);
    }
    //resets variables tracking how many moves they have made, and how many matches have been made, then update these changes.
    movesMadeCounter = -1;
    matchProgress = 0;
    updateScore();
    //this loops through and creates the stars for the beginning screen, and erases the contents before appending. This resets how many stars a player has.
    let starFragment = document.createDocumentFragment();
    for (let i = 1; i <= 3; i++) {
        let newStar = document.createElement("i");
        newStar.className = "fa fa-star";
        newStar.id = `star${i}`;
        starFragment.appendChild(newStar);
    };
    starsContainer.innerHTML = "";
    starsContainer.appendChild(starFragment);
    //this does the exact same thing except for the end modal screen instead.
    let starEndFragment = document.createDocumentFragment();
    for (let i = 4; i <= 6; i++) {
        let newStar = document.createElement("i");
        newStar.className = "fa fa-star";
        newStar.id = `star${i}`;
        starEndFragment.appendChild(newStar);
    };
    //resets and starts timer on line #220
    timerIndex = 0;
    timerOn = true;
    starsContainerEnd.innerHTML = "";
    starsContainerEnd.appendChild(starEndFragment);
    //once all this ran becasue a player has either pressed the start button, reset, or restart, their start time begins.
    startTime = performance.now();
};

let selectionOne; //represents the first div that was selected
let selectionTwo; //represents the Second one selected
let selectionOneClasses; //this gives the classes of the child of selectionOne, which is the icon contained inside of the card
let selectionTwoClasses; //this one does the same thing except for the second selection
const cardDefaultClasses = " card flex-container "; //these are the default classes for the div which I can use to effectively reset the card backgrounds

function selectCard(event) {
    //this checks to make sure the player is not clicking on the card container (gameCanvas), then check to see if this is this first selection
    if (event.target.nodeName === "DIV" && selectionCounter === 1) {
        //sets the event target to variables for easier use.
        selectionOne = event.target
        selectionOneClasses = event.target.firstChild.className;
        //this ensures that a class (e.g "fa-flipped") has not been added already. Essentially checking if a card is already flipped
        if (selectionOneClasses.length < 25) {
            //selection is counted so I know the next click will be their second choice. also then flips the card over
            selectionCounter++;
            selectionOne.firstChild.className = selectionOneClasses + " fa-flipped";
            selectionOne.className = cardDefaultClasses + " card-flipped";
        };
    } //if this is not the gameCanvas and they are on their second selection and they arent selecting the same card as before, continue.
    else if (event.target.nodeName === "DIV" && selectionCounter === 2 && event.target.id !== selectionOne.id) {
        selectionCounter++;
        selectionTwo = event.target;
        selectionTwoClasses = event.target.firstChild.className;
        //this compares the two selected i element classes against each other to see if they match.
        if (selectionOneClasses === selectionTwoClasses) {
            //if they match, the match progress goes up indicating they have made x amount of pairs so far. selectionCounter gets reset and the card is turned green and the icon is made visible.
            matchProgress++
            selectionCounter = 1;
            selectionTwo.firstChild.className = selectionTwoClasses + " fa-flipped";
            selectionTwo.className = cardDefaultClasses + " card-flipped";
        } else {
            //if its not a match, reset the counter, change both cards over with a red background.
            selectionCounter = 1;
            selectionTwo.firstChild.className = selectionTwoClasses + " fa-flipped";
            selectionOne.className = cardDefaultClasses + " card-flipped card-incorrect";
            selectionTwo.className = cardDefaultClasses + " card-flipped card-incorrect";
            //wait for a small amount of time to give a glimpse, then reset things back to normal defaults.
            setTimeout(function () {
                selectionOne.firstChild.className = selectionOneClasses;
                selectionOne.className = cardDefaultClasses;
                selectionTwo.firstChild.className = selectionTwoClasses;
                selectionTwo.className = cardDefaultClasses;
            }, 250);
        }
        //updates the text and stars on the screens as well as checks to see if they won.
        updateScore();
        checkForWin();
    }
}

function updateScore() {
    //counts how many guess/moves have been made so far and updates the text in index.html
    movesMadeCounter += 1;
    movesMade.textContent = movesMadeCounter;
    movesMadeEnd.textContent = movesMadeCounter;
    //if they have made 14 guesses, remove a star, if they get to 16, remove a star, etc.
    if (movesMadeCounter === 14) {
        let star1 = document.querySelector("#star1");
        let star4 = document.querySelector("#star4");
        star1.parentElement.removeChild(star1);
        star4.parentElement.removeChild(star4);
    }
    if (movesMadeCounter === 16) {
        let star2 = document.querySelector("#star2");
        let star5 = document.querySelector("#star5");
        star2.parentElement.removeChild(star2);
        star5.parentElement.removeChild(star5);
    }
}

function checkForWin() {
    //if the player has made 8 matches, which is the total number possible, then the heading changes to say congrats, their time gets stopped.
    if (matchProgress === 8) {
        headText.textContent = "Congrats!";
        endTime = performance.now();
        timerOn = false;
        setTimeout(function () {
            //then it waits for one second so they can see they won, then calculate the time taken, round up, and set it.
            timeTaken.textContent = Math.round(((endTime - startTime) / 1000))
            //display the end modal, and hide the main area.
            gameContainer.className = content.gameHidden;
            victoryModal.className = content.modalShown;
            headText.textContent = "Memory Match!";
        }, 1000);
    };
};

//This keeps the time up to date
setInterval(function () {
    if (timerOn === true) {
        timer.textContent = timerIndex;
        timerIndex++;
        console.log(`${timerIndex} seconds have gone by`);
    };
}, 1000);
//to stop interval: clearInterval(timer);
