from app import app
import mysql.connector

from app.users_db import Database
from flask_bcrypt import Bcrypt
from flask import Flask,json,jsonify
from app.My_configration import MyConfiguration

bcrypt = Bcrypt()



def decryptpass(encrypted_password: str, key: bytes) -> str:
    # Create a Fernet object with the given key
    f = Fernet(key)
    # Decrypt the password
    decrypted_password = f.decrypt(encrypted_password.encode())
    return decrypted_password.decode()

class Teachers:
    # register a teacher
    def __init__(self, connection):
        try:
            self.connection = connection
            self.cursor = connection.cursor()
        except Exception as err:
            print('Something went wrong! Internet connection or database connection.')
            print(f'Error: {err}')

    def register_teacher(self, teacher_name, email, teacher_password,gender):
        
        query =  """

            insert into teachers (teacher_name,email,teacher_password,gender) values (%s,%s,%s,%s)
        """
        self.cursor.execute(query, (teacher_name, email, teacher_password,gender,))
        self.connection.commit()
        return "created teacher success"
    

    # ......... display teachers

    def display_teachers(self,teacher_id):
        try:
       
             quer = """
                        select teacher_id,teacher_name,email,gender from teachers where teacher_id =%s;
                    """
              
             self.cursor.execute(quer, (teacher_id,))
             result = self.cursor.fetchall()
             if result:
                   return result
             else:
                   return jsonify({"message": "empty teachers"})
             
        except Exception as e:
             print(f"error  display teacher profile: {e}")
              
        

    # ......... display teachers

    def display_teachers_by_admin(self):
         try:
          
              quer = """
                        select teacher_id,teacher_name,email,gender from teachers;
                    """
              
              self.cursor.execute(quer)
              result = self.cursor.fetchall()
              if result:
                   return result
              else:
                   return jsonify({"message": "empty teachers"})
              
         

         except Exception as e:
              print(f"error display teachers: {e}")


    
         
    # ......... validate email
    def validate_email(self, email):

        query = """
                SELECT * FROM teachers WHERE email = %s
            """
        self.cursor.execute(query, (email,))
        myresult = self.cursor.fetchall()
        return myresult
    def login_teacher(self, email, password):
        query = "SELECT teacher_password, teacher_id FROM teachers WHERE email = %s"
        self.cursor.execute(query, (email,))
        result = self.cursor.fetchall()

        if not result:
            return None  # ❌ Email not found

        hashed_password = result[0][0]
        if bcrypt.check_password_hash(hashed_password, password):
            return result  # ✅ Success
        else:
            return False  # ❌ Wrong password

    
    # def login_teacher(self ,email,password):

    #         query = """


    #                 SELECT teacher_password,teacher_id FROM teachers WHERE email = %s  """
    #         print("before excute")
    #         self.cursor.execute(query, (email,))
    #         print("after excute")
    #         my_passowrd = self.cursor.fetchall()
    #         print(f"my passowrd ata: {my_passowrd}")
    #         if my_passowrd:
    #             hashed_passowrd = my_passowrd[0][0]
    #             print('Encripted pass 1: ', type(hashed_passowrd))
    #             print(f"password hashed databse: {hashed_passowrd}")
    #             print(f"password plaintext: {password}")
    #             compare  = bcrypt.check_password_hash(hashed_passowrd,password )
            
                
    #             print(f"passowrd decripted: {compare}")
                
    #             # Comprae the two passwords
    #             if compare:
    #                 print(f'Login Granted: {compare}')
    #                 return my_passowrd
    #             else:
    #                 print('Bad password')
    #                 return False
                
    #         else:
    #             # login failed
    #             print("false here ...")
    #             return False
    
    # ........................ teacher profile
            
      # username validate
    def validat_teacher_name(self, teacher_id,teacher_name):


        query = "select * from teachers where  teacher_id = %s and teacher_name = %s "
        self.cursor.execute(query, (teacher_id,teacher_name,))
        myresult = self.cursor.fetchall()
        print(f"teacher validate: {myresult}")
        return myresult
    


    # update username only
    def update_teacher_name(self,teacher_id,teacher_name):
   
        query = "update teachers set teacher_name = %s where teacher_id = %s"
        self.cursor.execute(query, (teacher_name,teacher_id,))
        # print("Executing query:", self.statement)

        self.connection.commit()
        print(f"teachername updated sucfuly")

    def update_email(self, teacher_id, email):
   

            quer = "UPDATE teachers SET email  = %s  WHERE teacher_id  =%s "
            self.cursor.execute(quer, (email, teacher_id,))
            self.connection.commit()
            print(f"email updated sucfuly")


     # validate passowrd
    def validate_password(self, teacher_id , old_password):
   

           query = """
                SELECT teacher_password from teachers WHERE teacher_id = %s
                """
           self.cursor.execute(query, (teacher_id,))
           existing_password = self.cursor.fetchone()

           if existing_password:
                existing_password = existing_password[0]

                # Verify the entered old password against the stored hashed password
                if bcrypt.check_password_hash(existing_password, old_password):
                    print("Old password is correct")
                    return True
                else:
                    print("Old password is incorrect")
                    return False
           else:
                print("User not found")
                return False
        
    
    # .... update password
    def update_password(self, teacher_id , new_pass):
     
        query = "update teachers set teacher_password = %s where teacher_id = %s"
     
        try:
            self.cursor.execute(query, (new_pass,teacher_id,))
            self.connection.commit()
            print("updated old_passowrd")
                    
        except Exception as e:
             print(f"eror in update password teacher error db: {e}")





    def update_gender(self,teacher_id,gender):
         try:

              query = """
                    update teachers set gender = %s where teacher_id  = %s

                        """
              print(f"database teacher gender value:{gender}")
              print(f"database teacher gender type:{type(gender)}")
              self.cursor.execute(query, (gender, teacher_id))
              self.connection.commit()
            #   print("updated succes teacher success")
              if self.cursor.rowcount > 0:
                    print("Updated teacher gender successfully")
                    return True
              else:
                    print("No rows were updated. Teacher not found or gender already set to the same value.")
                    return False
         
         except Exception as e:
              print(f"error updating teacher gender: {e}")

    

    # ... get single teacher
              
    def get_teacher_names(self):
         try:
            
              
              query = """
                    SELECT teacher_id,teacher_name from teachers;
                """
              self.cursor.execute(query)
              result = self.cursor.fetchall()

              if result:
                   return result
              
              else:
                   return False
         

         except Exception as e:
              print(f"error geting all teahcer names: {e}")
    

    def delete_teacher(self, teacher_name):
         try:
    
              query = """
                    DELETE FROM teachers WHERE teacher_name = %s

                """
              self.cursor.execute(query, (teacher_name,))
              self.connection.commit()
              return True
         
         except Exception as e:
              print(f"error in teacher deleting {e}")



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
        trainee = Teachers(mysql_connect.connection)

        return True, trainee
    except Exception as e:
        print(f'')
        return False, f'Error: {e}.'
    


# ............... only by admin

    # ..... total teacher by
