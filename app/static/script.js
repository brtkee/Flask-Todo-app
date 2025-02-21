import { editModal, decisionModal } from "./components/Modals.js"
import { optionsContainer } from "./components/OptionsContainer.js"
import { renderTask } from "./components/Task.js"

const tasksContainer = document.querySelector('#todo_card_content')
const tabsContainer = document.querySelector('#tabs')
const form = document.querySelector('#todo_input_wrapper')
const clearAllBtn = document.querySelector('#clear_all')

tasksContainer.addEventListener('click', async (event) => {
    if (event.target.closest('.options')) {
        const optionEl = event.target.closest('.options')

        if (!tasksContainer.contains(document.querySelector('.options_container'))) {
            const taskId = optionEl.parentElement.getAttribute('task-id')
            console.assert(taskId, 'Task Id must be present.')

            optionEl.insertAdjacentHTML('beforeend', optionsContainer)

            const editTask = document.querySelector('#edit_task')
            const deleteTask = document.querySelector('#delete_task')
        
            editTask.addEventListener('click', () => {
                editModal(taskId)
            })
        
            deleteTask.addEventListener('click', () => {
                decisionModal(taskId)
            })
        } else {
            document.querySelector('.options_container').remove()
        }
    }

    if (event.target.closest('.complete_task')) {
        const taskEl = event.target.closest('.complete_task')
        const parentEl = taskEl.parentElement

        const taskText = parentEl.querySelector('.task_text')
        const taskId = parentEl.parentElement.getAttribute('task-id');

        let taskChecked = taskEl.checked

        taskText.classList.toggle('striked')

        const response = await fetch(`/update_task/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                'taskId': taskId,
                'done': taskChecked
            })
        })
    }
})

form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const insertTask = document.querySelector('#insert_task')

    if (insertTask.value.trim() !== '') {
        insertTask.blur()
        setTimeout(async() => {
            let date = new Date()
        
            const response = await fetch(`/add_task/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    'taskContent': insertTask.value,
                    'taskDone': false,
                    'taskDate': date.toLocaleString()
                })
            })
        
            const result = await response.text()
        
            if (result) {
                tasksContainer.innerHTML += result
                insertTask.value = ''
            }
        }, 250)
    }

})

tabsContainer.addEventListener('click', async(event) => {
    if (event.target.className === 'tab_item') {
        const tab = event.target
        const currentTab = tabsContainer.querySelector('.current')
        currentTab.classList.remove('current')
        tab.classList.add('current')

        const tabFilter = tab.getAttribute('data-filter')
        const possibleFilters = ['all', 'pending', 'completed']

        console.assert(tabFilter, 'tab filter must exist')

        if (possibleFilters.includes(tabFilter)) {
            const response = await fetch(`/filter_tasks/${tabFilter}`, {
                method: "GET",
            });
    
            const result = await response.json(); 
    
            console.log(result)
    
            if (Array.isArray(result)) {
                tasksContainer.innerHTML = ''
    
                for (let i = 0; i < result.length; i++) {
                    let taskId = result[i]['_id']
                    let taskContent = result[i]['taskContent']
                    tasksContainer.innerHTML += renderTask(taskId, taskContent)
                }
            }
        }
    }
})

clearAllBtn.addEventListener('click', async() => {
    console.assert(document.querySelector('.task'), 'Tasks must exist, to remove them.')

    const response = await fetch(`/delete_tasks/`, {
        method: "POST",
    });

    let result = await response.text()
    result = new Boolean(result)

    if (result) {
        const tasks = document.querySelectorAll('.task')

        tasks.forEach(task => {
            task.remove()
        })
    }
})