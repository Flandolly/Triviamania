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
            clearInterval(timerInterval)
        } else {
            timer.innerText = (parseFloat(timer.innerText) - 0.01).toFixed(2)
        }
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
 **** Choice Buttons
 ****************************/

{
    // Grabs choice buttons
    const choices = document.querySelectorAll(".choice-buttons")

    // Adds a click event for each button
    choices.forEach(choice => {
        //console.log(choice)
        choice.onclick = function () {
            clearInterval(timerInterval)
            clearInterval(colorInterval)
            console.log("Timers stopped.")
        }
    })
}