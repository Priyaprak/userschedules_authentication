

const mysql = require('mysql');

const db = require('./myconfig.js');
db.query("CREATE DATABASE employeeschema", function(err,res){
    if(err) throw err;
    console.log("Schema/Database File Created");
    db.query("CREATE TABLE employeeschema.users (userid INT NOT NULL AUTO_INCREMENT PRIMARY KEY,surname VARCHAR(255),firstname VARCHAR(255),emailaddress VARCHAR(255),password VARCHAR(255))", function(err,res){
        if(err) throw err;
        console.log("Table Created");
    });

    db.query("CREATE TABLE employeeschema.schedules (scheduleid INT NOT NULL AUTO_INCREMENT PRIMARY KEY,userid INT NOT NULL,daysoftheweek ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,starttime TIME,endtime TIME,FOREIGN KEY(userid) REFERENCES users(userid));", function(err,res){
        if(err) throw err;
        console.log("Table Created");
    });
    

});





                /* var sql = "INSERT INTO userschema.schedules (username, daysoftheweek, starttime, endtime) VALUES ?";
                var values = [

                    ['shanthi', 'Monday', '08:30', '05:30'],
                    ['Ananya', 'Tuesday', '08:30', '05:30'],
                    ['Sanjana','Wednesday', '08:30', '05:30'],
                    ['Prakash','Thursday', '08:30', '05:30'],
                    ['Raje' ,'Friday', '08:30', '05:30'],
                    ['Rajaram' ,'Saturday', '08:30', '05:30'],
                    ['Prema' ,'Sunday', '08:30', '05:30']
                ];
                connection.query(sql, [values],  function(err, result) {
                    if(err) throw err;
                    console.log("No of Rows inserted into table successfully is : " +result.affectedRows);
                }); */
            



