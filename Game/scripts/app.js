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
    let timerStoppedAt = 0
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
        timerStoppedAt = document.getElementById("timer-number").innerText
        console.log("Timers stopped.")
        console.log(`Player locked in their answer at ${timerStoppedAt} seconds.`)

    }

    // Adds a click event for each button
    choices.forEach(choice => {
        choice.onclick = function () {
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
    // class Question {
    //     constructor(question, answer, category, choices) {
    //         this.question = question
    //         this.answer = answer
    //         this.choices = choices
    //         this.category = category
    //     }
    //
    //     getAnswer() {
    //         return this.answer
    //     }
    //
    //     getCategory() {
    //         return this.category
    //     }
    //
    //     getChoices() {
    //         return this.choices
    //     }
    //
    //     getQuestion() {
    //         return this.question
    //     }
    // }

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
                parseQuestionList(fileString)
            }
            reader.readAsText(fileList[0])
        })
        document.querySelector("header").append(file)
    }

    function parseQuestionList(input) {
        //Splits the input string into individual question strings
        const questionListArray = input.split("\r\n")
        const questionArray = []

        //Splits the question string into their individual attributes

        for (const question in questionListArray) {
            questionArray.push(questionListArray[question].split("/"))
        }
        console.log(questionArray)
    }

    loadQuestionList()

}