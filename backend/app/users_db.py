from app import app
import mysql.connector
from flask_bcrypt import Bcrypt
from flask import Flask,json,jsonify
from app.My_configration import MyConfiguration

bcrypt = Bcrypt()



class Database:
    def __init__(self, host, port, user, password, database):
        self.host = host
        self.port = port
        self.user = user
        self.password = password
        self.database = database

    def make_connection(self):
        try:
            self.connection = mysql.connector.connect(
                host=self.host,
                port=self.port,
                user=self.user,
                password=self.password,
                database=self.database,
            )
            self.cursor = self.connection.cursor()
        except Exception as e:
            print(e)

    def my_cursor(self):
        return self.cursor






def decryptpass(encrypted_password: str, key: bytes) -> str:
    # Create a Fernet object with the given key
    f = Fernet(key)
    # Decrypt the password
    decrypted_password = f.decrypt(encrypted_password.encode())
    return decrypted_password.decode()


class Users:
    def __init__(self, connection):
        try:
            self.connection = connection
            self.cursor = connection.cursor()
        except Exception as err:
            print('Something went wrong! Internet connection or database connection.')
            print(f'Error: {err}')

    
    def register_user(self, username, email, password_hash,gender):
        sql = """
                INSERT INTO users (username, email, password_hash,gender) VALUES (%s, %s, %s,%s)
                """
        try:
            self.cursor.execute(sql, (username, email, password_hash,gender))
            self.connection.commit()
            print('Waa la kaydiyey tababbarka cusub!')
            return True, f'Waa la kaydiyey tababbarka cusub!'

        except Exception as e:
            print('Lama kaydinin tababbarka cusub!')
            print(f'Error: {e}')
            return False, f'Error: {e}.'

   

   
  
    
    def display_Students(self,user_id):
         try:
         
              quer = """
                        SELECT user_id,username,email,password_hash,gender from users WHERE user_id = %s;
                    """
              
              self.cursor.execute(quer, (user_id,))
              result = self.cursor.fetchall()
              if result:
                   return result
              else:
                   return jsonify({"message": "empty students"})
              
         

         except Exception as e:
              print(f"error display students: {e}")
       

    # @staticmethod
    def validate_user(self, email):
         sql = """
                 SELECT * FROM users WHERE email = %s
                """
         try:
            self.cursor.execute(sql, (email,))
            # self.connection.commit()
            myresult = self.cursor.fetchall()
            return myresult
            # print('Waa la kaydiyey tababbarka cusub!')
            # return True, f'Waa la kaydiyey tababbarka cusub!'

         except Exception as e:
            print('Lama kaydinin tababbarka cusub!')
            print(f'Error: {e}')
            return False, f'Error: {e}.'
        
    # login fucntion
    def login_user(self, email, password):
            query = "SELECT password_hash, user_id FROM users WHERE email = %s"
            self.cursor.execute(query, (email,))
            result = self.cursor.fetchall()

            if not result:
                return None  # ❌ Email not found

            hashed_password = result[0][0]
            if bcrypt.check_password_hash(hashed_password, password):
                return result  # ✅ Success
            else:
                return False
    # def login_user(self , email,password):
    
    #     query = """


    #             SELECT password_hash,user_id FROM users WHERE email = %s """
    #     print("before excute")
    #     self.cursor.execute(query, (email,))
    #     print("after excute")
    #     my_passowrd = self.cursor.fetchall()
    #     if my_passowrd:
    #         hashed_passowrd = my_passowrd[0][0]
    #         print('Encripted pass 1: ', type(hashed_passowrd))
    #         print(f"password hashed databse: {hashed_passowrd}")
    #         print(f"password plaintext: {password}")
    #         compare  = bcrypt.check_password_hash(hashed_passowrd,password )
        
            
    #         print(f"passowrd decripted: {compare}")
            
    #         # Comprae the two passwords
    #         if compare:
    #             print('Login Granted')
    #             return my_passowrd
    #         else:
    #             print('Bad password')
    #             return False
            
    #     else:
    #         # login failed
    #         print("false here")
    #         return False
        


    # username validate
    def validat_username(self, user_id,username):

        query = "select * from users where  user_id = %s and username = %s "
        self.cursor.execute(query, (user_id,username,))
        myresult = self.cursor.fetchall()
        print(f"username validate: {myresult}")
        return myresult
    

    # update username only
    def update_username(self,user_id,new_username):

        query = "update users set username = %s where user_id = %s"
        self.cursor.execute(query, (new_username,user_id,))
        self.connection.commit()
        print(f"username updated sucfuly")

    
    # .... update gmail
    def update_email(self, user_id, email):

        quer = "UPDATE users SET email  = %s  WHERE user_id  =%s "
        self.cursor.execute(quer, (email, user_id,))
        self.connection.commit()
        print(f"email updated sucfuly")
        return True
    
    # validate passowrd
    def validate_password(self, user_id , old_password):
   
           query = """
                SELECT password_hash from users WHERE user_id = %s
                """
           self.cursor.execute(query, (user_id,))
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
    def update_password(self, user_id , new_pass):
     
        query = "update users set password_hash = %s where user_id = %s"
        self.cursor.execute(query, (new_pass,user_id,))
        self.connection.commit()
        print("updated old_passowrd")
        return True
    
    def update_gender(self,user_id,gender):
         try:
              query = """
                    update users set gender = %s where user_id  = %s

                        """
              print(f"database student gender value:{gender}")
              print(f"database stduent gender type:{type(gender)}")
              self.cursor.execute(query, (gender, user_id))
              self.connection.commit()
            #   print("updated succes teacher success")
              if self.cursor.rowcount > 0:
                    print("Updated teacher gender successfully")
                    return True
              else:
                    print("No rows were updated. Teacher not found or gender already set to the same value.")
                    return False
         
         except Exception as e:
              print(f"error updating student gender: {e}")

  


        
        



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
        trainee = Users(mysql_connect.connection)

        return True, trainee
    except Exception as e:
        print(f'')
        return False, f'Error: {e}.'
        
        
       

    
    #update username only
    # def update_username(self,id,new_username):

       
        




# if __name__ == "__main__":
#     print('Connecting to the database...')
#     connection_status, Users = check_admin_connection()
#     if connection_status:
#         print('You are connected to the database successfully!')
#         # my_hashed_pass = admin.encript_paswrd('1423')
#         # print(my_hashed_pass)
#         flag, _ = Users.register2(
#             username="somalia",
#             email="soma@gmail.com",
#             password_hash=222,
#             gender="male"
           
#         )
#         #  username, email, password_hash,gender
#         if flag:
#             print(_)
#             # send_last_phase_email(_)
#             # print(len(_))
#         else:
#             print(_)

#     else:
#         print(f'Database Connection {Users}')
#     pass
