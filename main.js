
document.body.style.backgroundColor = 'green';

//Global Values________________________________


//Key variables:

let keysEnabled = true;
let keyEnterEnabled = true;
let keyEnterFunction = 'noFunction';
let keyDefaultEnabled = true;

//Round Variables

let turn = 'player';
let drawable = false;
let cardsArray = {};
cardsArray['player'] = [];
cardsArray['dealer'] = [];
let playerPoints = 0;
let dealerPoints = 0;

//Betting Variables

let playerMoney = 10000;
let playerBet = 0;

/* 
playermoney = Number(localStorage.getItem('playerMoney'));
console.log(playerMoney);
 */

//Event Listeners

document.addEventListener('keydown',async function(event){

    key = event.key
    if (keysEnabled){
        switch (key) {
            case 'd':
                if (drawable === false) {
                    showMessage1SecIns1('You cannot draw now. It is not your turn');
                    return;
                }
                else {
                    drawable = false;
                    showMessage1SecIns1('Drawing next card...');
                    await waitPromise(1000);
                    draw();
                    checkBust(playerPoints);
                }
                break;
            case 's':
                if (drawable === false) {
                    showMessage1SecIns1('It is not your turn');
                    await waitPromise(1000);
                    return;
                }
                else {
                    drawable = false;
                    instructions1 (`You stayed with ${playerPoints}`);
                    await waitPromise(1000);
                    stay();
                }
                break; 
            case 'Enter':
                keyEnterEnabled? enterFunctions() : showMessage1SecIns1('Enter has no use right now');
                break;       
            default:
/*                 showMessage1SecIns1('That key has no use');
                console.log(key); */
                break;
        }
    } 
})

// GAME START__________________________________________________________

bettingRound();

// functions _____________________________________________________

//Betting functions_______________________________________

function playerMoneyUpdate(){
    document.getElementById('playerMoney').innerText = `${playerMoney} €`;
}

function bettingRound(){
    bootValues();
    playerMoneyUpdate()
    instructions1(`You have ${playerMoney} €, how much do you want to bet?`);
    instructions2('Introduce your bet and press Enter');
    createInputBetField()
    keyEnterFunction = 'placeBet';

}

function createInputBetField(){

    let fixBet = document.getElementById('playerBetFix');
    if (fixBet != null){
        betDiv.removeChild(document.getElementById('betDiv').lastChild);
    }

    let inputBox = document.getElementById('playerBet');
    if (inputBox == null){
  
        let newInput = document.createElement('input');
        newInput.id = 'playerBet';
        newInput.style.top = '50px';
        newInput.style.width = '100px';
        newInput.style.height = '50px';
        newInput.style.backgroundColor = 'white';
        betDiv.appendChild(newInput);
    }
}

function removeInputBetField(){
    let betDiv = document.getElementById('betDiv');
    betDiv.removeChild(betDiv.lastChild);

    let newInput = document.createElement('h2');
    newInput.id = 'playerBetFix';
    newInput.innerText = `${playerBet}€`;
    newInput.style.top = '100px';
    betDiv.appendChild(newInput);
}

function readPlayerBet(){

    playerBet = Number(document.getElementById('playerBet').value);
    let checkPlayerBet = isNaN(playerBet);
    if (playerBet <= playerMoney && playerBet > 0){

        playerMoney -= playerBet;
        document.getElementById('playerBet').value = '';
        playerMoneyUpdate();
        removeInputBetField();
        roundStart();
    }
    else{
        showMessage1SecIns1('Wrong bet, please introduce only an amount');
        bettingRound();
    }
}

//Key functions___________________________________________

function enterFunctions(){
    switch (keyEnterFunction) {
        case 'startGame':

            break; 

        case 'startRound':
            bettingRound();
            break;
        case 'placeBet':
            readPlayerBet();
            break;             
        case 'noFunction':
        
            break;
        default:
            break;
    }
}

//Log Functions_________________________

function showMessage1SecIns1(string){
    keysEnabled = false;
    let currentMessage = document.getElementById('instructions1').innerText;
    instructions1(string);
    setTimeout(function(){
        instructions1(currentMessage);
    },1000);
    keysEnabled = true;
}

function instructions1 (string){
    document.getElementById('instructions1').innerText = string;
}

function instructions2 (string){
    document.getElementById('instructions2').innerText = string;
}

// Game Dynamics Functions_____________________________

function roundStart(){
    keysEnabled = false;
    createCard();
    changeTurn();
    setTimeout(() => {
        createCard();
        changeTurn();
        setTimeout(() => {
            createCard();
            checkBust(playerPoints);
        }, 1000);
    }, 1000);
    keysEnabled = true;
}

function changeTurn(){

    if (turn === 'player'){
        turn = 'dealer';
    }
    else{
        turn = 'player';
    }
}

function drawOrStay(){
    drawable = true;
    instructions1 ('Do you want to draw another card or do you want to stay?')
    instructions2 ('Press D key to draw or S key to stay')
};

function draw(){
    createCard();
}

function stay(){
    changeTurn();
    createCard();
    dealerPlays();
}

function dealerPlays(){
    console.log('Dealer plays');
    console.log(dealerPoints);
    if (dealerPoints < 17){
        setTimeout(x =>{
            createCard();
            dealerPlays();
        },1000);
    }
    else if (dealerPoints <= 21){

        if (dealerPoints > playerPoints){
            playerLoses();
        }
        if (dealerPoints == playerPoints){
            playerTies();
        }        
        if (dealerPoints < playerPoints){
            playerWins();
        }           

    }
    else if (dealerPoints > 21){
        playerWins();
    }
}

function playerLoses(){
    drawable = false;
    instructions1(`You lost ${playerBet}€`);
    roundEnd();
}

function playerWins(){
    instructions1(`You won ${playerBet}€`);
    playerMoney += (2*playerBet);
    roundEnd();
}

function playerTies(){
    instructions1(`Player ties, you get back your ${playerBet}€ bet`);
    playerMoney += playerBet;
    roundEnd();
}

function roundEnd(){
    playerMoneyUpdate();
/* 
    localStorage.setItem('playerMoney',playerMoney);
    console.log(localStorage.getItem('playerMoney'));
     */
    instructions2('Press Enter to start next round');    
    checkBankrupt();
    keyEnterEnabled = true
    keyEnterFunction = 'startRound';
}

// Game Dynamics Secondary Functions_____________________________

function bootValues(){
    keyEnterEnabled = true
    turn = 'player';
    drawable = false;
    cardsArray = {};
    cardsArray['player'] = [];
    cardsArray['dealer'] = [];
    playerPoints = 0;
    dealerPoints = 0;
    showPoints();
    document.getElementById('playerCards').innerHTML = '';
    document.getElementById('dealerCards').innerHTML = '';    
}

function createCard(){
    
    let newCard = document.createElement('img');
    newCard.dataset.number = randNumber();
    newCard.dataset.letter = cardLetter(newCard.dataset.number);
    newCard.dataset.value = cardValue(newCard.dataset.number);
    newCard.className = turn;

    newCard.dataset.Type = randType();

    newCard.dataset.code = `${newCard.dataset.letter}${newCard.dataset.Type}`;
    newCard.style.width = '100px'
    newCard.style.height = '170px'
    newCard.src = `cards/${newCard.dataset.code}.png`;
    let currentDiv = document.getElementById(`${turn}Cards`);
    currentDiv.appendChild(newCard);

    cardsArray[turn].push(newCard.dataset.value);

    turn == 'player'? playerPoints = valueArr(cardsArray[turn]) : dealerPoints = valueArr(cardsArray[turn])

    showPoints();
}

function sumArr(arr){
    return arr.reduce(function(a,b){
      return Number(a) + Number(b)
    }, 0);
  } 

async function checkBust(value){

    if (value < 21){
        drawOrStay();
    }
    else if (value == 21){
        drawable = 'false';
        instructions1 ('You got Black Jack!');
        await waitPromise(1500);
        changeTurn();
        dealerPlays();
    }
    else if (value > 21){
        drawable = 'false';
        instructions1('Bad luck! You got Busted!')
        await waitPromise(2000);
        playerLoses();
    }                   
}

function checkBankrupt(){
    if (playerMoney == 0){
        keysEnabled = false;
        instructions1(`You lost ${playerBet}€ and you have lost all your money, please go home`)
        instructions2('You cannot continue playing, you should think what you are doing')
    }
}

function showPoints(){
    document.getElementById('playerPoints').innerText = playerPoints;
    document.getElementById('dealerPoints').innerText = dealerPoints;
}

function valueArr(arr){
    let checkAs = arr.includes('1');   
    let value = Number(sumArr(arr));

    if (checkAs == true && value < 12){
        value +=10;
    }
    return value;
}

//Create Random Card Functions_________________________________

function randNumber(){
    return Math.floor((Math.random()*13)+1)
}

function cardValue(number){
    if (number > 10){
        return 10;
    }
    else { 
        return number;
    }
}

function cardLetter(numberStr){
    let number = Number(numberStr);
    switch (number){
        case 1:
            return 'a';  
        case 11:
            return 'j';
        case 12:
            return 'q';  
        case 13:
            return 'k'; 
        default:
            return number;              
    }
}

function randType(){
    let r = Math.floor((Math.random()*4));
    switch (r) {
        case 0:
            return 's'
        case 1:
            return 'd'  
        case 2:
            return 'c'
        case 3:
            return 'h'                

    }
}

function waitPromise(milis) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, milis);
    });
}