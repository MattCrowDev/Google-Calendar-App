//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString

const clientInfo = require('./keys.json');
const {google} = require('googleapis');
const {OAuth2} = google.auth;
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');


//==================================================================================//
//==================================================================================//
//==============================load the Calander api===============================//
//==================================================================================//
//==================================================================================//
//define client information from google developer console
const CLIENT_ID = clientInfo.CLIENT_ID;
const CLIENT_SECRET = clientInfo.CLIENT_SECRET;
const REDIRECT_URI = 'https://developers.google.com/oauthplayground/';
const REFRESH_TOKEN = clientInfo.REFRESH_TOKEN;
//using the google object create and populate authentication creds
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI);
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});
// Create a new calender instance.
const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })


//==================================================================================//
//==================================================================================//
//==========================load the main page and server===========================//
//==================================================================================//
//==================================================================================//
app.use(bodyParser.urlencoded(
{
  extended: false
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + 'public'));
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/public/pages/index.html'));
});
app.listen(3000, function()
{
  console.log('server is online')
})


//==================================================================================//
//==================================================================================//
//=============================Handle creating an event=============================//
//==================================================================================//
//==================================================================================//
app.post('/create_event',function(req,res)
{
  //set the variables gained from the fourm data
  //var 




//post test==================================================================================================================================
    var date = req.body.birthday;
    console.log(date)
   var username = req.body.username;
   var htmlData = 'Hello:' + username;
   res.send(htmlData);
   console.log(htmlData);


//calander test==================================================================================================================================
  
// Create a new event start date instance for temp uses in our calendar.
const eventStartTime = new Date() 
eventStartTime.setDate(eventStartTime.getDate() + 1)

// Create a new event end date instance for temp uses in our calendar.
const eventEndTime = new Date()
eventEndTime.setDate(eventEndTime.getDate() + 2)
eventEndTime.setMinutes(eventEndTime.getMinutes() + 45)
console.log(eventStartTime);
console.log(eventEndTime);
// Create a dummy event for temp uses in our calendar
const event = {
  summary: `Meeting with David`,
  location: `3595 California St, San Francisco, CA 94118`,
  description: `Meet with David to talk about the new client project and how to integrate the calendar for booking.`,
  colorId: 1,
  start: {
    dateTime: eventStartTime,
    timeZone: 'America/Denver',
  },
  end: {
    dateTime: eventEndTime,
    timeZone: 'America/Denver',
  },
}










// Check if we a busy and have an event on our calendar for the same time.
calendar.freebusy.query(
  {
    resource: {
      timeMin: eventStartTime,
      timeMax: eventEndTime,
      timeZone: 'America/Denver',
      items: [{ id: 'primary' }],
    },
  },
  (err, res) => {
    // Check for errors in our query and log them if they exist.
    if (err) return console.error('Free Busy Query Error: ', err)

    // Create an array of all events on our calendar during that time.
    const eventArr = res.data.calendars.primary.busy

    // Check if event array is empty which means we are not busy
    if (eventArr.length === 0)
      // If we are not busy create a new calendar event.
      return calendar.events.insert(
        { calendarId: 'primary', resource: event },
        err => {
          // Check for errors and log them if they exist.
          if (err) return console.error('Error Creating Calender Event:', err)
          // Else log that the event was created.
          return console.log('Calendar event successfully created.')
        }
      )

    // If event array is not empty log that we are busy.
    return console.log(`Sorry I'm busy...`)
  }
)
});






