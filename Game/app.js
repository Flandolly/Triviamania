const openModalButton = document.getElementById("modalBtn")
const closeModalButton = document.getElementById("close")
const modal = document.getElementById("modal")

function openModal() {
    return modal.style.display = "block"
}

function closeModal() {
    return modal.style.display = "none"
}

openModalButton.addEventListener("click", openModal)
closeModalButton.addEventListener("click", closeModal)