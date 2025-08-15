/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import games from './games.js';
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)
// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {
    // loop over each item in the data
    const bottomColor = "#66B6D0";
    const topColor = "black";

    let counter = 0; // initialize a counter to keep track of the number of games
    for (let game of games) {
        let gameCard = document.createElement("div"); // create a new div element, which will become the game card
        gameCard.classList.add("game-card"); // add the class game-card to the list
        
        const notCappedpercent = game.pledged/game.goal * 100; // bottom color percentage
        const percent = Math.min(Math.max(notCappedpercent, 8), 100);
        gameCard.innerHTML = `
        <h2 class = "game-name">${game.name}</h2>
        <img class = "game-img" src="${game.img}" alt="${game.name} image" >
        <p>${game.description}</p>
        <p class ="gameStats" id="game-${counter}">Pledged: $${game.pledged.toLocaleString()} of $${game.goal.toLocaleString()} goal by ${game.backers} backers</p>
        
        `
        gamesContainer.appendChild(gameCard);
         // set the inner HTML of the game card with the game data
        const gameFunds = document.getElementById(`game-${counter}`); // get the game stats element by id
        gameFunds.style.background = `linear-gradient(to top, ${bottomColor} ${percent}%, ${topColor} ${percent}%)`;
        gameFunds.style.color = 'rgb(255, 255, 255)';

         // append the game card to the games-container
        counter++; // increment the counter
    }
}

// call the function we just defined using the correct variable
addGamesToPage(GAMES_JSON); // this will add the initial set of games to the page
// later, we'll call this function using a different list of games


/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce((contributions, game) =>{
    return contributions + game.backers;
}, 0); 


contributionsCard.innerHTML = `
<p class="half-colored">${totalContributions.toLocaleString("en-US")}</p>`


// set the inner HTML using a template literal and toLocaleString to get a number with commas


// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

const totalRaised = GAMES_JSON.reduce((total, game) => {
    return total + game.pledged;},0);

// set inner HTML using template literal
raisedCard.innerHTML = `<p>$${totalRaised.toLocaleString("en-US")}</p>`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");

gamesCard.innerHTML = `<p>${GAMES_JSON.length}</p>`;

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    const unfundedGames = GAMES_JSON.filter((game) =>{
        return game.pledged < game.goal;
    });
    // use filter() to get a list of games that have not yet met their goal
    addGamesToPage(unfundedGames);

    // use the function we previously created to add the unfunded games to the DOM

}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    const fundedGames = GAMES_JSON.filter((game) =>{
        return game.pledged >= game.goal;
    });
    // use filter() to get a list of games that have not yet met their goal
    

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(fundedGames);
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);


/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const unfundedGamesCount = GAMES_JSON.filter((game) => game.pledged < game.goal).length;


// create a string that explains the number of unfunded games using the ternary operator
const displayStr = `A total of $${totalRaised.toLocaleString()} has been raised for ${GAMES_JSON.length} games. Currently, ${unfundedGamesCount} ${unfundedGamesCount === 1 ? "game remains" : "games remain"} unfunded. We need your help to fund these amazing games!`;


// create a new DOM element containing the template string and append it to the description container
const newDescription = document.createElement("p");
newDescription.innerHTML = displayStr;
descriptionContainer.appendChild(newDescription);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [firstGame, secondGame, ...rest] = sortedGames;
// create a new element to hold the name of the top pledge game, then append it to the correct element
const topGame = document.createElement("p");
topGame.innerHTML = firstGame.name;
firstGameContainer.appendChild(topGame);

// do the same for the runner up item
const secondGameElem = document.createElement("p");
secondGameElem.innerHTML = secondGame.name; 
secondGameContainer.appendChild(secondGameElem);


// Implement search functionality
const searchForm = document.getElementById("search-form")
const searchInput = document.getElementById("search-input");

function search(Games){
    const searchGames = Games.filter((game) =>{
        return game.name.toLowerCase().includes(searchInput.value.toLowerCase()) || game.description.toLowerCase().includes(searchInput.value.toLowerCase())
    });
    deleteChildElements(gamesContainer);
    addGamesToPage(searchGames)

}
searchForm.addEventListener("submit", (e) => {
  e.preventDefault(); 
  search(GAMES_JSON)
});
