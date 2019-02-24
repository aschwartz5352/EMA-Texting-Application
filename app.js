var express = require('express');
var app = express();

const twilio = require('twilio');
CronJob = require('cron').CronJob;

const client = new twilio("AC6b566320e0a313e3a43da87a52c5865d", "8eccfacc557e51d1cce159ddc6ab63ba");

const twilioNumber = '+12244123742' // your twilio phone number
// const myPhoneNumber = "+18479109788"
const myPhoneNumbers = ["+18479109788", "+14844647473"]

// for(var i = 0; i < 5; i++){
//   sendMessage(i);
// }

// sendMessage(0);

myPhoneNumbers.map(number => {
  sendMessage(number);
});

function sendMessage(number){

  new CronJob('45 13 * * *', function() {
    console.log(number);
    // console.log();
    // console.log(e);
    sendM(number);
  }, null, true);


}

function sendM(number){
  const textMessage = {
      body: 'Please fill out this servey now: ' + "https://docs.google.com/forms/d/e/1FAIpQLSfnK3W8Ont58bYWz48zsvJnYpQ7LAg3_HP7kGR7Wg5vtaM5lA/viewform?vc=0&c=0&w=1",
      to: number,  // Text to this number
      from: twilioNumber // From a valid Twilio number
  }
  client.messages.create( textMessage, ( err, data ) => {
      if (err) {
         console.log(err);
     }
     console.log( data );
     // response.send("Message should be sent this time");
   });
}

// var textJob = new cronJob( '0 18 * * *', function(){
//   client.messages.create( { to:myPhoneNumber, from:twilioNumber, body:'Hello! Hope you’re having a good day!' }, function( err, data ) {});
// },  null, true);

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


//firebase functions:config:set twilio.sid="AC6b566320e0a313e3a43da87a52c5865d" twilio.token="8eccfacc557e51d1cce159ddc6ab63ba"

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//



/// Validate E164 format
function validE164(num) {
    return /^\+?[1-9]\d{1,14}$/.test(num)
}
