export function showModal() {
    const modal = document.querySelector('#modal')
    const task = document.querySelector(`[task-id="${taskId}"]`)
    const taskText = task.querySelector('.task_text')
}

export function removeModal() {
    const modal = document.querySelector('#modal');

    if (modal) {
        modal.classList.remove('active')
        modal.innerHTML = ''
    }
}
