from flask import Flask
from flask_cors import CORS 


app = Flask(__name__)
app.config["SECRET_KEY"] = "abdi@12"
CORS(app)


from app import users_db
from app import register_views
from app import schedule
from app import teacher
from app import appoinements
from app import admin
from app import My_configration
# from My_configration import MyConfiguration

from app import login
from .modols import schedule_db
from .modols import teachers_db
from .modols import appointments_db
from .modols import Admin_db
