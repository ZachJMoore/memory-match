//random whole number between 0 and x: "Math.floor(Math.random() * x);"


//Variables and constants

const gameContainer = document.querySelector("#gameContainer");
const victoryModal = document.querySelector("#victory");
const gameCanvas = document.querySelector("#gameCanvas");
const startGame = document.querySelector("#startGame");
const reset = document.querySelector("#reset");
const movesMade = document.querySelector("#movesMade");
const movesMadeEnd = document.querySelector("#movesMadeEnd");
const headText = document.querySelector("h1");
const starsContainer = document.querySelector("#stars");
const starsContainerEnd = document.querySelector("#starsEnd")
const timeTaken = document.querySelector("#timeTaken");
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
//eventlisteners

reset.addEventListener("click", function () {
    resetGame();
});

gameCanvas.addEventListener("click", function (event) {
    if (event.target.nodeName === "H2") {
        resetGame();
    } else if (event.target.nodeName === "DIV" || "I"){
        selectCard(event);
    } 
});
document.querySelector("#restart").addEventListener("click", function () {
    resetGame();
    gameContainer.className = content.gameShown;
    victoryModal.className = content.modalHidden;
    console.log("Game was shown. Modal was hidden.");
})

//Functions

function resetGame() {
    console.log("resetGame function was called");
    let fragment = document.createDocumentFragment();
    for (let e = 1; e <= 2; e++) {
        console.log(e);
        for (let i = 1; i <= 8; i++) {
            let y = 0
            y += i
            if (e === 2) {
                y = 8 + i
            }
            let newDiv = document.createElement("div");
            let newIcon = document.createElement("i");
            console.log(`loop number ${y}`);
            newDiv.className = "card flex-container";
            newDiv.id = `card${y}`;
            newIcon.className = `fa fa-custom fa-${icons[i]}`;
            newIcon.id = `cardContent${y}`;
            newDiv.appendChild(newIcon);
            fragment.appendChild(newDiv);

        }
    }
    gameCanvas.innerHTML = "";
    gameCanvas.appendChild(fragment);

    //Randomize Cards
    for (let i = 1; i <= 16; i++) {
        let randomNumber = Math.floor(Math.random() * 16);
        if (randomNumber === 0) {
            randomNumber = 1;
        }
        let randomNumber2 = Math.floor(Math.random() * 16);
        if (randomNumber === 0) {
            randomNumber = 1;
        }
        console.log(randomNumber);
        let card = document.querySelector(`#card${randomNumber}`);
        let card2 = document.querySelector(`#card${randomNumber2}`);
        gameCanvas.insertBefore(card, card2);
    }
    movesMadeCounter = -1;
    matchProgress = 0;
    updateScore();
    let starFragment = document.createDocumentFragment();
    for (let i = 1; i <= 3; i++){
        let newStar = document.createElement("i");
        newStar.className = "fa fa-star"
        newStar.id = `star${i}`;
        starFragment.appendChild(newStar);
    }
    starsContainer.innerHTML = "";
    starsContainer.appendChild(starFragment);
    //reset end stars
    let starEndFragment = document.createDocumentFragment();
    for (let i = 4; i <= 6; i++){
        let newStar = document.createElement("i");
        newStar.className = "fa fa-star"
        newStar.id = `star${i}`;
        starEndFragment.appendChild(newStar);
    }
    starsContainerEnd.innerHTML = "";
    starsContainerEnd.appendChild(starEndFragment);
    console.log("resetGame function completed");
    startTime = performance.now();
};

let selectionOne;
let selectionTwo;
let selectionOneClasses;
let selectionTwoClasses;
const cardDefaultClasses = " card flex-container ";

function selectCard(event){
    if (event.target.nodeName === "DIV" && selectionCounter === 1) {
        selectionOne = event.target
        selectionOneClasses = event.target.firstChild.className;
        if (selectionOneClasses.length < 25 ){
            selectionCounter++;
            selectionOne.firstChild.className = selectionOneClasses + " fa-flipped";
            selectionOne.className = cardDefaultClasses + " card-flipped";
            console.log(`clicked on div with child class contents of ${selectionOne.firstChild.className} as your first selection`);
         }
    } else if (event.target.nodeName === "DIV" && selectionCounter === 2 && event.target.id !== selectionOne.id) {
        selectionCounter++;
        selectionTwo = event.target;
        selectionTwoClasses = event.target.firstChild.className;
        if (selectionOneClasses === selectionTwoClasses){
            console.log("you made a match");
            matchProgress++
            console.log(matchProgress);
            selectionCounter = 1;
            selectionTwo.firstChild.className = selectionTwoClasses + " fa-flipped";
            selectionTwo.className = cardDefaultClasses + " card-flipped";
        } else {
            selectionCounter = 1;
            selectionTwo.firstChild.className = selectionTwoClasses + " fa-flipped";
            selectionOne.className = cardDefaultClasses + " card-flipped card-incorrect";
            selectionTwo.className = cardDefaultClasses + " card-flipped card-incorrect";
            setTimeout(function(){
                selectionOne.firstChild.className = selectionOneClasses;
                selectionOne.className = cardDefaultClasses;
                selectionTwo.firstChild.className = selectionTwoClasses;
                selectionTwo.className = cardDefaultClasses;
            }, 250);
        }
        updateScore();
        checkForWin();
    }
}
//if (event.target.nodeName === "I") {
//    event.target = event.target.parentElement;
//}

function updateScore(){
    movesMadeCounter += 1;
    movesMade.textContent = movesMadeCounter;
    movesMadeEnd.textContent = movesMadeCounter;
    if (movesMadeCounter === 13){
        let star1 = document.querySelector("#star1");
        let star4 = document.querySelector("#star4");
        console.log("if statement")
        star1.parentElement.removeChild(star1);
        star4.parentElement.removeChild(star4);
    }
    if (movesMadeCounter === 15){
        let star2 = document.querySelector("#star2");
        let star5 = document.querySelector("#star5");
        console.log("if statement")
        star2.parentElement.removeChild(star2);
        star5.parentElement.removeChild(star5);
    }
    if (movesMadeCounter === 19){
        let star3 = document.querySelector("#star3");
        let star6 = document.querySelector("#star6");
        console.log("if statement")
        star3.parentElement.removeChild(star3);
        star6.parentElement.removeChild(star6);
    }
}
function checkForWin(){
    if (matchProgress === 8){
        headText.textContent = "Congrats!";
        endTime = performance.now();
        setTimeout(function(){
            timeTaken.textContent = Math.round(((endTime - startTime) / 1000))
            gameContainer.className = content.gameHidden;
            victoryModal.className = content.modalShown;
            console.log("Game was hidden. Modal was shown.");
            headText.textContent = "Memory Match!";
        }, 1000);
    };
}