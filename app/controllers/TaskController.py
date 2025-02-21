from flask import render_template, request, jsonify
from model.Database import Database
from model.Task import Task

class TaskController:
    def __init__(self):
        self.dbInstance = Database()
        self.task = Task()

    def showTasks(self):
        tasks = self.dbInstance.returnTasks()
        
        return render_template('index.html', tasks = tasks, title = 'TodoApp')
    
    def insertTask(self):
        data = request.get_json(silent = True)

        taskContent = data.get('taskContent')
        taskDate = data.get('taskDate')
        taskDone = data.get('taskDone')

        insertedId = self.dbInstance.createTask({
            'taskContent': taskContent,
            'taskDate': taskDate,
            'taskDone': taskDone
        })

        return self.task.returnTask(insertedId, taskContent, taskDone)
    
    def deleteTask(self):
        data = request.get_json(silent = True)
        
        id = data.get('taskId')
        result = self.dbInstance.dropTask(id)
        
        return str(result)
    
    def deleteTasks(self):
        result = self.dbInstance.dropTasks()

        return str(result)

    def editTask(self): 
        data = request.get_json(silent = True)
        
        id = data.get('taskId')
        newContent = data.get('newContent')
        result = self.dbInstance.editTaskContent(id, newContent)
        
        return str(result), 200
    
    def updateTask(self):
        data = request.get_json(silent = True)
        
        id = data.get('taskId')
        taskDone = data.get('done')
        result = self.dbInstance.modifyTask(id, taskDone)
        
        return str(result), 200
        
    def filterTasks(self, filter):
        query = {}
        
        if filter == 'completed': 
            query = {'taskDone': True}
        elif filter == 'pending':
            query = {'taskDone': False}

        print(query)
        
        tasks = list(self.dbInstance.filterTask(query))

        return tasks
            