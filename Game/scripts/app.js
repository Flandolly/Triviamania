// noinspection ES6ConvertVarToLetConst

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
        // changePage("def")
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
 **** Timer
 ****************************/

{
    const timer = document.getElementById("timer-number")

    timer.innerText = parseInt("30").toFixed(2)

    //Starts timer decrement interval
    var timerInterval = setInterval(decrementTimer, 10)

    //Decrements the question timer by 0.1 every 0.1 seconds.
    function decrementTimer() {
        if (parseFloat(timer.innerText) <= "0") {
            //Ends the timer interval when the timer hits 0
            generateTimeUp()
            disableButtons()
            clearInterval(timerInterval)
        } else {
            timer.innerText = (parseFloat(timer.innerText) - 0.01).toFixed(2)
        }
    }

    //Generates time out message
    function generateTimeUp() {
        const timeOver = document.createElement("p")
        timeOver.innerText = "Time's Up!"
        timeOver.classList.add("question-text")
        timeOver.id = "time-over"
        timeOver.style.color = "red"

        document.getElementById("main-body").append(timeOver)
    }
    //Prevents choice buttons from registering clicks when the timer runs out
    function disableButtons() {
        const choices = document.querySelectorAll(".choice-buttons")
        choices.forEach(choice => {
            choice.setAttribute("disabled", "disabled")
            choice.style.onmouseover = ""
            choice.style.cursor = "not-allowed"
        })
    }

    {
        //Starts color change interval
        var colorInterval = setInterval(changeTextColor, 60)
        let red = 0
        let green = 255

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
    const choices = document.querySelectorAll(".choice-buttons")
    const lockButton = document.getElementById("lock")
    let userChoice = ""
    lockButton.setAttribute("disabled", "disabled")

    /*
        Disable button functionality inspired/sourced from:
        https://stackoverflow.com/questions/6199773/how-to-enable-disable-an-html-button-based-on-scenarios
    */

    // Stops the timers when user locks in their choice
    lockButton.onclick = function() {
        clearInterval(timerInterval)
        clearInterval(colorInterval)
        choices.forEach(choice => {
            choice.setAttribute("disabled", "disabled")
            choice.style.onmouseover = ""
            choice.style.cursor = "not-allowed"
        })
        if (checkAnswer(document.querySelector(".clicked"))) {
            calculatePoints()
        } else {
            document.getElementById("score-change").style.color = "black"
            document.getElementById("score-change").innerText = "+0"
        }
        //console.log("Timers stopped.")
        //console.log(`Player locked in their answer at ${timerStoppedAt} seconds.`)

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
            userChoice = choice.id
            console.log(`Button ${userChoice} clicked.`)
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

        getAnswer() {
            return this.answer
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

        getQuestionList() {
            return this.questions
        }
    }

    var qList = new QuestionList()
    let runningTotal = 0

    function loadQuestionList() {
        const file = document.createElement("input")
        let fileString = ""
        file.id = "question-list"
        file.setAttribute("type", "file")

        /*
        Sourced from: https://www.geeksforgeeks.org/how-to-read-a-local-text-file-using-javascript/
         */

        file.addEventListener("change", function(event) {
            const fileList = event.target.files
            const reader = new FileReader()
            reader.onload = function() {
                fileString = reader.result
                document.getElementById("q-title").style.display = "none"
                showQuestion(parseQuestionList(fileString))
            }
            reader.readAsText(fileList[0])
        })
        document.querySelector("header").append(file)
    }

    function parseQuestionList(input) {
        //Splits the input string into individual question strings
        const questionListArray = input.split("\r\n")
        //const questions = []
        for(const question of questionListArray){
            //Splits the question string into their individual attributes
            const questionArr = question.split("/")
            qList.questions.push(new Question(questionArr[0], questionArr[6], questionArr[1], questionArr.slice(2,6)))
        }
        return qList.questions
    }

    function showQuestion(questionList) {
        //Grabbing all the necessary question and choice elements
        const questionText = document.getElementById("q-text")
        const category = document.getElementById("category")
        const choice1 = document.getElementById("c1")
        const choice2 = document.getElementById("c2")
        const choice3 = document.getElementById("c3")
        const choice4 = document.getElementById("c4")

        const randomNum = Math.floor(Math.random() * questionList.length)

        questionText.innerText = questionList[randomNum].getQuestion()
        category.innerText = questionList[randomNum].getCategory()
        choice1.innerText = questionList[randomNum].getChoices()[0]
        choice2.innerText = questionList[randomNum].getChoices()[1]
        choice3.innerText = questionList[randomNum].getChoices()[2]
        choice4.innerText = questionList[randomNum].getChoices()[3]
        choice1.setAttribute("name", `${questionList[randomNum].getChoices()[0]}`)
        choice2.setAttribute("name", `${questionList[randomNum].getChoices()[1]}`)
        choice3.setAttribute("name", `${questionList[randomNum].getChoices()[2]}`)
        choice4.setAttribute("name", `${questionList[randomNum].getChoices()[3]}`)

    }

    function checkAnswer(playerChoice) {

        const choices = document.querySelectorAll(".choice-buttons")
        const foundQuestion = qList.questions.find(element => {
            return element.question === document.getElementById("q-text").innerText;
        })

        if (playerChoice.innerText === foundQuestion.answer) {
            console.log("Player got the right answer!")
            playerChoice.classList.add("correct")
            return true
        } else {
            console.log("Player got the wrong answer!")
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
        const score = document.getElementById("score")
        const scoreChange = document.getElementById("score-change")
        const base = 300
        const multiplier = 50
        const total = base + (parseInt(timerStopped) * multiplier)

        runningTotal += total
        score.innerText = `Score: ${runningTotal}`
        scoreChange.innerText = `+${total}`
    }


    loadQuestionList()
}