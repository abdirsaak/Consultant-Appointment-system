from app import app
from .modols.schedule_db import Schedule
from .users_db import Database
from flask import Flask , json, jsonify,request,session
from app.My_configration import MyConfiguration



# ............ configaration ...............
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
        trainee = Schedule(mysql_connect.connection)

        return True, trainee
    except Exception as e:
        print(f'')
        return False, f'Error: {e}.'








# ........ create todo api

@app.route("/create-schedule/<int:id>", methods = ["POST"])
def create_schedule(id):
    connection_status, teacher_schedule = check_connection()
    print("i am in create todo fucntion")
    teacher_id = id
    from_time  =request.json.get("from_time")
    to_time = request.json.get("to_time")
    schedule_day = request.json.get("schedule_day")
    review = request.json.get("review")

    if not teacher_id or not from_time or not to_time or not schedule_day or not review:
        return jsonify({"message": "must fill the blank spaces"})
    

    insert_schedule = teacher_schedule.create_schedule(teacher_id,from_time,to_time,schedule_day,review)
    print(f"created todo views: {insert_schedule}")

    return jsonify({"status": "success", "message": "created schedule succes"}) , 200


# ......... get_all_public_todos api
@app.route("/get-all-schedule/<int:id>", methods = ["GET"])
def get_all_schedules(id):

    connection_status, teacher_schedule = check_connection()
    print("i am in get all schedule  function")
    teahcer_id = id
    all_schedules = teacher_schedule.get_all_schedule(teahcer_id)
    print(f"all public todos views: {all_schedules}")
    if not isinstance(all_schedules, list):
        return jsonify({"status": "error", "message": "Invalid data format"}), 500

    converted_schedules = []
    
    for schedule in all_schedules:
        converted_schedule = {
           "teacher_id": schedule[0],  # Access teacher_id (index 0)
            "teacher_name": schedule[1],  # Access teacher_name (index 1)
            "schedule_id": schedule[2],
            "from_time": str(schedule[3]),
            "to_time": str(schedule[4]),
            "schedule_day": schedule[5],
            "review": schedule[6],
        }
        converted_schedules.append(converted_schedule)
    print(f"teacher_schedules: {converted_schedules}")

    if converted_schedules:
        return jsonify({"status": "success", "data":  converted_schedules})

    else:
        return jsonify({"status": "empty", "message": "empty scheduls","data":[] })





# ......... update schedule api
@app.route("/update-schedule/<int:teacher_id>/<int:schedule_id>", methods=["PUT"])
def update_schedule(teacher_id,schedule_id):
    connection_status, teacher_schedule = check_connection()
    teacher_id = teacher_id
    from_time  =request.json.get("from_time")
    to_time = request.json.get("to_time")
    schedule_day = request.json.get("schedule_day")
    review = request.json.get("review")

    schedule_id = schedule_id
    if not teacher_id or not from_time or not to_time or not schedule_day or not review:
        return jsonify({"message": "Fill in the required fields"})

    # Assume you have a way to validate the user's login, for example, using a session or token
    # Add your authentication logic here

    make_update_schedule = teacher_schedule.update_schedules(teacher_id,schedule_id,from_time,to_time,schedule_day,review)
    print(f"the todos updated sucess: {make_update_schedule}")
    return jsonify({"message": "Updated schedule successfully"})


# ......... delete todo api
@app.route("/cancel-schedule/<int:teacher_id>/<int:schedule_id>", methods=["DELETE"])
def cancel_schedule(teacher_id,schedule_id):
    connection_status, teacher_schedule = check_connection()
    teacher_id = teacher_id
    schedule_id = schedule_id
    if not teacher_id or not schedule_id:
        return jsonify({"message": "you are not have right acces to delete"})
    # Assume you have a way to validate the user's login, for example, using a session or token
    # Add your authentication logic here
   
    make_cancel_schdule = teacher_schedule.cancel_schedule(teacher_id,schedule_id)
    print(f"the schedule cancelled sucess: {make_cancel_schdule}")
    return jsonify({"message": "canceled schedule successfully"})




# ... get total schedules


@app.route("/total-schedules/<int:id>", methods = ["GET"])
def get_total_schedules(id):
    try:
        connection_status, teacher_schedule = check_connection()
        teacher_id = id
        if not teacher_id:
            return jsonify({"messgae": "soo geli teacher_id"})

        total_schedules = teacher_schedule.count_total_schdedules(teacher_id)
        d = list(total_schedules)
        print(f"total shedules: {d}")
        
        return jsonify({"status": "succes", "messgae": "total counts are", "data": d})

    except Exception as e:
        print(f"error geting total scheduling: {e}")
        return "error"
    



@app.route("/teacher-schedule-by-name/<string:teacher_name>", methods = ["GET"])
def get_teacher_schedule_by_name(teacher_name):
    try:
        connection_status, teacher_schedule = check_connection()
        teacher_name = teacher_name

        get_schedule = teacher_schedule.get_schedules_by_teachername(teacher_name)
        schedule_dic = []
        for i in get_schedule:
            schedule_dic.append({
                "schedule_id": i[0],
                "teacher_id": i[1],
                "from_time":str( i[2]),
                "to_time": str(i[3]),
                "schedule_day": i[4],
                "review": i[5],
                "teacher_name": i[6]
            })
        if schedule_dic:
            return jsonify({"status": "success", "message": "sucefuly teacher schedules", "data": schedule_dic})
        else:
            return jsonify({"status": "fail", "message": "does not have any scheduel for this teacher you selected", "data": []})


    except Exception as e:
        print(f"error teacher schedule by name views:,{e}")
        return "erro"
