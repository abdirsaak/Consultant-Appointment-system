from app import app
import mysql.connector

from app.users_db import Database
from datetime import timedelta
from app.My_configration import MyConfiguration




class Appointments:
    def __init__(self, connection):
        try:
            self.connection = connection
            self.cursor = connection.cursor()
        except Exception as err:
            print('Something went wrong! Internet connection or database connection.')
            print(f'Error: {err}')

    def new_appointment(self,schedule_id,teacher_id,user_id):
        try:
          
            query = """
                    insert into appointments(schedule_id,teacher_id,user_id) values (%s,%s,%s)
                """
            self.cursor.execute(query, (schedule_id,teacher_id,user_id,))
            self.connection.commit()
            return "created appointment success"

        except Exception as e:
            print(f"error new appointment database")
    

    # ... chech is the appointment already booked
    def check_booking(self, schedule_id):
        try:
         
            query  ="""

                    select * from appointments where schedule_id = %s
                """
            self.cursor.execute(query, (schedule_id,))
            result = self.cursor.fetchall()
            print(f"check booking: {result}")
            if result:
                return False
            else:
                return True
            


        except Exception as e:
            print(f"error chech booking error: {e}")


    # .....  display user appointments
    def user_appointment_booked(self,user_id):
        try:
       
            query = """
                select  appointments.appointment_id,
                        appointments.teacher_id,
                         appointments.schedule_id,
                        appointments.appointment_date,
                        teachers.teacher_name,
                        TIME_FORMAT(schedules.from_time, '%H:%i') AS from_time,
                        TIME_FORMAT(schedules.to_time, '%H:%i') AS to_time,
                        schedules.schedule_day,
                        schedules.review
                from appointments
                join 
                   schedules on appointments.schedule_id = schedules.schedule_id
               JOIN 
                    teachers ON schedules.teacher_id = teachers.teacher_id where appointments.user_id = %s;
                """
            self.cursor.execute(query, (user_id,))
            
            appointments = self.cursor.fetchall()
            print(f"value of appointments: {appointments}")

            if appointments:
                return appointments
            else:
                return []

        except Exception as e:
            print(f"error user appointment booked : {e}")
    

    # .....  display teacher appointments
    def teacher_appointment_display(self,teacher_id):

        try:

        
            query = """
                select 
                       appointments.appointment_id,
                       appointments.schedule_id,
                        users.username,
                        appointments.appointment_date,
                        TIME_FORMAT(schedules.from_time, '%H:%i') AS from_time,
                        TIME_FORMAT(schedules.to_time, '%H:%i') AS to_time,
                        schedules.schedule_day,
                        schedules.review
                from appointments
                join 
                    schedules on appointments.schedule_id = schedules.schedule_id
                JOIN 
                    users ON appointments.user_id = users.user_id where appointments.teacher_id = %s;
                """
            self.cursor.execute(query, (teacher_id,))
            appointments = self.cursor.fetchall()
            print(f"value of appointments: {appointments}")
            
            if appointments:
                return appointments
            else:
                return []
        except Exception as e:
            print(f"error teacher appointments")


    #  display total appointmenst by teacher
    def get_total_appointments(self, teacher_id) :
        try:
         
            query=  """

                        SELECT COUNT(*) FROM appointments WHERE teacher_id  =%s;
                """
            self.cursor.execute(query,(teacher_id,))
            total_appointments = self.cursor.fetchall()
            return total_appointments
            pass

        except Exception as e:
            print(f"error getting total appoinments: {e}")


    def cancel_user_appointment(self, teacher_id, user_id,schedule_id):
        try:
         

            query = """

                    DELETE FROM appointments where teacher_id  =%s and 
                      user_id = %s  and schedule_id = %s
            """

            self.cursor.execute(query, (teacher_id, user_id,schedule_id,))
            self.connection.commit()
            print("canceld user his appointment")

            return True

        except Exception as e:
            print(f"error cancel user appointment: {e}")

    




my_configuration = MyConfiguration()
def check_admin_connection():
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
