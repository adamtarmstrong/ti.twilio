'use strict';

/***
 * @file Use Twilio SMS/MMS Client
 * @module ti.twilio
 * @author Adam Armstrong <adam.t.armstrong@icloud.com>
 * @version 1.0.0
 * @since 1.0.0
 */
var twilioPhoneNumber;
var twilioMessagesURL;
var twilioKey;
var twilioTimeout;


/**
 * @function initialize Twilio Messaging Client
 * @summary Creates an instance of Twilio Messaging Client
 * @param {string} accountsid - Twilio Account SID
 * @param {string} apisid - Twilio API Key Sid
 * @param {string} apisecret - Twilio API Key Secret
 * @param {string} twiliophonenumber - Twilio Assigned Messaging number.  Expects country code (ie. +14694164289)
 * @param {integer} timeout - Timeout duration, in millisecnds, to be used for Twilio xhr API calls
 * * @since 1.0.0
 */
exports.init = function(accountsid, apisid, apisecret, twiliophonenumber, timeout) {
	twilioPhoneNumber = twiliophonenumber;
	twilioMessagesURL = "https://api.twilio.com/2010-04-01/Accounts/" + accountsid + "/Messages";
	twilioTimeout = timeout;
	
	//TIMOB-9111:  on iOS, base64encode is adding a newline character.
	//twilioKey = Ti.Utils.base64encode(apisid+':'+apisecret);
	
	var str = apisid+':'+apisecret;
	if (/([^\u0000-\u00ff])/.test(str)) {
		throw 'String must be ASCII';
	}
	var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var o1,
		o2,
		o3,
		bits,
		h1,
		h2,
		h3,
		h4,
		e = [],
		pad = '',
		c;
	c = str.length % 3;
	// pad string to length of multiple of 3
	if (c > 0) {
		while (c++ < 3) {
			pad += '=';
			str += '\0';
		}
	}
	// note: doing padding here saves us doing special-case packing for trailing 1 or 2 chars
	for (c = 0; c < str.length; c += 3) { // pack three octets into four hexets
		o1 = str.charCodeAt(c);
		o2 = str.charCodeAt(c + 1);
		o3 = str.charCodeAt(c + 2);
		bits = o1 << 16 | o2 << 8 | o3;
		h1 = bits >> 18 & 0x3f;
		h2 = bits >> 12 & 0x3f;
		h3 = bits >> 6 & 0x3f;
		h4 = bits & 0x3f;
		// use hextets to index into code string
		e[c / 3] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
	}
	str = e.join('');
	// replace 'A's from padded nulls with '='s
	twilioKey = str.slice(0, str.length - pad.length) + pad;
};


/**
 * @function send SMS Message
 * @summary Send an SMS Message to the info provided using an instance of Twilio Messaging Client
 * @param {string} message - Message to be sent to client
 * @param {string} clientphonenumber - Twilio Assigned Messaging number.  Expects country code (ie. +14694164289)
 * @param {function} onSuccessCallback - function called onSuccess
 * @param {function} onErrorCallback - function called onError
 * @since 1.0.0
 */
exports.sendSMS = function(message, clientphonenumber, onSuccessCallback, onErrorCallback){
	var sendit = Ti.Network.createHTTPClient({
		onerror : function(e) {
				onErrorCallback(e);
		},
		timeout : twilioTimeout,
	});
	sendit.open('POST', twilioMessagesURL);
	sendit.setRequestHeader('Authorization', 'Basic ' + twilioKey);
	sendit.send({From: twilioPhoneNumber, To: clientphonenumber, Body: message} );
	
	sendit.onload = function(e) {
		if(this.status == '200') {
			onSuccessCallback(e);
		}
	};
};
