import os
from dotenv import load_dotenv
from pymongo import MongoClient
from flask import jsonify
from bson import ObjectId

class Database:
    def __init__(self):
        load_dotenv()
        self.__client = None
        self.__database = None 
        self.__collection = None
        self.connectionStatus = self.establishConnection(os.getenv('DB_PASSWORD'))
        
    def establishConnection(self, db_password):
        try:
            self.__client = MongoClient(f'mongodb+srv://root:{db_password}@cluster0.wypqs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
            self.__database = self.__client['todoapp']
            self.__collection = self.__database['todoapp']

            return True
        except ConnectionError as err:
            print(f'Couln`t connect with database, error: {err}')

            return False

    def returnTasks(self):
        return list(self.__collection.find())
    
    def createTask(self, taskJson):
        inserted = self.__collection.insert_one(taskJson)

        return str(inserted.inserted_id)

    def dropTask(self, taskId):
        result = self.__collection.delete_one({'_id': ObjectId(taskId)})

        return result.deleted_count > 0
    
    def dropTasks(self):
        result = self.__collection.delete_many({})

        return result.deleted_count > 0
        
    def editTaskContent(self, taskId, newContent):
        result = self.__collection.update_one({'_id': ObjectId(taskId)}, {'$set': {'taskContent': newContent}})

        return result.modified_count > 0
    
    def modifyTask(self, id, taskDone):
        result = self.__collection.update_one({'_id': ObjectId(id)}, {'$set': {'taskDone': taskDone}})

        return result.modified_count > 0
    
    def filterTask(self, query):
        result = self.__collection.find(query)  

        tasks = list(result) 

        for task in tasks:
            task['_id'] = str(task['_id'])

        return tasks

    def closeConnection(self):
        if self.__client is not None:
            self.__client.close()
            self.__client = None