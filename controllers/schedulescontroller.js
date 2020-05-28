const {retrieveScheduleData,retrieveData,validateTime,insertScheduleData,deleteScheduleData,validateSchedule}= require('../model/schedulesmodel');
const {getHashedPassword,validateEmail,getUserIdAndEmail,validateUserEmail,createUser}= require('../model/usermodel');
const schedulescontroller={
     
    /*Display Login Page */
    getLoginPage:(req, res)=> {
        res.render('login');
    },
    /*Display Schedules Home Page*/
    getSchedulesPage:(req, res)=> {
        res.redirect('/schedules');
    },
    /*Verify User Details */
    verifyLogin :(req, res,next)=> {
        const {email,password}=req.body;
        const hashedPassword = getHashedPassword(password);
        console.log("Email and pwd :" + email + " "+ password)
        validateEmail(email,userdetails=>{
            if(JSON.stringify(userdetails)==='[]'){
                console.log("Account doesnot exists"+userdetails)
                res.render('login', {
                    message: 'Account doesnot exist!!Please register your account.',
                    messageClass: 'alert-danger'
                }); 
            }else{
                console.log("Account exists"+JSON.stringify(userdetails))
                if(hashedPassword == userdetails[0].password){
                    res.status('200');
                    console.log("********VALID USER")
                    const userIdValue=Object.values(userdetails[0]);
                    //res.locals.userID=userIdValue;
                    req.userID=userIdValue;
                    next(); 
                }else{
                    res.render('login', {
                    message: 'Password Mismatch!Please enter valid password.',
                    messageClass: 'alert-danger'
                }); 
                }
            }
        })
    }, 
     
    /*Verify User Details */
    /* verifyLogin :(req, res,next)=> {
        const {email,password}=req.body;
        const hashedPassword = getHashedPassword(password);
        console.log("Email and pwd :" + email + " "+ password)
        validateUser([email,hashedPassword],(userdetails)=>{
            console.log("....."+ (userdetails))
            if(JSON.stringify(userdetails)==='[]'){
                res.status('404');
                    res.render('login', {
                    message: 'Account doesnot exist/Password mismatch.Please enter valid details or register your account.',
                    messageClass: 'alert-danger'
                }); 
            }else{
                res.status('200');
                const userIdValue=Object.values(userdetails[0]);
                //res.locals.userID=userIdValue;
                req.userID=userIdValue;
                next(); 
            }
        });
    }, */
    /*Retrieve all schedules from the database*/
    retrieveAllSchedules:(req, res)=> {
        console.log("After middleware")
        retrieveScheduleData((scheduleData)=>{
            res.render('scheduleshome', {
                scheduleData, 
                schedulesLength: scheduleData.length > 0
            });
        });
    },
    /*Display UserPage */
    getUserPage:(req,res)=> {
        const {id}=req.params;
        console.log("Id value is:"+id)
        retrieveData(id,(scheduleData)=>{
            console.log("********"+scheduleData)
            getUserIdAndEmail(id,userData=>{
                console.log("********"+userData)
                res.render('user', {
                    scheduleData, 
                    userData,
                    schedulesLength: scheduleData.length > 0
                });
            })
        });
    },
    /*Display Register Form */
    getRegisterPage:(req, res)=> {
        res.render('register');
    },

    /*Register User details*/
    submitUserRegistration:(req, res) => {
        const { email, firstName,lastName, password, confirmPassword } = req.body;
       //Validations for User account
       const emailPattern="^[a-zA-Z0-9.!#$%£&'*+/=?^_`{|}~-]+@[a-zA-Z]+(\.)+([a-zA-Z]+)*$";
       const namePattern="^[a-zA-Z][a-zA-Z ]+[a-zA-Z]+$";
       const passwordPattern="^[A-Za-z0-9].{6,}"
       
       console.log("Firstname "+firstName);
       console.log("Lastname "+lastName);
       console.log("Email "+email);
       console.log("password "+password);
         if(!firstName.match(namePattern))
        {
            res.render('register', {
                message: 'Please enter Valid firstName',
                messageClass: 'alert-danger'
            });

        }else if(!lastName.match(namePattern)){
            res.render('register', {
                message: 'Please enter Valid lastname',
                messageClass: 'alert-danger'
            });

        }else if(!email.match(emailPattern))
        {
            res.render('register', {
                message: 'Please enter Valid Email',
                messageClass: 'alert-danger'
            });

        }else if(!password.match(passwordPattern))
        {
            res.render('register', {
                message: 'Password must contain at least one number and one uppercase and lowercase letter, and at least 6 or more characters!',
                messageClass: 'alert-danger'
            });
         
        }else{
            //Check if password and conform password matches
            if (password === confirmPassword) {
                // Check if user with the same email is also registered
               
                validateUserEmail([email],(result) =>{
                    console.log("result:"+result);
                    if (result > '0'){
                        res.render('register', {
                            message: 'User already registered.',
                            messageClass: 'alert-danger'
                        });
                    }
                    else{
                        const hashedPassword = getHashedPassword(password);
                        // Store user into the database 
                        createUser([lastName,firstName,email,hashedPassword],(result)=> {
                            console.log("After inserting no of Rows inserted into table successfully is : " +result.affectedRows);
                            res.render('login', {
                                message: 'Registration Complete. Please login to continue.',
                                messageClass: 'alert-success'
                            });
                        });
                    }
                });
                
            }else {
                res.render('register', {
                    message: 'Password does not match.',
                    messageClass: 'alert-danger'
                });
            }
        }
    },
    /* Display form to create schedules and display it. */
    createandlistAllSchedules:(req,res) =>{
        retrieveData(req.id,(scheduleData)=>{
            console.log("********"+scheduleData)
            res.render('schedulesManagement', {
                title:'Schedule Management of Users',
                scheduleData, 
                schedulesLength: scheduleData.length > 0
            });
        });
    },
    
    
    /*To submit the form values and create a new entry in the databse.*/
    submitNewSchedule :(req,res)=>{
        console.log("User id from request"+req.id[0]);
        console.log("Schedule value entered by user"+req.body.dayoftheweek)
        /*Validate the schedule and time differnce is greater than 5 hours.*/
        validateSchedule([req.id[0],req.body.dayoftheweek],resvalue=>{
            console.log("£££££££££££"+resvalue[0])
            console.log("&&&&&&&&&"+resvalue);
            if(resvalue){
                validateTime([req.body.starttime,req.body.endtime],(result)=>{
                    // console.log("Object values are:"+Object.values(result[0]));
                    if(result>='05:00:00'){
                        console.log("Values are "+req.params.id +req.body.dayoftheweek+req.body.starttime+req.body.endtime)
                        insertScheduleData([req.id[0], req.body.dayoftheweek, req.body.starttime, req.body.endtime],(result)=> {
                            console.log("After inserting no of Rows inserted into table successfully is : " +result.affectedRows);
                            res.redirect('/schedulesMng');
                        });
                    }else{
                        console.log("LEsser than 5 hours");
                        retrieveData([req.id[0]],(scheduleData)=>{
                            res.render('schedulesManagement',
                            {   scheduleData, 
                                schedulesLength: scheduleData.length > 0,
                                message:'Please specify valid shift timings OF 5 hrs.',
                                messageClass:'alert-danger'
                            });
                        });
                        
                    }
                });        
            }
            else{
                retrieveData([req.id[0]],(scheduleData)=>{
                    console.log("********"+scheduleData)
                    res.render('schedulesManagement', {
                        title:'Schedule Management of Users',
                        scheduleData, 
                        schedulesLength: scheduleData.length > 0,
                        message:'Overlap of existing Schedule!!Please enter a valid Schedule.',
                        messageClass:'alert-danger'
                    });
                }); 
            }
        });
    },
                 
        
            
        /* validateTime([req.body.starttime,req.body.endtime],(result)=>{
           // console.log("Object values are:"+Object.values(result[0]));
            if(result>='05:00:00'){b mn
               console.log("Values are "+req.params.id +req.body.dayoftheweek+req.body.starttime+req.body.endtime)
                insertScheduleData([req.id, req.body.dayoftheweek, req.body.starttime, req.body.endtime],(result)=> {
                console.log("After inserting no of Rows inserted into table successfully is : " +result.affectedRows);
                res.redirect('/schedulesMng');
                });
            }else{
                console.log("LEsser than 5 hours");
                res.render('schedulesManagement',
                {
                    msg:'Please specify valid shift timings OF 5 hrs.'
                });
            }      
        }); */
    
    
    deleteUserSchedule:(req,res) =>{
        const {id}=req.params;
        deleteScheduleData(id,(result)=>{
            //console.log("********"+scheduleData)
            res.redirect('/schedulesMng');
            /* res.render('schedulesManagement', {
                title:'Schedule Management of Users',
                scheduleData, 
                schedulesLength: scheduleData.length > 0
            }); */
        });
    },
};
module.exports=schedulescontroller;