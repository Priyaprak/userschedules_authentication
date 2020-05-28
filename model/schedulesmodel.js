const db = require('../database/myconfig');
const crypto = require('crypto');
const schedulesmodel={
    /* Hash the password with SHA256 */
    
    createUser : ([username, dayoftheweek, starttime, endtime],res)=>{
        let sql = "INSERT INTO userschema.schedules(username, daysoftheweek, starttime, endtime) VALUES (?) ";
        let values = [username,dayoftheweek, starttime, endtime];
       // console.log(req.body.username+req.body.dayoftheweek+req.body.starttime+req.body.endtime)
       // let values = [req.body.username, req.body.dayoftheweek, req.body.starttime, req.body.endtime];
        db.query(sql, [values],(err,result)=>{
            if(err) throw err;
            console.log("No of Rows inserted into table successfully is : " +result.affectedRows);
            res(result);
        });
    },
    /* Display list of schedules FOR USER PAGE*/
    /* retrieveUserScheduleData:([id],allSchedules)=>{
        db.query("SELECT userid,daysoftheweek,starttime,endtime FROM employeeschema.schedules WHERE userid=?",id,(err,scheduleResults)=>{
            if(err) throw err;
                console.log(scheduleResults);
                allSchedules(scheduleResults);
        });
    
    }, */
    
    /* Display list of schedules FOR Home PAGE*/
    retrieveScheduleData:(allSchedules)=>{
        db.query("SELECT schedules.userid,users.firstname,users.surname,daysoftheweek,starttime,endtime FROM employeeschema.schedules LEFT JOIN employeeschema.users ON users.userid=schedules.userid ", (err,results)=>{
            if(err) throw err;
            allSchedules(results);
        });
    },
    /* Display list of schedules. */
    retrieveData: (id,allSchedules)=>{
        db.query("SELECT scheduleid,userid,daysoftheweek,starttime,endtime FROM employeeschema.schedules WHERE userid = ?",id,(err,results)=>{
            if(err) throw err;
            allSchedules(results);
        });
    },
    /* Insert schedules data to the table. */
    insertScheduleData : ([userid, dayoftheweek, starttime, endtime],res)=>{
        let sql = "INSERT INTO employeeschema.schedules(userid, daysoftheweek, starttime, endtime) VALUES (?) ";
        let values = [userid,dayoftheweek, starttime, endtime];
       // console.log(req.body.username+req.body.dayoftheweek+req.body.starttime+req.body.endtime)
       // let values = [req.body.username, req.body.dayoftheweek, req.body.starttime, req.body.endtime];
        db.query(sql, [values],(err,result)=>{
            if(err) throw err;
            console.log("No of Rows inserted into table successfully is : " +result.affectedRows);
            res(result);
        });
    },

     /* Delete user schedule from the table. */
     deleteScheduleData : (id,res)=>{
        let sql = "DELETE FROM employeeschema.schedules WHERE scheduleid=?";
       
        db.query(sql,id,(err,result)=>{
            if(err) throw err;
            console.log("No of Rows deleted from table successfully is : " +result.affectedRows);
            res(result);
        });
    },
    /* To prevent the overlap of existing schedules into the table. */
     validateSchedule: ([arg1,arg2],res)=>{
        console.log("values are:"+arg1+arg2);
        let sql ="SELECT daysoftheweek+0 from employeeschema.schedules WHERE userid=?"
        var validschedule=false;
        db.query(sql,arg1,(err,result)=>{
            if (err) throw err;
            console.log("User entered value: "+arg2);
            console.log("Value from database"+JSON.stringify(result));
            for(i=0;i<result.length;i++){
                const valfromDB=Object.values(result[i]);
                console.log("Value of objects while iterating"+i+valfromDB);
                if(arg2 == valfromDB){
                    console.log("VAlues er same")
                    validschedule=false;
                    break;
                }else{
                    console.log("VAlues er diff")
                    validschedule=true;
                }
            }
            res(Boolean(validschedule)) //;
        });
    },
    /*To validate the start time and end differnece is greater than five hours */
    validateTime: ([arg1,arg2],res)=>{
        console.log("Time values are:"+arg1+arg2);
        let sql = `SELECT TIMEDIFF("${arg2}","${arg1}")`;
        db.query(sql,(err,results)=>{
            if (err) throw err;
            console.log(Object.values(results[0]));
            res(Object.values(results[0])) ;
        });
    }
};
module.exports=schedulesmodel;