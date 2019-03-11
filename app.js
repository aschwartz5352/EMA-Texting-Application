var express = require('express');
CronJob = require('cron').CronJob;
const csv=require('csvtojson')
const twilio = require('twilio');
// const clientProperties = require('properties.js');


var app = express();

const twilioNumber = '+12244123742' // your twilio phone number
const client = new twilio("AC6b566320e0a313e3a43da87a52c5865d", "8eccfacc557e51d1cce159ddc6ab63ba");
 



// "+14844647473"

const surveyA = "https://goo.gl/forms/EqrRv2KAUDq9ykXo1";
const surveyB = "https://goo.gl/forms/2LIq5vbGNOY6SML02";


var participants = [];
console.log("Running");

const csvFilePath='./Test_Info_CSV.csv'
csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{
    if(jsonObj.length >= 2 && validateExcelColumns(jsonObj[0])){
      
      for(var i = 1; i < jsonObj.length; i++){
        if(jsonObj[i]['Subject ID #'] != ''){
          parseTime(jsonObj[i], 'Text 1 (Survey A)');
          parseTime(jsonObj[i], 'Text 2 (Survey A)');
          parseTime(jsonObj[i], 'Text 3 (Survey A)');
          parseTime(jsonObj[i], 'Text 4 (Survey A)');
          parseTime(jsonObj[i], 'Text 5 (Survey A)');
          parseTime(jsonObj[i], 'Text 6 (Survey B)');
          jsonObj[i]['Phone #'] = convertPhoneNumber(jsonObj[i]['Phone #'])
          participants.push(jsonObj[i]);
        }
      }

      participants.map(person => {
        console.log(person);
        
        createCron(Object.assign({}, person), 'Text 1 (Survey A)', surveyA);
        createCron(Object.assign({}, person), 'Text 2 (Survey A)', surveyA);
        createCron(Object.assign({}, person), 'Text 3 (Survey A)', surveyA);
        createCron(Object.assign({}, person), 'Text 4 (Survey A)', surveyA);
        createCron(Object.assign({}, person), 'Text 5 (Survey A)', surveyA);
        createCron(Object.assign({}, person), 'Text 6 (Survey B)', surveyB);
      });
    }else{
      console.log("Failed to run server: check excel column titles");
    }
    // console.log(participants);

});

function validateExcelColumns(columns){
  var neededKeys = ["Phone #",
                    "Text 1 (Survey A)",
                    "Text 2 (Survey A)",
                    "Text 3 (Survey A)",
                    "Text 4 (Survey A)",
                    "Text 5 (Survey A)",
                    "Text 6 (Survey B)",
                    ];
  
  var foundKeys = neededKeys.filter(key => {
    if(columns[key] != ''){
      console.log("Missing or misspelled colunm: (" + key + ")");
      return false;
    }
    return true;
  });
  
  return foundKeys.length == neededKeys.length;
}

//Creates cronJon to send
function createCron(person, surveyDesc, surveyLink){
  console.log(person[surveyDesc]);
  var c = new CronJob(person[surveyDesc], function() {
    console.log(`Sending ${surveyDesc} to ${person['Participants Names']}` );
    // sendMessage(person['Phone #'], person['Participants Names'] + " : " + surveyLink);
  }, null, true);
}

//converts time format 'HH:MM' -> 'MM 24HH * * *''
function parseTime(data, key){
  var time = data[key];

  var vals = time.split(":");
  vals[0] = parseInt(vals[0]);
  vals[1] = parseInt(vals[1]);
  if(time.includes("am")){
    data[key] = vals[1] + " " + vals[0] + ' * * *';
  }else{
    data[key] = vals[1] + " " + ((vals[0]+12)%24) + ' * * *';
  }
}


function convertPhoneNumber(number){
  return "+1" + number.replace(/-/g, '');
}

function sendMessage(number, link){
  const textMessage = {
      body: 'Please fill out this servey now: ' + link,
      to: number,  // Text to this number
      from: twilioNumber // From a valid Twilio number
  }
  console.log(textMessage);
  client.messages.create( textMessage, ( err, data ) => {
      if (err) {
         console.log(err);
     }
    console.log( "message sent" );
     // response.send("Message should be sent this time");
   });
}


app.get('/', function (req, response) {


  response.send('HServer is running');
});


app.listen(3000, function () {
  console.log('Application listening on port 3000');
});


/// Validate E164 format
function validE164(num) {
    return /^\+?[1-9]\d{1,14}$/.test(num)
}
