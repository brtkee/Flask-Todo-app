import os
from dotenv import load_dotenv
from flask import Flask
from blueprints.tasks import taskBp

app = Flask(
    __name__, 
    template_folder='./view/', 
    static_folder='./static/'
)

app.register_blueprint(taskBp)

if __name__ == '__main__':
    load_dotenv()
    debugMode = os.getenv('DEBUG_MODE', False).lower() in ('true', '1')

    app.run(debug=debugMode) 