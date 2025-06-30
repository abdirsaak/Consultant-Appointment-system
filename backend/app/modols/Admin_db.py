from app import app
import mysql.connector
from flask import Flask, json,jsonify
from app.users_db import Database

from flask_bcrypt import Bcrypt
from app.My_configration import MyConfiguration


bcrypt = Bcrypt()


def decryptpass(encrypted_password: str, key: bytes) -> str:
    # Create a Fernet object with the given key
    f = Fernet(key)
    # Decrypt the password
    decrypted_password = f.decrypt(encrypted_password.encode())
    return decrypted_password.decode()

class Admin:
    def __init__(self, connection):
        try:
            self.connection = connection
            self.cursor = connection.cursor()
        except Exception as err:
            print('Something went wrong! Internet connection or database connection.')
            print(f'Error: {err}')

    def register_admin(self, admin_name, admin_email, admin_password):
        query  ="""
                INSERT INTO admins (admin_name, admin_email, admin_password) VALUES (%s, %s, %s)
            """
        self.cursor.execute(query, (admin_name, admin_email, admin_password,) )
        self.connection.commit()
        print(f"created admin sucfuly")
    def admin_login(self, email, password):
        query = "SELECT admin_password, admin_id FROM admins WHERE admin_email = %s"
        self.cursor.execute(query, (email,))
        result = self.cursor.fetchall()

        if not result:
            return None  # ❌ Email not found

        hashed_password = result[0][0]
        if bcrypt.check_password_hash(hashed_password, password):
            return result  # ✅ Success
        else:
            return False  # ❌ Wrong password


    # def admin_login(self , admin_email, admin_password):
    #     query = """


    #             SELECT admin_password,admin_id FROM admins WHERE admin_email = %s """
    #     print("before excute")
    #     self.cursor.execute(query, (admin_email,))
    #     print("after excute")
    #     my_passowrd = self.cursor.fetchall()
    #     if my_passowrd:
    #         hashed_password = my_passowrd[0][0]
    #         admin_id = my_passowrd[0][1]

    #         is_valid = bcrypt.check_password_hash(hashed_password, admin_password)
    #         if is_valid:
    #             print("Login Granted")
    #             return [(hashed_password, admin_id)]
    #         else:
    #             print("Incorrect password")
    #             return False
    #     else:
    #         print("Email not found")
    #         return False

        
    
    

    def update_admin_username(self,admin_name, admin_id):
        try:
            
            query = """

                    UPDATE admins set admin_name  =%s where admin_id  = %s
                """
            self.cursor.execute(query,(admin_name,admin_id,))
            self.connection.commit()
            return True

        except Exception as e:
            print(f"error updating admin username: {e}")


    def update_admin_email(self,admin_email, admin_id):
        try:
      
            query = """

                    UPDATE admins set admin_email  =%s where admin_id  = %s
                """
            self.cursor.execute(query,(admin_email,admin_id,))
            self.connection.commit()
            return True

        except Exception as e:
            print(f"error updating admin username: {e}")


    def display_admin(self,admin_id):
        try:
           
            query = """
                select admin_id,admin_name,admin_email,admin_password from admins where admin_id = %s;

            """

            self.cursor.execute(query,(admin_id,))
            result = self.cursor.fetchall()
            if result:
                return result
            else:
                return jsonify({"status":"failed", "message": "something went wrong"})
            

        except Exception as e:
            print(f"display admins db: {e}")
    def validate_password(self, admin_id , old_password):

           query = """
                SELECT admin_password from admins WHERE admin_id = %s
                """
           self.cursor.execute(query, (admin_id,))
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

    def update_password(self, admin_id , new_pass):
    
        query = "update admins set admin_password = %s where admin_id = %s"
        try:
            self.cursor.execute(query, (new_pass,admin_id,))
            self.connection.commit()
            print("updated old_passowrd")
            pass

        except Exception as e:
            print(f"error in update passowrd: {e}")
       
            
    # ....... total teacher by male

    def get_total_male_teacher(self):
        try:
            query = """
                select count(*) from teachers where gender = "male"; 

                """
            self.cursor.execute(query)
            result = self.cursor.fetchall()
            print(f"total_male teachers: {result}")

            return result
        except Exception as e:
            print(f"error getting total male teacher: {e}")



    # ....... total teacher by female

    def get_total_female_teacher(self):
        try:
            query = """
                select count(*) from teachers where gender = "female"; 

                """
            self.cursor.execute(query)
            result = self.cursor.fetchall()
            print(f"total_female teachers: {result}")

            return result
        except Exception as e:
            print(f"error getting total female teacher: {e}")

            
    # ....... total user by female

    def get_total_female_users(self):
        try:
            query = """
                select count(*) from users where gender = "female"; 

                """
            self.cursor.execute(query)
            result = self.cursor.fetchall()
            print(f"total_female users: {result}")

            return result
        except Exception as e:
            print(f"error getting total female users: {e}")


    # ....... total user by male

    def get_total_male_users(self):
        try:
            query = """
                select count(*) from users where gender = "male"; 

                """
            self.cursor.execute(query)
            result = self.cursor.fetchall()
            print(f"total_male users: {result}")

            return result
        except Exception as e:
            print(f"error getting total male users: {e}")



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
        trainee = Admin(mysql_connect.connection)

        return True, trainee
    except Exception as e:
        print(f'')
        return False, f'Error: {e}.'