class Task:
    def returnTask(self, taskId, taskContent, taskDone): 
        return f"""
                    <div class="task" task-id="{taskId}">
                        <div class="task_content">
                            <input type="checkbox" class="complete_task">

                            <p class="task_text">
                                {taskContent}
                            </p>
                        </div>

                        <span class="options">
                            <ion-icon name="settings-outline"></ion-icon>
                        </span>
                    </div>
                """