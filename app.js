var express = require('express');
var app = express();

const twilio = require('twilio');
CronJob = require('cron').CronJob;

const client = new twilio("AC6b566320e0a313e3a43da87a52c5865d", "8eccfacc557e51d1cce159ddc6ab63ba");

const twilioNumber = '+12244123742' // your twilio phone number
// const myPhoneNumber = "+18479109788"
// const myPhoneNumbers = ["+18479109788", "+14844647473"]
const myPhoneNumbers = ["+18479109788"]

// myPhoneNumbers.map(number => {
//   sendMessage(number);
// });

// const csvtojsonV1=require("csvtojson/v1");
var participants = [];
// const csvFilePath='Demo_info_CSV.csv'
const csvFilePath='Test_info_CSV.csv'
const csv=require('csvtojson')
csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{
    if(jsonObj.length >= 2){
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
      // console.log(participants);
      participants.map(person => {
        console.log(person);
        // sendMessage("+18479109788",
        //             person['Text 1 (Survey A)'],
        //             surveyA);

        abc(Object.assign({}, person), 'Text 1 (Survey A)', surveyA);
        abc(Object.assign({}, person), 'Text 2 (Survey A)', surveyA);
        abc(Object.assign({}, person), 'Text 3 (Survey A)', surveyA);
        abc(Object.assign({}, person), 'Text 4 (Survey A)', surveyA);
        abc(Object.assign({}, person), 'Text 5 (Survey A)', surveyA);
        abc(Object.assign({}, person), 'Text 6 (Survey B)', surveyB);
        // sendMessage(person['Phone #'], person['Text 2 (Survey A)'], surveyA);
        // sendMessage(person['Phone #'], surveyA);
        // sendMessage(person['Phone #'], surveyA);
        // sendMessage(person['Phone #'], surveyA);
        // sendMessage(person['Phone #'], surveyB);
      });
    }
    // console.log(participants);

});

const surveyA = "https://goo.gl/forms/EqrRv2KAUDq9ykXo1";
const surveyB = "https://goo.gl/forms/2LIq5vbGNOY6SML02";

function abc(person, time, survey){
  console.log(person[time]);
  var c = new CronJob(person[time], function() {
    console.log("XXXXX");
    sendM(person['Phone #'], person['Participants Names'] + " : " + survey);
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
// const participants = {
//   subjectId: "Demo_001",
//   name: Natalie Saeger
//
// }



function sendMessage(number, time, link){
// time = '54 21 * * *'
console.log("Sending Message")
console.log(number);
console.log(time);
console.log(link);
var n = Object.assign("", number);
  var c = new CronJob(Object.assign("", time), function() {
    // console.log(number);
    // console.log(Object.assign("", number));
    sendM(n, "asf");
  }, null, true);
}

function sendM(number, link){
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
     console.log( data );
     // response.send("Message should be sent this time");
   });
}


app.get('/', function (req, response) {
  // const phoneNumber = "+18477496918"
  // const phoneNumber = "+12244251963"

  // if ( !validE164(phoneNumber) ) {
  //   response.send("bad number");
  //     // throw new Error('number must be E164 format!')
  // }

  const textMessage = {
      body: `Hello testing:`,
      to: myPhoneNumber,  // Text to this number
      from: twilioNumber // From a valid Twilio number
  }
  client.messages.create( textMessage, ( err, data ) => {
      if (err) {
         console.log(err);
     }
     console.log( data );
     // response.send("Message should be sent this time");
   });

  response.send('Hello World!12345');
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


/// Validate E164 format
function validE164(num) {
    return /^\+?[1-9]\d{1,14}$/.test(num)
}
