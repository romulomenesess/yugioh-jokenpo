const state ={
    score: {
        playerScore: 0,
        computerScore : 0,
        scoreBox: document.getElementById("score-points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards:{
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    actions: {
        button: document.getElementById("next-duel"),
    },
};

const playerSides = {
    player1: "player-cards",
    computer: "computer-cards",
};

const cardData = [
    {  
        id: 0,
        name: "Dragon Branco de Olhos Azuis",
        type: "Papel",
        img: `src/assets/icons/dragon.png`,
        WinOf:[1],
        LoseOf:[2],
    },
    {  
        id: 1,
        name: "Mago Negro",
        type: "Pedra",
        img: `src/assets/icons/magician.png`,
        WinOf:[2],
        LoseOf:[0],
    },
    {  
        id: 2,
        name: "Exodia",
        type: "Tesoura",
        img: `src/assets/icons/exodia.png`,
        WinOf:[0],
        LoseOf:[1],
    },
];

const players = {
    player1: "player-field-card",
    computer: "computer-field-card",
};

async function getRandomCardId(){
    const randomIndex = Math.floor(Math.random()* cardData.length)
    return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldCards) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if(fieldCards === playerSides.player1){
        cardImage.addEventListener("click", ()=>{setCardsField(cardImage.getAttribute("data-id"));
        });

        cardImage.addEventListener("mouseover", ()=> {
            drawSelectCard(IdCard);
        });
    }

    return cardImage;
}

async function setCardsField(cardId) {
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    await hiddenCardsDetails();

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function hiddenCardsDetails() {
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
    state.cardSprites.avatar.src = "";
}

async function drawButton(text) {
    state.actions.button.style.display = text;
    state.actions.button.style.display = "block";
}

async function updateScore (){
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

async function checkDuelResults(playerCardId, computerCardId){
    let duelResults = "Draw";
    let playerCard = cardData[playerCardId];

    if(playerCard.WinOf.includes(computerCardId)){
        duelResults = "Win";
        await playAudio("Win");
        state.score.playerScore++;
    }

    if(playerCard.LoseOf.includes(computerCardId)){
        duelResults = "Lose";
        await playAudio("Lose");
        state.score.computerScore++;
    }
}

async function removeAllCardsImages(){
    let cards = document.querySelector("#computer-cards");
    let imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    cards = document.querySelector("#player-cards");
    imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function drawSelectCard(index){
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Tipo: " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide){
    for (let i = 0 ; i <cardNumbers; i++){
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard,fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    };
}

async function resetDuel(){
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}

function init() {

    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);

    const bgm = document.getElementById("bgm")
    bgm.play();
}

init();