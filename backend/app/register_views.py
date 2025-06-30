from app import app
from flask import Flask, request, jsonify, session
from .users_db import Database, Users
from app.My_configration import MyConfiguration
from flask_bcrypt import Bcrypt
bcrypt = Bcrypt()


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
        trainee = Users(mysql_connect.connection)

        return True, trainee
    except Exception as e:
        print(f'')
        return False, f'Error: {e}.'


app.config["SECRET_KEY"] = "abdi@12"


# ........... hash passowrd fucntion
def encryptpass(password: str, key: bytes) -> str:
    # Create a Fernet object with the given key
    f = Fernet(key)
    # Encrypt the password
    encrypted_password = f.encrypt(password.encode())
    return encrypted_password.decode()

# ..... register api
@app.route('/register', methods=['POST'])
def register():
        connection_status, user = check_connection()
        
 
        username = request.json.get('username')
        password = request.json.get('password')
        email = request.json.get('email')
        gender = request.json.get('gender')
        validate_user = user.validate_user(email)
        print(f"username{username}")
        print(f"password {password}")
        print(f"email {email}")
        print(f"gender {gender}")
        if validate_user:
            return  jsonify({"status": "error", "message": "emailkani horey aya loo qaatay"})
        else:
            # change passowrd into hash
            password_to_hash= bcrypt.generate_password_hash(password).decode('utf-8')
            print(f"before hash passowrd: {password}")
            print(f"after hash passowrd: {password_to_hash}")

            insert_user  =user.register_user(username,email,password_to_hash,gender)
            print(f"created user succefuly: {insert_user}")
            return jsonify({"status": "success", "message": "si saxan ayad isku diiwan galisay"}) , 200



@app.route("/display-students/<int:std_id>", methods = ["GET"])
def displayStudents(std_id):
    try:
        connection_status, user = check_connection()
        std_id = std_id
        display_students = user.display_Students(std_id) 
        print(f"all teachers oky: {display_students}")
        students_dic = []

        for i in display_students:
            students_dic.append({
                "id": i[0],
                "name": i[1],
                "email": i[2],
                "password": i[3],
                'sex':i[4]
            })
        print(f"all teachers: {students_dic}")

        if students_dic:
            return jsonify({"status": "success", "message": "succefuly get studnets", "data": students_dic})
        else:
            return jsonify({"status": "fail", "message": "failed to get students"})
        
        

    except Exception as e:
        print(f"error views display teachers: {e}")
        return jsonify({"status": "error", "message": "error to delete teacher"})




# ........... updateUsername api
@app.route("/update-username/<int:id>", methods = ["PUT"])
def update_username(id):
    print("i am in update username function")
    connection_status, user = check_connection()
   
    user_id = id
    old_username = request.json.get("old_username")
    username = request.json.get("username")
    if not old_username or not username:
        return jsonify({"message": "buuxi meealaha banaan"})
    validate_username = user.validat_username(user_id, old_username)
    print(f"update_username variabel: {validate_username}")
    if validate_username:
        update_username_ = user.update_username(user_id, username)
        if update_username:
            
            print(f"update_username views: {update_username_}")
            return jsonify({"status": "success", "message": "si saxan ayad u badashay magacaaga"}) , 200
        else:
            return jsonify({"status": "fail", "message": "qalad aya dhacay, mar kale ku celi"})

    else:
        return jsonify({"status": "fail","message": "magacaaga hore waa qalad"})



# ........... updateEmail api
@app.route("/update-user-email/<int:id>", methods = ["PUT"])
def update_email(id):
    print("i am in update email function")
    connection_status, user = check_connection()
   
    user_id = id
    old_email  =request.json.get("old_email")
    email = request.json.get("email")
    if not email or not old_email:
        return jsonify({"message": "buuxi meelaha banaan"})
    
    validate_email = user.validate_user(old_email)
    if validate_email:
        
        update_email_ = user.update_email(user_id, email)
        print(f"updated email succes: {update_email_}")
        if update_email_:
            
            return jsonify({"status": "success", "message": "update email succes"}) , 200
        else:
            return jsonify({"status":"fail", "message":"qalad aya dhacay ,marka kale ku celi "})
    else:
        return jsonify({"status": "fail", "message": "email-kaaga hore waa qalad."})
  
    



# update_passowrd api
@app.route("/update-user-password/<int:id>", methods = ["PUT"])
def update_password(id):
    print("i am in update password function")
    connection_status, user = check_connection()
    user_id = id
    old_password = request.json.get("old_password")
    new_password = request.json.get("new_password")
    if not old_password or not new_password:
        return jsonify({"message": "buuxi meelaha banaan"})
    
    validate_password = user.validate_password(user_id, old_password)
    print(f"validate_password views: {validate_password}")
    if validate_password:
        # change passowrd into hash
        password_to_hash= bcrypt.generate_password_hash(new_password).decode('utf-8')
        print(f"before hash passowrd: {new_password}")
        print(f"after hash passowrd: {password_to_hash}")
        update_password = user.update_password(user_id, password_to_hash)
        print(f"update_password views: {update_password}")

        if update_password:

            return jsonify({"status": "success", "message": "si saxan ayad ubadashay password-ka"}) , 200
        else:
            return jsonify({"status": "fail", "message": "qalad aya dhacay"})
    else:
        return jsonify({"status": "fail", "message": "passwor-kaga hore waa qalad"})
    




@app.route("/update-student-gender/<int:id>", methods =["PUT"])
def update_student_gender(id):
    try:
        connection_status, user = check_connection()
        student_id = id
        student_gender = request.json.get("student_gender")
   
        update_gender = user.update_gender(student_id,student_gender)
        if update_gender:
            return jsonify({"status": "success", "message": "si saxan ayad u badashay jinsi"})
        else:
            return jsonify({"status": "fail", "message": "qalad ayaa dhacay, marka kale ku celi"})

    except Exception as e:
        print(f"qalad aya ka dhahcay, update-user-student views: {e}")
    


