import { removeModal } from "../helpers.js"

const modalEl = document.querySelector('#modal')

export function editModal(taskId) {
    const task = document.querySelector(`[task-id="${taskId}"]`)
    const taskText = task.querySelector('.task_text')
    
    const editModalEl = `
        <div id="overlay"></div>

        <form id="modal_content" class='edit_form'>
            <span id="close">
                <ion-icon name="close-outline"></ion-icon>
            </span>
            <div id="input_wrapper">
                <label for="edit_task">Edit task:</label> 
                <input type="text" placeholder="Edit task..." id="edit_task">
            </div>
        </form>
    `

    modalEl.classList.add('active')
    modalEl.insertAdjacentHTML('beforeend', editModalEl)

    const editForm = document.querySelector('.edit_form')
    const closeModalEl = document.querySelector('#close') 

    editForm.addEventListener('submit', async(event) => {
        event.preventDefault()

        const editInput = document.querySelector('#edit_task').value

        if (editInput.trim() !== '') {
            const response = await fetch('/edit_task/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'taskId': taskId,
                    'newContent': editInput
                })
            })

            if (response) {
                taskText.innerText = editInput
                removeModal()
            }
        } else {
            console.error('Network error while trying to fetch.')
        }
    })

    closeModalEl.addEventListener('click', removeModal)
} 


export function decisionModal(taskId) {
    const task = document.querySelector(`[task-id="${taskId}"]`)
    const taskText = task.querySelector('.task_text')

    const decisionModalEl = `
        <div id="overlay"></div>

        <section id="modal_content">
            <span id="close">
                <ion-icon name="close-outline"></ion-icon>
            </span>

            <p>Delete this task?</p>

            <div id="buttons">
                <button id="yes">
                    <ion-icon name="checkmark-outline"></ion-icon>
                    Yes
                </button>

                <button id="no">
                    <ion-icon name="close-outline"></ion-icon>
                    No
                </button>
            </div>
        </section>
    `

    modalEl.classList.add('active')
    modalEl.insertAdjacentHTML('beforeend', decisionModalEl)

    const noBtn = document.querySelector('#no')
    const yesBtn = document.querySelector('#yes')
    const closeModal = document.querySelector('#close')

    noBtn.addEventListener('click', removeModal)
    yesBtn.addEventListener('click', async() => {
        const response = await fetch('/delete_task/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'taskId': taskId
            })
        })   

        const result = await response.text()

        if (result) {
            task.remove()
            removeModal()
        }
    })

    closeModal.addEventListener('click', removeModal)
} 