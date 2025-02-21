from flask import Blueprint
from controllers.TaskController import TaskController
from model.Database import Database

taskController = TaskController()
taskBp = Blueprint('tasks', __name__)

@taskBp.route("/")
def hello_world():
    return taskController.showTasks()

@taskBp.route('/add_task/', methods=['POST'])
def addTask():
    return taskController.insertTask()

@taskBp.route('/delete_task/', methods=['POST'])
def removeTask():
    return taskController.deleteTask()

@taskBp.route('/delete_tasks/', methods=['POST'])
def removeTasks():
    return taskController.deleteTasks()

@taskBp.route('/edit_task/', methods=['PUT'])
def editTask():
    return taskController.editTask()

@taskBp.route('/update_task/', methods=['PUT'])
def updateTask():
    return taskController.updateTask()

@taskBp.route('/filter_tasks/<string:filterValue>', methods=['GET'])
def filterTasks(filterValue):
    return taskController.filterTasks(filterValue)

@taskBp.teardown_request
def shutdownConnection(exception = None):
    db = Database()
    db.closeConnection()