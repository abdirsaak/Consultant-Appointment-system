from app import app
from .modols.Admin_db import Admin
from .modols.teachers_db import Teachers
# from .users_db import Users
from .users_db import Database
from flask import Flask , json, jsonify,request,session
from flask_bcrypt import Bcrypt
bcrypt = Bcrypt()

from app.My_configration import MyConfiguration

my_configuration = MyConfiguration()
def check_connection():
    try:
        mysql_connect = Database(
            host=my_configuration.DB_HOSTNAME,
            port=3306,
            user=my_configuration.DB_USERNAME,
            password=my_configuration.DB_PASSWORD,
            database=my_configuration.DB_NAME
        )
        # Create an instance of the Store class
        mysql_connect.make_connection()
        trainee = Admin(mysql_connect.connection)

        return True, trainee
    except Exception as e:
        print(f'')
        return False, f'Error: {e}.'


app.config["SECRET_KEY"] = "abdi@12"





def encryptpass(password: str, key: bytes) -> str:
    # Create a Fernet object with the given key
    f = Fernet(key)
    # Encrypt the password
    encrypted_password = f.encrypt(password.encode())
    return encrypted_password.decode()



# @app.route('/register-admin', methods=['POST'])
# def registerAddmin():
        
#         connection_status, admin = check_connection()
#         admin_name = request.json.get('admin_name')
#         admin_email = request.json.get('admin_email')
#         admin_password = request.json.get('admin_password')
#         print(f'admin_name: {admin_name}, admin_email: {admin_email} admin_password: {admin_password}')
#         password_to_hash= bcrypt.generate_password_hash(admin_password).decode('utf-8')
#         regisert_admin = admin.register_admin(admin_name,admin_email,password_to_hash)
        
#         if regisert_admin:
#             return jsonify({"status": "success", "message": "registered admin success"})
#         else:
#             return jsonify({"message": "failed", "message": "something went wrong"})
@app.route('/register-admin', methods=['POST'])
def registerAddmin():
        
    try:
        # Check the database connection
        connection_status, admin = check_connection()
        if not connection_status:
            return jsonify({"status": "failed", "message": "Database connection failed"}), 500

        # Get JSON data from request
        admin_name = request.json.get('admin_name')
        admin_email = request.json.get('admin_email')
        admin_password = request.json.get('admin_password')

        # Debugging output
        print(f'admin_name: {admin_name}, admin_email: {admin_email}, admin_password: {admin_password}')

        if not admin_name or not admin_email or not admin_password:
            return jsonify({"status": "failed", "message": "Missing required fields"}), 400

        # Hash the password
        password_to_hash = bcrypt.generate_password_hash(admin_password).decode('utf-8')

        # Register admin
        regisert_admin = admin.register_admin(admin_name, admin_email, password_to_hash)

        if regisert_admin:
            return jsonify({"status": "success", "message": "Registered admin successfully"}), 201
        else:
            return jsonify({"status": "failed", "message": "Registration failed"}), 500

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"status": "failed", "message": "Internal server error"}), 500

@app.route("/display-admins/<int:id>", methods = ["GET"])
def displayAdmins(id):
    try:
        connection_status, admin = check_connection()
        admin_id = id
        get_admins = admin.display_admin(admin_id)
        admin_ = []

        if get_admins:
            for i in get_admins:
                admin_.append({
                    "admin_id": i[0],
                    "admin_name": i[1],
                    "admin_email": i[2],
                    "admin_password": i[3],
                })
            return admin_
            

        else:
            return jsonify({"status": "falied", "message":"no admin"})


    except Exception as e:
        print(f"error display admins views: {e}")



@app.route("/total-male-teacher", methods = ["GET"])
def total_male_teacher():
    try:
        connection_status, admin = check_connection()
    
        x = session.get("user_id")
        print(f"userka: {x}")

        get_total_male_teacher = admin.get_total_male_teacher()
        return get_total_male_teacher
        # return jsonify({"status": "succes", "message": "all female teacher", "data": get_total_female_teacher})
    except Exception as e:
        print(f"error total female teacher views: {e}")
        return "errror"

# ...... total female teachers
@app.route("/total-female-teacher", methods = ["GET"])
def total_female_teacher():
    try:
        connection_status, admin = check_connection()
        get_total_female_teacher = admin.get_total_female_teacher()
        # return jsonify({"status": "succes", "message": "all female teacher", "data": get_total_female_teacher})
        return get_total_female_teacher
    except Exception as e:
        print(f"error total female teacher views: {e}")
        return "errror"
    
    # ..... total female users
@app.route("/total-female-users", methods = ["GET"])
def total_female_users():
    try:
        connection_status, admin = check_connection()
        get_total_female_users = admin.get_total_female_users()
        # return jsonify({"status": "succes", "message": "all female users", "data": get_total_female_teacher})
        return get_total_female_users
    except Exception as e:
        print(f"error total female users views: {e}")
        return "errror"
    

    # ..... total male users
@app.route("/total-male-users", methods = ["GET"])
def total_male_users():
    try:
        connection_status, admin = check_connection()
        get_total_male_users = admin.get_total_male_users()
        return get_total_male_users
        # return jsonify({"status": "succes", "message": "all female users", "data": get_total_female_teacher})
    except Exception as e:
        print(f"error total female users views: {e}")
        return "errror"
    



    # ...... update admin username

@app.route("/update-admin-username/<int:id>", methods = ["PUT"])
def update_admin_username(id):
    try:
        connection_status, admin = check_connection()
        admin_name = request.json.get("admin_name")
        admin_id = id
        if not admin_name:
            return jsonify({"message": "fadlan buuxi meelaha banaan"})
        update_admin = admin.update_admin_username(admin_name,admin_id)
        if update_admin:
            return jsonify({"status": "success", "message": "si saxan ayad u badashay magaacag"})
        
        else:
            return jsonify({"status": "failed", "message": "qalad aya dhacay"})
    except Exception as e:
        print(f"error views updating admin username: {e}")

@app.route("/update-admin-email/<int:id>", methods = ["PUT"])
def update_admin_email(id):
    try:
        connection_status, admin = check_connection()
        admin_email = request.json.get("admin_email")
        admin_id = id
        if not admin_email:
            return jsonify({"message": "fadlan buuxi meelaha banaan"})
        update_admin = admin.update_admin_email(admin_email,admin_id)
        if update_admin:
            return jsonify({"status": "success", "message": "si saxan ayad u badashay email-ka"})
        
        else:
            return jsonify({"status": "failed", "message": "qalad aya dhacay, mar kale ku celi"})
    except Exception as e:
        print(f"error views updating admin email: {e}")




# .... update admin password
@app.route("/update-admin-password/<int:id>", methods = ["PUT"])
def update_admin_password(id):
    connection_status, admin = check_connection()
    print("i am in update password function")
    admin_id = id
    old_password = request.json.get("password")
    new_password = request.json.get("new_password")
    if not old_password or not new_password:
        return jsonify({"message": "buuxi meelaha banaan fadlan"})
    
    validate_password = admin.validate_password(admin_id, old_password)
    print(f"validate_password views: {validate_password}")
    if validate_password:
        # change passowrd into hash
        password_to_hash= bcrypt.generate_password_hash(new_password).decode('utf-8')
        print(f"before hash passowrd: {new_password}")
        print(f"after hash passowrd: {password_to_hash}")
        update_password = admin.update_password(admin_id, password_to_hash)
        print(f"update_password views: {update_password}")
        return jsonify({"status": "success", "message": "si saxan ayad u badashay"}) , 200
    else:
        return jsonify({"status": "failed", "message": "password-ka hore waa qalad"})

