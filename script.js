/* TODO: inserite il codice JavaScript necessario a completare il MHW! */

/*rimuove una box dalla lista chosen_boxes*/
function removeChoice(box){
    const indexToRemove = chosen_boxes.indexOf(box);
    chosen_boxes.splice(indexToRemove, 1);
    /*inserisco la box deselezionata nelle not_chosen e ripristino l'event listener*/
    not_chosen_boxes.push(box);
    box.addEventListener("click", onClick);

    /*cambio l'immagine della checkbox */
    box.querySelector(".checkbox").src = "images/unchecked.png";
}

/* aggiunge una box nella lista chosen_boxes */
function addChoice(choice){

    choice.classList.add('chosen');
    choice.classList.remove('not-chosen');

    for(let box of not_chosen_boxes){
        if(box == choice || box.dataset.questionId != choice.dataset.questionId){
            continue;
        }
        box.classList.remove("chosen");
        box.classList.add("not-chosen");
    }

    choice.removeEventListener("click", onClick);
    chosen_boxes.push(choice);
    
    /*rimuovo la scelta effettuata dalla lista not_chosen_boxes*/
    const indexToRemove = not_chosen_boxes.indexOf(choice);
    not_chosen_boxes.splice(indexToRemove, 1);

    /*cambio l'immagine della checkbox */
    choice.querySelector(".checkbox").src = "images/checked.png";
}

function theWinnerIs(result){
    let max = 0;
    let winner = "";

    for(personality in result){
        if(result[personality] > max){
            winner = personality;
            max = result[personality];
        }
    }
    return winner;
}

function showScore(){
    const result = {
        blep: 0,
        happy: 0,
        sleeping: 0,
        dopey: 0,
        burger: 0,
        cart: 0,
        nerd: 0,
        shy: 0,
        sleepy: 0,
    }

    for(let box of chosen_boxes){
        result[box.dataset.choiceId]++;
    }

    const winner = theWinnerIs(result);

    const title_result = document.querySelector("#result h1");
    const description_result = document.querySelector('#result p');
    title_result.textContent = RESULTS_MAP[winner].title;
    description_result.textContent = RESULTS_MAP[winner].contents;

    /* rimuovo la classe hidden dal risultato */
    document.getElementById("result").classList.remove("hidden");


}

function quizEnd(){

    let count = 0;
    for(let box of chosen_boxes){
        count++;
    }

    if(count == 3){
        return true;
    }

    return false;
}

function onClick(event){

    const choice = event.currentTarget;

    /*controllo se sono presenti altri box della stessa domanda in chosen_boxes*/
    for(let box of chosen_boxes){
        if (choice.dataset.questionId == box.dataset.questionId){
            removeChoice(box);
        }
    }

    /* Aggiungo la scelta alla lista chosen_boxes, aggiungo la classe "chosen" e rimuovo il listener */
    addChoice(choice);
    
    /*se sono sono presenti 3 box in chosen_boxes, termina il quiz (rimuove gli event listener ovunque e mostra il risultato)*/
    if (quizEnd()){
        for(let box of not_chosen_boxes){
            box.removeEventListener("click", onClick);
        }
        showScore();
    }
}

function quizSetup(){
    for (let box of boxes){
        box.addEventListener('click', onClick);
        not_chosen_boxes.push(box);
    }
    /* inserisco la classe hidden al risultato */
    document.getElementById("result").classList.add("hidden");
}

function restartQuiz(event){
    /* cambio l'immagine delle checkbox selezionate nel quiz precedente*/
    let box = undefined;
    for (box of chosen_boxes){
        box.querySelector(".checkbox").src = "images/unchecked.png";
        //elimino la classe chosen dai div
        box.classList.remove("chosen");
    }
    //elimino la classe not-chosen dai div
    for(box of not_chosen_boxes){
        box.classList.remove("not-chosen");
    }
    /*rimuovo tutto da chosen_boxes */
    chosen_boxes.splice(0, 3);
    //rimuovo tutto da not_chosen_boxes
    not_chosen_boxes.splice(0, 24);
    /*riparte il quiz */
    quizSetup();
}

/* --- --- MAIN --- --- */
const chosen_boxes = [];
const not_chosen_boxes = [];
const restartBtn = document.querySelector("#result div");
const boxes = document.querySelectorAll('.choice-grid div');
quizSetup();
restartBtn.addEventListener("click", restartQuiz);



