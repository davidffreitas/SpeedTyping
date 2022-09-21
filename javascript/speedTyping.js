/* speedTyping.js */
/*
    Array that holds the words which will be drawn from to produce the typing section: taken from
    the 100 most popular words in the english language.
 */
var wordArray = [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "I", "it", "for", "not", "on",
    "with", "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we",
    "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", 
    "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make",
    "can", "like", "time", "no", "just", "him", "know", "take", "people", "into", "year", "your",
    "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only",
    "come", "its", "over", "think", "also", "back", "after", "use", "two", "how", "our", "work",
    "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day",
    "most", "us"
];

/*
    Target the variables from the HTML. The time selection takes in the selected value of the
    time and use it for the countdown of the game's loop. The 'Begin' and time selection
    buttons will be removed once begin is clicked.
 */
var stage = document.getElementById("stage");
var timeTitle = document.getElementById("timeTitle");
var begin = document.getElementById("confirm");

/*
    The number of the correct words typed is tracked so that the score can be calculated at the
    end of the game. An array is created as an unordered list to contain the previously typed
    word, the current word to be typed and the next word. Time variables are also needed for the
    score and to keep track of the countdown timer that will end the game once it reaches 0.
 */
var correctWords = 0;
var promptArea = document.createElement("div");
promptArea.setAttribute("class", "words");
var promptList = document.createElement("ul");
promptList.setAttribute("class", "prompt");
var lastPrompt = document.createElement("li");
var currentPrompt = document.createElement("li");
var nextPrompt = document.createElement("li");
var promptArray = [];
var wordBox = document.createElement("input");
var seconds;
var timeValue;
var gameCounter;
var countDown = document.createElement("p");

/*
    This is the main function and is started once the user presses the 'Begin' button as defined
    in the HTML. The function removes the selection elements and creates new input elements in
    its place that will prompt and take the user input to determine the score at the end.
 */
function startTyping(event) {
    /*
        Gets the value from the radio input to initialize the amount of time in the game, and
        establish the time value by which the score will be calculated at the end.
     */ 
    seconds = timeValue = document.querySelector("input[name=timeButton]:checked").value;

    //Removing the unnecessary elements from the stage
    let timeButtons = document.getElementById("timeSelect");
    stage.removeChild(timeTitle);
    stage.removeChild(timeButtons)
    begin.parentNode.removeChild(begin);

    //Creating the prompt area that will house the words for the user to type.
    stage.appendChild(promptArea);
    promptArea.appendChild(promptList);
    promptList.appendChild(lastPrompt);
    promptList.appendChild(currentPrompt);
    promptList.appendChild(nextPrompt);

    //As well as the wordBox will actually take the user input and the countdownt timer.
    stage.appendChild(wordBox);
    //The wordbox gets focused automatically.
    wordBox.focus();
    stage.appendChild(countDown);

    //Create list of words that will prompt the user to type out.
    newWord();

    //The first function call starts the timer and the interval calls update with the right time.
    timer();
    gameCounter = setInterval(timer, 1000);

    /*
        This listener looks for when the user is done typing anything, and the function attempts
        to match it to the current word in the array.
     */
    wordBox.addEventListener("keyup", checkWord);
}

function newWord() {
    /*
        For the first word (when the user has not finished typing any words correctly), a blank
        space will be inserted for the "last word".
     */
    if(correctWords == 0) {
        for(var i = 0; i < 3; i++) {
            if(i == 0) {
                promptArray[i] = "______";
            //After that the function picks a random word for the current and next word.
            } else {
                promptArray[i] = wordArray[Math.floor(Math.random() * 100)];
            }
        }
    /*
        Once the user has typed the current word(i.e. the second word in the array) successfully,
        the current word becomes the last word, the next word becomes the current word, and a new
        word is generated for the next word.
     */
    } else {
        promptArray[0] = promptArray[1];
        promptArray[1] = promptArray[2];
        promptArray[2] = wordArray[Math.floor(Math.random() * 100)];
    }
    lastPrompt.innerHTML = promptArray[0];
    lastPrompt.setAttribute("class","promptLast");
    currentPrompt.innerHTML = promptArray[1];
    currentPrompt.setAttribute("class", "promptCurrent");
    nextPrompt.innerHTML = promptArray[2];
    nextPrompt.setAttribute("class", "promptNext");    
}

function checkWord(event) {
    //Takes the value of the input in the box and checks it with the value of the current word.
    if(wordBox.value === promptArray[1]) {
        /*
            If a match is found, the number of correct words is brought up, the value of the box 
            is reset, and a new word is generated as the prompt shifts.
         */
        correctWords++;
        wordBox.value = "";
        newWord();
    }
}

function timer() {
    /*
        The countdown timer is reinitialized each iteration, the minutes are calculated by how
        times it can be devided by 60 seconds, and the seconds takes the remainder. If the
        seconds column only has one digit, a 0 is added before it so the timers looks consistent.
     */
    countDown.innerHTML = `${Math.floor(seconds / 60)}:`;
    if((seconds % 60) >= 10) 
        countDown.innerHTML += (seconds % 60);
    else if((seconds % 60) < 10) {
        if(seconds <= 5)
            countDown.setAttribute("style", "color:red;");
        countDown.innerHTML += "0" + (seconds % 60);
    }
    //Once the timer reaches 0, the game is over.
    if(seconds === 0)
        endGame();
    //Updates the seconds after the check has been done.
    seconds -= 1;
}

//This fuction stops the typing functionality, stop the timer function and calculates the score.
function endGame() {
    wordBox.disabled = true;
    clearInterval(gameCounter);
    /*
        The score is: the amount of words typed correctly divided by the time value which is then
        multiplied by 60. This score is then rounded to the nearest integer and displayed.
     */
    countDown.innerHTML = "You got a score of " + Math.round((correctWords / timeValue) * 60)
        +" WPM";
}