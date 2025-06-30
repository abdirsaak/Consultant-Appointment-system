from app import app
import mysql.connector

from app.users_db import Database
from app.My_configration import MyConfiguration

class Schedule:
    def __init__(self, connection):
        try:
            self.connection = connection
            self.cursor = connection.cursor()
        except Exception as err:
            print('Something went wrong! Internet connection or database connection.')
            print(f'Error: {err}')
    def create_schedule(self, teacher_id, from_time,to_time,schedule_day,review):
        try:
         
            
            query = """
        insert into schedules (teacher_id, from_time,to_time,schedule_day,review) values (%s, %s,%s,%s,%s)
                """
            self.cursor.execute(query, (teacher_id, from_time,to_time,schedule_day,review,))
            self.connection.commit()
            return "created schdeule success"
            
        except Exception as e:
            print(f"error creating scheduls: {e}")
    

    
    def get_all_schedule(self,teacher_id):
        try:
      

            query = """
                    select 
                            schedules.teacher_id,teachers.teacher_name,schedules.schedule_id,schedules.from_time,schedules.to_time,schedules.schedule_day,
                            schedules.review from schedules join teachers
                            on teachers.teacher_id  = schedules.teacher_id where teachers.teacher_id = %s;

                """
            self.cursor.execute(query, (teacher_id,))
            result = self.cursor.fetchall()
            print(f"all schedules todos: {result}")

            return result
            

        except Exception as e:
            print(f"eror get all schduels: {e}")
    

    


    def update_schedules(self,teacher_id, schedule_id,from_time,to_time,schedule_day,review):
       try:
        
            query = """
                UPDATE schedules SET from_time = %s, to_time = %s, schedule_day = %s,review = %s
                WHERE schedule_id = %s AND teacher_id = %s;
            """
            self.cursor.execute(query, (from_time,to_time,schedule_day,review,schedule_id,teacher_id))
            self.connection.commit()
            print(f"schedule updated successfully in the database")
           
       
       except Exception as e:
       
           print(f"error update schulde: {e}")
    

    def cancel_schedule(self, teacher_id, schedule_id):
        try:
     
            query = """
                DELETE FROM schedules WHERE schedule_id = %s AND teacher_id = %s;
            """
            self.cursor.execute(query, (schedule_id, teacher_id))
            self.connection.commit()
            print(f"schedule deleted successfully from the database")
            

        except Exception as e:
            print(f"calcel schules error: {e}")
        
    def count_total_schdedules(self, teacher_id):
        try:
      
            query = """
                    select count(*) from schedules where teacher_id = %s
                """
            self.cursor.execute(query, (teacher_id,))
            result = self.cursor.fetchone()
            print(f"count total schedules: {result}")
            return result
         
            

        except Exception as e:
            print(f"error count total schdules: {e}")
    def get_schedules_by_teachername(self, teacher_name):
        try:
        
            query = """

                SELECT 
                    schedules.schedule_id ,schedules.teacher_id, schedules.from_time, to_time, 
                    schedules.schedule_day, schedules.review ,teachers.teacher_name
                FROM
                    schedules
                JOIN teachers ON schedules.teacher_id = teachers.teacher_id
                WHERE
                    teachers.teacher_name = %s;
            """

            self.cursor.execute(query, (teacher_name,))
            result = self.cursor.fetchall()
            if result:
                return result
            else:
                return False


        except Exception as e:
            print(f"error geting teacher schedule based teahcer name: {e}")




            
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
        trainee = Schedule(mysql_connect.connection)

        return True, trainee
    except Exception as e:
        print(f'')
        return False, f'Error: {e}.'


    
 
        



        