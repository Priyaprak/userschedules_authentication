const express = require('express');
const nodemailer = require("nodemailer");
const router = express.Router();
const {getLoginPage,verifyLogin,retrieveAllSchedules,getSchedulesPage,getUserPage,getRegisterPage,submitUserRegistration,submitNewSchedule,createandlistAllSchedules,deleteUserSchedule}= require('../controllers/schedulescontroller');
const cookieParser = require('cookie-parser');
const {verifyAuthToken,setAuthToken,unsetAuthToken}= require('../routes/auth');

/*Display Home page*/
router.get('/login', getLoginPage);

/*Display SchedulesHome page*/
router.post('/login',[verifyLogin,setAuthToken],getSchedulesPage);

/*Display Schedules Home Page*/
router.get('/schedules', verifyAuthToken,retrieveAllSchedules);
/*Display respective User Page*/
router.get('/user/:id',verifyAuthToken, getUserPage);

/* Display the schedule form and list of schedules. */
router.get('/schedulesMng',verifyAuthToken,createandlistAllSchedules);

/*To submit the form values and create a new entry in the databse.*/
router.post('/new',verifyAuthToken,submitNewSchedule);  

/*Display Register page*/
router.get('/register',getRegisterPage);

/*Submits User details*/
router.post('/register',submitUserRegistration);
 /*Delete the schedule*/
 router.get('/delete/:id',deleteUserSchedule);
/* Log out user and display login page. */  
router.get('/logout', verifyAuthToken,unsetAuthToken);

module.exports = router;
