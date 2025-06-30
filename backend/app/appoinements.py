from app import app
from .modols.appointments_db import Appointments
from .users_db import Database
from flask import Flask , json, jsonify,request,session

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
        trainee = Appointments(mysql_connect.connection)

        return True, trainee
    except Exception as e:
        print(f'')
        return False, f'Error: {e}.'





0
    


# ......... create insert appoinment api
@app.route('/create-appointment/<int:schedule_id>/<int:teacher_id>/<int:user_id>', methods=['POST']) 
def Book_appointment(schedule_id, teacher_id,user_id):
    try:
        connection_status, appointment = check_connection()
        print("i am in create appointment function")
        schedule_id = schedule_id
        teacher_id = teacher_id
        user_id = user_id
    
        if not schedule_id or not teacher_id or not user_id:

            return jsonify({"message": "must fill the blank spaces"})
        # api for cheching the booking already
        check_booking = appointment.check_booking(schedule_id)
        if check_booking:
            insert_appointment = appointment.new_appointment(schedule_id,teacher_id,user_id)
            print(f"created appointment views: {insert_appointment}")
            return jsonify({"status": "success", "message": "created appointment succes"}) , 200
        else:
            return jsonify({"status": "taked", "message":"already booked this schedule"})


    except Exception as e:
        print(f"error while bookin  g schedule views: {e}")


# .....  display  appointments booked user
@app.route('/user-appointment/<int:id>', methods=['GET'])
def user_appointment_booked(id):
    connection_status, appointment = check_connection()
    print("i am in user appointment booked function")
    user_id =id
    print(f"user id: {user_id}")
    if not user_id:
        return jsonify({"message": "must fill the blank spaces"})
    
    user_appointment = appointment.user_appointment_booked(user_id)
    if user_appointment:
        appointment_dic = []
        for i in user_appointment:
            appointment_dic.append({
                "appointment_id": i[0],
                "teacher__id": i[1],
                "schedule__id": i[2],
                "appointment_date": i[3],
                "teacher_name":i[4],
                "from_time": i[5],
                "to_time": i[6],
                "schedule_day": i[7],
                "review": i[8]


            })

        print(f"user appointment views: {appointment_dic}")
        return jsonify({"status": "success", "message": "user appointment booked", "data": appointment_dic}) , 200

    else:
        return jsonify({"status": "empty","message": "No Appointments Booked","data": []})





# .....  display  appointments booked by every teacher
@app.route("/teacher-appointment/<int:teacher_id>", methods = ["GET"])
def get_teacher_appointment_booked(teacher_id):
    try:
        connection_status, appointment = check_connection()
        teacher_id = teacher_id
        if not teacher_id:
            return jsonify({"message": "soo geli teacher_id"})
        get_teacher_appointment_booked=  appointment.teacher_appointment_display(teacher_id)
        
        bookedSchedules = []
        for i in get_teacher_appointment_booked:
            bookedSchedules.append({
                "appointment_id": i[0],
                "scheduled_id": i[1],
                "student_name": i[2],
                "appointment_date":i[3],
                "from_time": i[4],
                "to_time": i[5],
                "schedule_day": i[6],
                "schedule_review": i[7]
            })
        print(f"all boked schedule: {bookedSchedules}")
        if bookedSchedules:
            return jsonify({"status": "sucess","messgae": "all teacher_appointment", "data": bookedSchedules})
        else:
            return jsonify({"status": "empty", "message": "empty booked schedules", "data": []})

        
    except Exception as e:
        print(f"error get teacher appointment booked: {e}")


        




#   display total appointements booked by every teacher

@app.route("/total-appoinments/<int:id>", methods = ["GET"])
def total_appointments(id):

    try:
        connection_status, appointment = check_connection()
        teacher_id = id
        if not teacher_id:
            return jsonify({"message": "teacher_id is empty"})
        
        total_appointemenst = appointment.get_total_appointments(teacher_id)

        return jsonify({"status": "succes", "message": "total appointments booked", "data": total_appointemenst})
        
    except Exception as e:
        print(f"error total appointments: {e}")




@app.route("/cancel-user-appointment/<int:tech_id>/<int:use_id>/<int:schedule_id>", methods = ["POST"])
def cancel_user_appointment(tech_id, use_id,schedule_id):
    try:
        connection_status, appointment = check_connection()
        teacher_id = tech_id
        user_id = use_id
        schedule_id = schedule_id

        cancel_schedule = appointment.cancel_user_appointment(teacher_id,user_id,schedule_id )

        if cancel_schedule:
            return jsonify({"status": "success", "message": "canceled user his appointment"})
        else:
            return jsonify({"status": "fail", "message": "un succesfuly canceld appointment"})

    except Exception as e:
        print(f"error while user cancel his booked schedule: {e}")