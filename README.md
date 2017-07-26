# Ti.Twillio
Cross-Platform common.js library for using Twillio SMS Services

### Requirements
- [x] Axway Titanium SDK
- [x] Twillio Account. (You can get started with $15 of free credit for dev/test)
  - Twillio 'Account SID'  (Two environments will get created: 'LIVE' and 'TEST')
  - Twillio 'Phone #'  (for 'LIVE' you pick your own free number.  for 'TEST' you must use '+15005550006')
- [x] Twillio REST API (https://www.twilio.com/console/video/dev-tools/api-keys)
  - Twillio 'API SID'
  - Twillio 'API Secret'
  
### Usage
Copy /lib/ti.twillio.js to your /lib folder
  
  
  #### Add Module and initialize
  * AccountSID, APISID, & APISecret = All {strings} from your Twillio Account
  * timeout = {integer} to define API timeout in milliseconds
  * FROM_PhoneNumber = {string} in E.164 format of phone # to send message FROM (ie. +15005550006')
  > **NOTE**: passed in must match the API Key Environment (as mentioned above)
  ```javascript
  var twillioClient = require('ti.twillio');
  twillioClient.init('AccountSID', 'APISID', 'APISecret', 'FROM_PhoneNumber', timeout);
  ```
  
  #### Send SMS Message
  * Message = {string} message to send to user
  * TO_PhoneNumber = {string} in E.164 format of client phone # to send message TO (ie. +146921439389')
  * successCallback = {function} to execute upon success
  * failureCallback = {function} to execute upon failure
  ```javascript
  twillioClient.sendSMS(Message, TO_PhoneNumber, successCallback, failureCallback);
  ```


### Example
//index.js
```javascript
var twillioClient = require('ti.twillio');
twillioClient.init('AABBCCDDEEFF1122334455', 'GGHHIIJJKK6677889900', 'LLMMNNOOPPQQ22446688', '+5005550006', 6000);
function testSMS(){
	twillioClient.sendSMS('Test SMS Message', '+14692143989', successCallback, failureCallback);
}

function successCallback(e){
	alert("Success") + JSON.stringify(e);
}
function failureCallback(e){
	alert("Opps....something went wrong\n" + JSON.stringify(e));
}
```
