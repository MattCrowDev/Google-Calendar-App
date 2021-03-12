//npm run devStart
const clientInfo = require('./keys.json');
const {google} = require('googleapis');
const {OAuth2} = google.auth;
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { time } = require('console');


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
//=========================load the main pages and server===========================//
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
app.get('/new-event',function(req,res){
  res.sendFile(path.join(__dirname+'/public/pages/new-event.html'));
});

//404
app.get('*', function(req, res){
  res.sendFile(path.join(__dirname+'/public/pages/404.html'));
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
app.post('/new-event-confirm',function(req,res)
{
  //set the variables gained from the fourm data
  var summary = req.body.summary,
  location = req.body.location,
  description = req.body.description,
  colorId = req.body.colorId,
  startDate = req.body.startDate,
  startTime = req.body.startTime,
  endDate = req.body.endDate,
  endTime = req.body.endTime,
  timezone = req.body.timezone;

  //-----------------------------------------------------------------------// 
  //------------------------create the actual event------------------------// 
  //-----------------------------------------------------------------------//
  //set a start date
  const eventStartTime = new Date(startDate + ' ' + startTime + ' GMT') 
  //Set an end date
  const eventEndTime = new Date(endDate + ' ' + endTime + ' GMT')
  const event = 
  {
    summary: summary,
    location: location,
    description: description,
    colorId: colorId,
    start: 
    {
      dateTime: eventStartTime,
      timeZone: timezone,
    },
    end: 
    {
      dateTime: eventEndTime,
      timeZone: timezone,
    },
  }
  //Check if the calander already has an event planned
  calendar.freebusy.query(
    {
      resource: 
      {
        timeMin: eventStartTime,
        timeMax: eventEndTime,
        timeZone: 'America/Denver',
        items: [{ id: 'primary' }],
      },
    },
    (err, res) => 
    {
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
  //load the confirmation page
  res.sendFile(__dirname + '/public/pages/new-event-confirm.html');
});






