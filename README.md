# Project Name: Consultant appointment system

# How to connect to the database

## Go to the file name: My_configration.py

# How to use system

### first you need to register admin,to register admin you can use either insomnia or postman.

you will have to send a POST request with this API-endpoint (/register-admin),  
with the following data in JSON format or
look for admin.py in backend :
{
"admin_name": "admin",
"admin_email":"example@gmail.com",
"admin_password": "123@@"
}

# Database (MYSQL)

1. Databasa Name: .................
2. admin table:
   create table admins(
   admin_id INT AUTO_INCREMENT PRIMARY KEY,
   admin_name varchar(255) not null,
   admin_email varchar(255) not null,
   admin_password varchar(255) not null,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);
 3. users table
CREATE TABLE users (
user_id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(50) NOT NULL,
email VARCHAR(255) NOT NULL,
password_hash VARCHAR(255) NOT NULL,
gender VARCHAR(255) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

 4. Teacher table
CREATE TABLE teachers (
teacher_id INT PRIMARY KEY AUTO_INCREMENT,
teacher_name VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL,
teacher_password VARCHAR(255) NOT NULL,
gender varchar(255) not null,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

5. schedules table
   create table schedules(
   schedule_id int PRIMARY KEY AUTO_INCREMENT,
   teacher_id int,
   from_time time not null,
   to_time time not null,
   schedule_day varchar(255) not null,
   review VARCHAR(255) not null,
   FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id),
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

6. appointments table
   CREATE TABLE appointments (
   appointment_id INT PRIMARY KEY AUTO_INCREMENT,
   teacher_id INT,
   user_id INT,
   schedule_id INT,
   appointment_date DATE DEFAULT (CURRENT_DATE),
   appointment_time TIME DEFAULT (CURRENT_TIME),  
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id),
   FOREIGN KEY (user_id) REFERENCES users(user_id),
   FOREIGN KEY (schedule_id) REFERENCES schedules(schedule_id)
   );
