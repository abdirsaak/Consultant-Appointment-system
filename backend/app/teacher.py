from app import app
from flask import Flask, request, jsonify, session,json
from .users_db import Database
from .modols.teachers_db import Teachers
# Database = Database('', '', '', '')
# mydb = Database('localhost', 'root', 'abdicanab25', 'todos')


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
        trainee = Teachers(mysql_connect.connection)

        return True, trainee
    except Exception as e:
        print(f'')
        return False, f'Error: {e}.'

# secret key
app.config["SECRET_KEY"] = "abdi@12"

def encryptpass(password: str, key: bytes) -> str:
    # Create a Fernet object with the given key
    f = Fernet(key)
    # Encrypt the password
    encrypted_password = f.encrypt(password.encode())
    return encrypted_password.decode()

# ..... register api
@app.route('/register-teacher', methods=['POST'])
def register_teacher():
        
        connection_status, teacher = check_connection()
        name = request.json.get('username')
        email = request.json.get('email')
        password = request.json.get('password')
        gender = request.json.get("gender")

        validate_user = teacher.validate_email(email)
        print(f"username{name}")
        print(f"email {email}")
        print(f"password {password}")
        print(f"gender {gender}")
        if validate_user:
            return  jsonify({"status": "error", "message": "Email-ka hore ayaa loo isticmaalay"})
        else:
            # change passowrd into hash
            password_to_hash= bcrypt.generate_password_hash(password).decode('utf-8')
            print(f"before hash passowrd: {password}")
            print(f"after hash passowrd: {password_to_hash}")

            insert_user  =teacher.register_teacher(name,email,password_to_hash,gender)
            if insert_user:

                print(f"created teacehr succefuly: {insert_user}")
                return jsonify({"status": "success", "message": "si saxan aya loo abuuray macalinka"}) , 200
            else:
                return jsonify({"status": "falied", "message": "Qalad aya dhacay"})
        


# display teachers api

@app.route("/display-teachers/<int:id>", methods = ["GET"])
def displayTeaches(id):
    try:
        connection_status, teacher = check_connection()
        teacher_id = id
        display_teachers = teacher.display_teachers(teacher_id)
        print(f"all teachers oky: {display_teachers}")
        teacher_dic = []

        for i in display_teachers:
            teacher_dic.append({
                "id": i[0],
                "name": i[1],
                "email": i[2],
                'sex':i[3]
            })
        print(f"all teachers: {teacher_dic}")
        return teacher_dic
        

    except Exception as e:
        print(f"error views display teachers: {e}")
        return jsonify({"status": "error", "message": "qalad  aya dhacay"})
    
    # ........... display teachers by admin
@app.route("/admin-teachers", methods = ["GET"])
def displayadmin_Teaches():
    try:
        connection_status, teacher = check_connection()
      
        display_teachers = teacher.display_teachers_by_admin()
        print(f"all teachers oky: {display_teachers}")
        teacher_dic = []

        for i in display_teachers:
            teacher_dic.append({
                "id": i[0],
                "name": i[1],
                "email": i[2],
                'sex':i[3]
            })
        print(f"all teachers: {teacher_dic}")
        return teacher_dic
        

    except Exception as e:
        print(f"error views display teachers: {e}")
        return jsonify({"status": "error", "message": "qalad aya dhacay"})






# .............. teacher profile

@app.route("/update-teacher-name/<int:id>", methods = ["PUT"])
def update_teacher_name(id):
    print("i am in update teacher function")
   
    connection_status, teacher = check_connection()
    teacher_id = id
    print(f"type of teacher id: {type(teacher_id)}")
    old_teacher_name = request.json.get("old_teacher_name")
    teachername = request.json.get("teacher_name")
    if not old_teacher_name or not teachername:
        return jsonify({"message": "fadlan buuxi meelaha banaan"})
    validate_teachername = teacher.validat_teacher_name(teacher_id,old_teacher_name)
    print(f"update_username variabel: {validate_teachername}")
    if validate_teachername:
        update_username_ = teacher.update_teacher_name(teacher_id,teachername)
        print(f"update_teacher views: {update_username_}")
        return jsonify({"status": "success", "message": "si saxan ayad u badashay magacaaga"}) , 200

    else:
        return jsonify({"status": "fail","message": "magacaaga hore waa qalad"})
    

@app.route("/update-teacher-email/<int:id>", methods = ["PUT"])
def update_teacher_email(id):
    connection_status, teacher = check_connection()
    print("i am in update email function")
   
   
    teacher_id = id
    old_email  =request.json.get("old_email")
    email = request.json.get("email")
    if not email or not old_email:
        return jsonify({"message": "fadlan buuxi meelaha banaan"})
    

    validate_email = teacher.validate_email(old_email)
    if validate_email:
        
        update_email_ =  teacher.update_email(teacher_id,email)
        print(f"updated email succes: {update_email_}")
        return jsonify({"status": "success", "message": "si saxan ayad u badashay email-kaga"}) , 200
    else:
        return jsonify({"status": "fail", "message": "email-kaga hore waa qalad"})


@app.route("/update-teacher-password/<int:id>", methods = ["PUT"])
def update_teacher_password(id):
    connection_status, teacher = check_connection()
    print("i am in update password function")
    teacher_id = id
    old_password = request.json.get("old_password")
    new_password = request.json.get("new_password")
    if not old_password or not new_password:
        return jsonify({"message": "buuxi meelaha banaan fadaln"})
    
    validate_password = teacher.validate_password(teacher_id,old_password)
    print(f"validate_password views: {validate_password}")
    if validate_password:
        # change passowrd into hash
        password_to_hash= bcrypt.generate_password_hash(new_password).decode('utf-8')
        print(f"before hash passowrd: {new_password}")
        print(f"after hash passowrd: {password_to_hash}")
        update_password = teacher.update_password(teacher_id,password_to_hash)
        print(f"update_password views: {update_password}")
        return jsonify({"status": "success", "message": "si saxan ayad u badashay password-kaga"}) , 200
    else:
        return jsonify({"status": "fail", "message": "password-kaga hore waa qalad"})
    


@app.route("/update-gender/<int:id>", methods =["PUT"])
def update_gender(id):
    try:
        connection_status, teacher = check_connection()
        teacher_id = id
        teacher_gender = request.json.get("teacher_gender")
        print(f"teacher gender type: {type(teacher_gender)}")
        update_gender = teacher.update_gender(teacher_id,teacher_gender)
        if update_gender:
            return jsonify({"status": "success", "message": "si saxan ayad u badashay jinsigaaga"})
        else:
            return jsonify({"status": "fail", "message": "qalad ayaa dhacay, mar labaad ku celi"})

    except Exception as e:
        print(f"eror while updating teacher gender views: {e}")





@app.route("/get-teacher-names", methods = ["GET"])
def get_teacher_names():


    try:
        connection_status, teacher = check_connection()
        get_teacher = teacher.get_teacher_names()
        
        teacher_dic = []
        for i in get_teacher:
            teacher_dic.append({
                "teacher_id": i[0],
                "teacher_name": i[1],
            })


        if teacher_dic:
            return jsonify({"status": "success", "data": teacher_dic})
        else:
            return jsonify({"status": "fail", "data": []})

    except Exception as e:
        print(f"error geting teacher names views: {e}")




@app.route("/teacher-delete/<string:teacher_name>", methods = ["DELETE"])
def delete_teacher(teacher_name):
    try:
        connection_status, teacher = check_connection()
        teacher_name = teacher_name

        delete_teacher = teacher.delete_teacher(teacher_name)
        if delete_teacher:
            return jsonify({"status": "success", "message": "si saxan ayad u tirtay maclinka"})
        else:
            return jsonify({"status": "fail", "message": "qalad aya dhacay."})

    except Exception as e:
        print(f"error while deleting teacher views waye: {e}")

  