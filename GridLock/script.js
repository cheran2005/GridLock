// ======= references to DOM elements =======
const welcome_screen = document.querySelector(".welcome-screen");
const difficulty_screen = document.querySelector(".choose-difficulty");
const start_game_button = document.getElementById("start-game-btn");
const go_home = document.getElementById("go-home");

const go_home_2 = document.getElementById("go-home-2");

const game_grid = document.querySelector(".game-grid");

const easy_difficulty_btn = document.getElementById("easy-difficulty-btn");
const easy_grid = document.querySelector(".grid-difficulty-easy");

const normal_difficulty_btn = document.getElementById("normal-difficulty-btn");
const normal_grid = document.querySelector(".grid-difficulty-normal");

const hard_difficulty_btn = document.getElementById("hard-difficulty-btn");
const hard_grid = document.querySelector(".grid-difficulty-hard");

const question_container = document.querySelector(".questions_container");

const submit_btn = document.getElementById("submit-btn");
const nextround_btn = document.getElementById("next-round");

const timer_txt = document.getElementById("timer");

const score_box = document.getElementById("efficiency");

const score_result = document.getElementById("score_results");


// ======= Variables arrays =======
let correct_count = 0;
let memory_score = 0;

let question_id = ["question-1","question-2","question-3"];

let question_num = [".question-1",".question-2",".question-3"];

let round_result_id = ["round_result_1","round_result_2","round_result_3"];

let emojiset_easy = [];
let emojiset_normal = [];
let emojiset_hard = [];
let quiz_questions = [];

let rounds_efficiency = [];
let rounds_efficiency_index = 0;

const emojiSet = [
  "🍎", "🍌", "🍇", "🍉", "🍓", "🍍",
  "🥝", "🍒", "🥥", "🥭", "🍈",
  "🚗", "✈️", "🚀", "🚲", "🛴", "🛵",
  "🐶", "🐱", "🐭", "🐰", "🦊", "🐻",
  "🐼", "🐸", "🦁", "🐯", "🐷", "🐧",
  "😄", "😂", "😎", "🥳", "🤖",
  "🌈", "☀️", "🌙", "⭐", "⚡",
  "🍕", "🍔", "🍟", "🌮", "🍪",
  "🏀", "⚽", "🎮", "🎲", "🎯",
  "💡", "📚", "🖊️", "🧠", "🧊",
  "🎵", "📷", "📦", "🔑"
];


// ======= Start game countdown =======
function startcountdown(seconds){
    let counter = seconds;
    const timer_text = document.getElementById("timer");

    return new Promise((resolve) =>{

        timer_text.textContent = `${counter}`;
        counter--;
        const countdown = setInterval(function(){
            timer_text.textContent = `${counter}`;
            counter--;

            go_home.addEventListener("click",function(){
                clearInterval(countdown);
                resolve();
            });

            if(counter<0){
                clearInterval(countdown);
                timer_text.textContent = "Times Up!";
                resolve();
            }

        },1000);
        
    });
}

// ======= Delay function to delay game in async function=======
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ======= Get random int to randomize questions and game elements=======
function getRandomInt(max) {
  return Math.floor(Math.random() * (max));
}

// ======= Set emoji array that will be displayed on the grid=======
function set_grid_array(row,col,arrayset){

    return new Promise((resolve) =>{

        for (let i =0;i<row;i++){
            arrayset[i] = [];
            for (let j = 0;j<col;j++){
                arrayset[i][j] = emojiSet[getRandomInt(emojiSet.length)];
            }
        }
        resolve();
    });
    
}

// ======= Empy grid from screen=======
function empty_grid(grid){
    const cells = grid.querySelectorAll(".invisible-box");
    
     return new Promise((resolve) =>{
        cells.forEach(function(cell){
        const p = cell.querySelector("p");
        if (p){cell.removeChild(p);}
        });
        resolve();
    });   
}

// ======= fill grid in screen=======
function fill_grid(row,col,grid,arrayset){
    const cells = grid.querySelectorAll(".invisible-box");
    let i = 0;
    let j = 0;
    return new Promise((resolve) =>{
        cells.forEach(function(cell){
            const new_emoji = document.createElement("p");
            new_emoji.classList.add("emoji-box");
            new_emoji.textContent= arrayset[i][j++];
            cell.appendChild(new_emoji);

            if (j>=col){
                j = 0;
                i++;
                if (i>=row){
                    return;
                }
            }

        });
        resolve();
    });
}


// ======= Fade elements out and remove display=======
function fadeOutAndHide(grid) {
    return new Promise((resolve) => {
    
        grid.classList.add("fadeout");
        grid.classList.remove("fadein");

        requestAnimationFrame(() => {
            function handleTransitionEnd(e) {
                if (e.propertyName === "opacity") { 
                grid.removeEventListener("transitionend", handleTransitionEnd);
                grid.classList.remove("active");   
                grid.classList.remove("fadeout");  
                resolve();
                }
            }

            grid.addEventListener("transitionend", handleTransitionEnd);
        });
    });
}

// ======= Fade in elements and display=======
function fadein(container){

    return new Promise((resolve) => {
        let resolved = false;
    
        container.classList.add("active");

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    container.classList.add("fadein");

                    function handleTransitionEnd(e) {
                        if (e.propertyName === "opacity") { 
                        container.removeEventListener("transitionend", handleTransitionEnd); 
                        resolved = true; 
                        resolve();
                        }
                    }
                    container.addEventListener("transitionend", handleTransitionEnd);

                });
            });
        });
}

// ======= Add questions to page=======
function add_questions_to_page(row,col,emojiset_diff){
    quiz_questions = generate_question(row,col,emojiset_diff);

    return new Promise((resolve) => {
        for (let i = 0 ;i<3;i++){

            const parentElement = document.querySelector(question_num[i]);
            parentElement.querySelector(".question-title").textContent = quiz_questions[i].question;
            
            const option_container =  parentElement.querySelector(".question-options");

            quiz_questions[i].options.forEach((obj) => {
                const option = document.createElement("option");
                option.value = obj;           
                option.textContent = obj;
                option.classList.add("temp-option");
                option_container.appendChild(option);
            });
        }
        resolve();
    });
}

// ======= Submit button after user enters answers=======
function waitforsubmit(btn){
    return new Promise((resolve) => {

        btn.addEventListener("click",function(){
        
            for (let i = 0;i<3;i++){

                if (question_container.querySelector(`#${question_id[i]}`).value == quiz_questions[i].answer){
                    correct_count++;
                    const correct = document.createElement("p");
                    correct.textContent = "✅";
                    correct.classList.add("symbol_check_ans");
                    correct.id = `symbol-${i}`;
                    question_container.querySelector(question_num[i]).appendChild(correct);
                } 

                else{
                    const incorrect = document.createElement("p");
                    incorrect.textContent = "❌";
                    incorrect.classList.add("symbol_check_ans");
                    incorrect.id = `symbol-${i}`;
                    question_container.querySelector(question_num[i]).appendChild(incorrect);
                }
            }
            memory_score = (correct_count/3)*100;

            
            rounds_efficiency[rounds_efficiency_index] = memory_score;
            rounds_efficiency_index++;
            correct_count = 0;
            console.log(rounds_efficiency);
            resolve();
        },{ once: true });
    });
}

// ======= wait for next round button to be clicked=======
function waitforNextRound(){
    return new Promise((resolve) => {
        nextround_btn.addEventListener("click",function(){
            resolve();
        },{ once: true });
    });

}

// ======= Show score at the end of the round=======
function show_score(efficiency){
    return new Promise((resolve) =>{
        const score_box = document.getElementById("efficiency-percentage");
        score_box.textContent = `${Math.round(efficiency)}%`;         
        memory_score = 0;
        resolve();
    });
}

// =======To check for a specific question if a emoji exists in the emoji grid array=======
function is_it_there(emoji,emojiset_array){

    for (let i = 0;i<emojiset_array.length;i++){
        if (emoji === emojiset_array[i] ){
            return "✅";
        }
    }

    return "❌";
}

// =======generate a random choices with the answer inside it =======
function generate_choices(answer){
    let answer_index = getRandomInt(4);
    let choices = [];

    for (let i = 0;i<4;i++){
        if (i == answer_index){
            choices[i] = answer;
        }

        else{
            choices[i] = emojiSet[getRandomInt(emojiSet.length)];
        }
    }

    return choices;

}

// =======generate questions in an array=======
function generate_question(row,col,emojiset_array){
    let random_element = emojiSet[getRandomInt(emojiSet.length)];

    let random_row = getRandomInt(row);
    let random_col = getRandomInt(col);

    

    let random_question_index = getRandomInt(4);

    const questions = [
        {
            question: "What was in top-left?",
            answer: emojiset_array[0][0],
            options: generate_choices(emojiset_array[0][0])
        },
        {
            question: "What was in top-right?",
            answer: emojiset_array[0][col - 1],
            options: generate_choices(emojiset_array[0][col-1])
        },
        {
            question: `What was in row ${random_row + 1}, column ${random_col + 1}?`,
            answer: emojiset_array[random_row][random_col],
            options: generate_choices(emojiset_array[random_row][random_col])
        },

        {
            question: "What was in bottom-left?",
            answer: emojiset_array[row - 1][0],
            options: generate_choices(emojiset_array[row -1][0])
        },

        {
            question: "What was in bottom-right?",
            answer: emojiset_array[row - 1][col - 1],
            options: generate_choices(emojiset_array[row - 1][col - 1])
        },

        {
            question: `Was there a ${random_element}?`,
            answer: is_it_there(random_element,emojiset_array),
            options: ["✅","❌"]
        },

        {
            question: `What was in row ${random_row + 1}, column ${random_col + 1}?`,
            answer: emojiset_array[random_row ][random_col],
            options: generate_choices(emojiset_array[random_row][random_col])
        }

    ];

    let random_questions = [questions[random_question_index],questions[random_question_index + 1],questions[random_question_index + 2]];

    return random_questions;
}

// =======Show final result after 3 rounds finish=======
function show_final_result(){
    return new Promise((resolve) => {
        for (let i = 0;i<3;i++){
            document.getElementById(round_result_id[i]).textContent = `Round ${i+1} Effiency: ${Math.round(rounds_efficiency[i])}%`;
        } 

        document.getElementById("final_result").textContent = `Final Average: ${Math.round((rounds_efficiency[0]+rounds_efficiency[1] + rounds_efficiency[2])/3)}%`
        resolve();
    });
}

// =======Reset game so each round is a fresh new question and grid=======
function resethtml(){
    return new Promise((resolve) =>{
        timer_txt.textContent = "Are You Ready?";

        for (let i = 0;i<3;i++){
            let element = document.getElementById(`symbol-${i}`);
            if (element){
                element.remove();
            }
        }
        const symbols = document.querySelectorAll('.temp-option');
        symbols.forEach(el => el.remove());
        resolve();
    });
}

// =======GAME ORDER=======
async function game_rounds(col,row,emojiset_diff,grid,countdown){
    for (let i = 0;i<3;i++){
        document.getElementById("rounds").textContent = `Round ${i+1}`;
        await fadein(timer_txt);
        await fadein(grid);
        await set_grid_array(col,row,emojiset_diff);
        await delay(1000);
        await fill_grid(row,col,grid,emojiset_diff);
        await startcountdown(countdown);
        await empty_grid(grid);
        await fadeOutAndHide(grid);
        await fadeOutAndHide(timer_txt);
        await add_questions_to_page(row,col,emojiset_diff);
        await fadein(question_container);
        await waitforsubmit(submit_btn);
        await delay(2000);
        await fadeOutAndHide(question_container);
        await show_score(memory_score);
        await fadein(score_box);
        await waitforNextRound();
        await fadeOutAndHide(score_box);
        resethtml();
    }
    await fadeOutAndHide(game_grid);
    document.getElementById("rounds").textContent = "";
    await show_final_result();
    await fadein(score_result);

    console.log(rounds_efficiency);
}


// =======bUTTON INTERACTION=======
start_game_button.addEventListener('click', function(){
    welcome_screen.classList.add("remove");
    difficulty_screen.classList.add("active");
});

easy_difficulty_btn.addEventListener('click', function(){
    difficulty_screen.classList.remove("active");
    fadein(game_grid);
    game_rounds(2,2,emojiset_easy,easy_grid,5); 
});


normal_difficulty_btn.addEventListener('click', function(){
    difficulty_screen.classList.remove("active");
    fadein(game_grid);
    game_rounds(3,3,emojiset_normal,normal_grid,5); 
});

hard_difficulty_btn.addEventListener('click', function(){
    difficulty_screen.classList.remove("active");
    fadein(game_grid);
    game_rounds(4,4,emojiset_hard,hard_grid,5); 
});


function home() {
    location.reload();
  
}

// =======Refresh page event listeners=======
go_home.addEventListener("click",home);

go_home_2.addEventListener("click",home);



