/****************************
 **** Global Variables
 ****************************/

const startButton = document.getElementById("start")
const choices = document.querySelectorAll(".choice-buttons")
const choice1 = document.getElementById("c1")
const choice2 = document.getElementById("c2")
const choice3 = document.getElementById("c3")
const choice4 = document.getElementById("c4")
const modal = document.getElementById("end-modal")
const endButton = document.getElementById("restart")
const score = document.getElementById("score")
const rnd = document.getElementById("round")
const pScore = document.getElementById("player-score")
const hScore = document.getElementById("high-score")
const question = document.getElementById("q-text")
const category = document.getElementById("category")
const timer = document.getElementById("timer-number")
const lockButton = document.getElementById("lock")
const questionText = document.getElementById("q-text")
const timeOver = document.getElementById("time-over")
const savedQuestions = localStorage.getItem("questionList")
const savedHighScore = localStorage.getItem("highScore")
const scoreChange = document.getElementById("score-change")
//const changeFile = document.createElement("button")


let time
let colorInterval
let runningTotal = 0
let fileString
let playedQuestions = []
let round = 1
let highScore = 0





/****************************
 ****  How To Play Modal
 ****************************/

{
    const openModalButton = document.getElementById("modalBtn")
    const closeModalButton = document.getElementById("close")
    const nextButton = document.getElementById("next")
    const prevButton = document.getElementById("prev")
    const modal = document.getElementById("modal")

    let pageIndex = 0

    function openModal() {
        return modal.style.display = "block"
    }

    function closeModal() {
        changePage("def")
        return modal.style.display = "none"
    }

    function changePage(buttonId) {
        const modalP1 = document.querySelector(".p1")
        const modalP2 = document.querySelector(".p2")
        const modalP3 = document.querySelector(".p3")

        switch (buttonId) {
            case "next":
                pageIndex++
                break
            case "prev":
                pageIndex--
                break
            default:
                pageIndex = 0
                break
        }

        switch (pageIndex) {
            case 0:
                nextButton.style.display = "inline-block"
                prevButton.style.display = "none"
                modalP1.style.display = "block"
                modalP2.style.display = "none"
                modalP3.style.display = "none"
                break
            case 1:
                prevButton.style.display = "inline-block"
                nextButton.style.display = "inline-block"
                modalP1.style.display = "none"
                modalP2.style.display = "inline-block"
                modalP3.style.display = "none"
                break
            case 2:
                prevButton.style.display = "inline-block"
                nextButton.style.display = "none"
                modalP1.style.display = "none"
                modalP2.style.display = "none"
                modalP3.style.display = "block"
                break
        }
    }

    openModalButton.addEventListener("click", function() {
        openModal()
    })
    closeModalButton.addEventListener("click", function() {
        closeModal()
    })
    nextButton.addEventListener("click", function() {
        changePage(nextButton.id)
    })
    prevButton.addEventListener("click", function() {
        changePage(prevButton.id)
    })
}


/****************************
 **** Start Game
 ****************************/

{

    startButton.onclick = function () {
        startButton.style.display = "none"
        showQuestion(getUnplayedQuestions())
        choices.forEach(choice => {
            choice.disabled = ""
            choice.style.cursor = "pointer"
        })
        startTimer()
    }
}

/****************************
 **** End Game (Modal)
 ****************************/

{
    function endGame() {

        modal.style.display = "block"
        pScore.innerText = `Your Score: ${runningTotal}`
        hScore.innerText = `High Score: ${setHighScore(runningTotal)}`

        endButton.onclick = function() {
            modal.style.display = "none"
            round = 1
            runningTotal = 0
            playedQuestions = []
            score.innerHTML = "Score: 0<span id=\"score-change\"></span>"
            rnd.innerText = "Round: 1"
            resetState()
            document.getElementById("start").style.display = "block"
            disableButtons()
            choices.forEach(choice => choice.innerText = "")
            question.innerText = ""
            category.innerText = ""
        }
    }

    function setHighScore(playerScore) {

        //JSON files for high score?!

        if (savedHighScore == null) {
            if (playerScore > highScore) {
                highScore = playerScore
                localStorage.setItem("highScore", highScore)
                return highScore
            } else {
                return localStorage.getItem("highScore")
            }
        } else {
            if (playerScore > parseInt(savedHighScore)) {
                highScore = playerScore
                localStorage.setItem("highScore", highScore)
                return highScore
            } else {
                return localStorage.getItem("highScore")
            }
        }
    }
}

/****************************
 **** Timer
 ****************************/

{

    timer.innerText = parseInt("30").toFixed(2)

    //Starts timer decrement interval

    function startTimer() {
        time = setInterval(decrementTimer, 10)
        colorInterval = setInterval(changeTextColor, 60)
    }


    //Decrements the question timer by 0.1 every 0.1 seconds.
    function decrementTimer() {
        if (parseFloat(timer.innerText) <= "0") {
            //Ends the timer interval when the timer hits 0
            generateTimeUp()
            disableButtons()
            clearInterval(time)
            clearInterval(colorInterval)
        } else {
            timer.innerText = (parseFloat(timer.innerText) - 0.01).toFixed(2)
        }
    }

    //Generates time out message
    function generateTimeUp() {

        timeOver.style.display = "block"

        setTimeout(function () {
            timeOver.style.display = "none"
        }, 5000)
        checkAnswer("Fail")
        if(round < 10) {
            setTimeout(startNewRound, 5000)
        } else {
            setTimeout(endGame, 5000)
        }
    }
    //Prevents buttons from registering clicks when the timer runs out
    function disableButtons() {

        choices.forEach(choice => {
            choice.setAttribute("disabled", "disabled")
            choice.style.onmouseover = ""
            choice.style.cursor = "not-allowed"
        })
        lockButton.setAttribute("disabled", "disabled")
        lockButton.style.cursor = "not-allowed"
    }

    {
        //Starts color change interval
        var red = 0
        var green = 255

        //Changes the color of the timer text from green to red as the timer decrements
        function changeTextColor() {

            if (red <= 255) {
                red++
            } else if (green >= 0) {
                green--
            }

            //Changed the text color
            timer.style.color = `rgb(${red},${green},0)`

            //Ends the color change when the color has fully reached red
            if (red === 255 && green === 0) {
                clearInterval(colorInterval)
            }
        }
    }
}

/****************************
 **** Choice Buttons + Lock
 ****************************/

{
    // Grabs choice buttons and lock button
    let userChoice = ""
    lockButton.setAttribute("disabled", "disabled")

    /*
        Disable button functionality inspired/sourced from:
        https://stackoverflow.com/questions/6199773/how-to-enable-disable-an-html-button-based-on-scenarios
    */

    // Stops the timers when user locks in their choice
    lockButton.onclick = function() {
        clearInterval(time)
        clearInterval(colorInterval)
        disableButtons()
        lockButton.disabled = "disabled"
        if (checkAnswer(document.querySelector(".clicked"))) {
            calculatePoints()
        } else {
            scoreChange.style.display = "inline"
            scoreChange.style.color = "black"
            scoreChange.innerText = "+0"
        }
        setTimeout(function() {
            document.getElementById("score-change").style.display = "none"
        }, 5000)
        if(round < 10) {
            setTimeout(startNewRound, 5000)
        } else {
            setTimeout(endGame, 5000)
        }
    }

    // Adds a click event for each button
    choices.forEach(choice => {
        choice.onclick = function () {
            if (document.querySelectorAll(".clicked").length >= 1) {
                choices.forEach(choice => {
                    choice.classList.remove("clicked")
                })
                choice.classList.add("clicked")
            } else {
                choice.classList.add("clicked")
            }
            lockButton.disabled = ""
            lockButton.style.cursor = "pointer"
            userChoice = choice.id
        }
    })
}

/****************************
 **** Questions
 ****************************/

{
    class Question {
        constructor(question, answer, category, choices = []) {
            this.question = question
            this.answer = answer
            this.choices = choices
            this.category = category
        }

        getCategory() {
            return this.category
        }

        getChoices() {
            return this.choices
        }

        getQuestion() {
            return this.question
        }
    }

    class QuestionList {
        constructor() {
            this.questions = []
        }

        /*
        Sourced from: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
         */

        // shuffle(qList) {
        //     for (let i = 0; i < qList.length; i++) {
        //         const j = Math.floor(Math.random() * (i+1))
        //         qList[i], qList[j] = qList[j], qList[i]
        //     }
        // }
    }

    const qList = new QuestionList()

    function loadQuestionList() {
        if (savedQuestions != null) {
            document.getElementById("q-title").style.display = "none"
            startButton.disabled = ""
            parseQuestionList(savedQuestions)
        } else {
            const file = document.createElement("input")
            file.id = "question-list"
            file.setAttribute("type", "file")
            file.setAttribute("accept", ".txt")

            /*
            Sourced from: https://www.geeksforgeeks.org/how-to-read-a-local-text-file-using-javascript/
             */

            file.addEventListener("change", function(event) {
                const fileList = event.target.files
                const reader = new FileReader()
                reader.onload = function() {
                    fileString = reader.result
                    document.getElementById("q-title").style.display = "none"
                    localStorage.setItem("questionList", fileString)
                    parseQuestionList(fileString)
                    document.getElementById("start").disabled = ""
                    file.style.display = "none"
                }
                reader.readAsText(fileList[0])
            })
            document.querySelector("header").append(file)
        }
    }

    function parseQuestionList(input) {
        //Splits the input string into individual question strings
        const questionListArray = input.split("\r\n")

        for(const question of questionListArray){
            //Splits the question string into their individual attributes
            const questionArr = question.split(",")
            qList.questions.push(new Question(questionArr[0], questionArr[6], questionArr[1], questionArr.slice(2,6)))
        }
        return qList.questions
    }

    function getUnplayedQuestions() {
        /*
        Sourced from: https://stackoverflow.com/questions/50648091/check-the-difference-between-two-arrays-of-objects-in-javascript
         */

        return qList.questions.filter(question1 => !playedQuestions.some(question2 => question2.question === question1.question))
    }

    function showQuestion(questionList) {
        //Grabbing all the necessary question and choice elements

        const randomNum = Math.floor(Math.random() * questionList.length)

        questionText.innerHTML = questionList[randomNum].getQuestion()
        category.innerText = questionList[randomNum].getCategory()
        choice1.innerText = questionList[randomNum].getChoices()[0]
        choice2.innerText = questionList[randomNum].getChoices()[1]
        choice3.innerText = questionList[randomNum].getChoices()[2]
        choice4.innerText = questionList[randomNum].getChoices()[3]
        choice1.setAttribute("name", `${questionList[randomNum].getChoices()[0]}`)
        choice2.setAttribute("name", `${questionList[randomNum].getChoices()[1]}`)
        choice3.setAttribute("name", `${questionList[randomNum].getChoices()[2]}`)
        choice4.setAttribute("name", `${questionList[randomNum].getChoices()[3]}`)

        playedQuestions.push(questionList[randomNum])

    }

    function checkAnswer(playerChoice) {

        const choices = document.querySelectorAll(".choice-buttons")
        const foundQuestion = qList.questions.find(element => {
            return element.question === document.getElementById("q-text").innerHTML;
        })

        if (typeof playerChoice !== "object") {
            for (const choice of choices) {
                if (choice.getAttribute("name") === foundQuestion.answer) {
                    choice.classList.add("correct")
                }
            }
            return false
        }

        if (playerChoice.innerText === foundQuestion.answer) {
            playerChoice.classList.add("correct")
            return true
        } else {
            playerChoice.classList.add("wrong")
            for (const choice of choices) {
                if (choice.getAttribute("name") === foundQuestion.answer) {
                    choice.classList.add("correct")
                }
            }
            return false
        }
    }

    function calculatePoints() {
        const timerStopped = document.getElementById("timer-number").innerText
        const base = 300
        const multiplier = 50
        const total = base + (parseInt(timerStopped) * multiplier)

        runningTotal += total
        scoreChange.innerText = `+${total}`
        score.innerHTML = `Score: ${runningTotal}<span id="score-change">${scoreChange.innerText}</span>`
        scoreChange.style.display = "inline"
        scoreChange.style.color = "limegreen"
    }


}

/****************************
 **** Rounds
 ****************************/

{


    function startNewRound() {
        round++
        resetState()
        document.getElementById("round").innerText = `Round: ${round}`
        showQuestion(getUnplayedQuestions())
        startTimer()
    }

    function resetState() {
        const choices = document.querySelectorAll(".choice-buttons")
        const timer = document.getElementById("timer-number")


        choices.forEach(choice => {
            choice.classList.remove("correct")
            choice.classList.remove("wrong")
            choice.classList.remove("clicked")
            choice.disabled = ""
            choice.style.cursor = "pointer"
        })

        timer.innerText = parseInt("30").toFixed(2)
        red = 0
        green = 255
    }
}


loadQuestionList()