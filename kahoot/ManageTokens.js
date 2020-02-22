var https = require('https');

var smasherBot = require('./smasherBot');
var atob = require('atob');

var toDecode ="";
var xKahootToken ="";

var currentKahootId = 0;
var leftToAdd = 0;
var AddedTotal =0;

var namingMethod = 0;
var basename = "Smasher";
var answerDelay = 0;

var tokensToProcess = [];

//stopping the smash
var stopSmash = false;
var addedFirstBot = false;




module.exports = {
  Stop: function () {
    StopSmashing();
  },
  Start: function (number,id) {
    StartSmashing(number,id);
  },
  GetChallenge: function (id) {
    GetChallenge(id);
  },
  GetToDecode: function() {
      return toDecode;
  },
  SetToDecode: function(val) {
      toDecode = val;
      return toDecode;
  },
  CompleteChallenge: function(xToken, mask) {
      return CompleteChallenge(xToken, mask);
  },
  RequestAction:function() {
      RequestAction();
  }
};

function StartSmashing(number, Id) {
    baseName = "Smasher";
    namingMethod = 0;
    answerDelay=500;
    
    toDecode="";
    xKahootToken = ""
    tokensToProcess=[]
    addedFirstBot= false;
    stopSmash=false;
    AddedTotal=number
    currentKahootId= Id
    leftToAdd = number;
    GetChallenge(currentKahootId);
}

function StopSmashing() {
        stopSmash = true;
        addedFirstBot= false;
        toDecode ="";
        xKahootToken ="";
        currentKahootId = 0;
        AddedTotal=0;
        answerDelay=0;
        leftToAdd = 0;
        smasherBot.Stop();
}


function GetChallenge(id)
{ 
    https.get("https://kahoot.it/reserve/session/"+id, res => {
    res.setEncoding("utf8");
    xKahootToken = res.headers["x-kahoot-session-token"];
    console.log("---------")
    console.log(xKahootToken)
    console.log("---------")
    var body = "";
    res.on("data", data => {
        body += data;
    });
    res.on("end", () => {
        body=JSON.parse(body);
        //toDecode = (body.slice(0,-2).split('challenge":"')[1]);
        toDecode = body["challenge"];
        console.log(toDecode);
        
        });
    });
}

function CompleteChallenge(xToken, mask)
{
    mask = toByteArray(mask);
    
    var base64Array = toByteArray(atob(xToken));
    for(var i=0; i<base64Array.length; i++)
    {
        base64Array[i] ^= mask[i%mask.length];
    }
    return toStringFromBytes(base64Array);
}

function toByteArray(start)
{
    var returnArray = [];
    for(var i=0; i<start.length; i++)
    {
        returnArray.push(start.charCodeAt(i));
    }
    return returnArray;
}

function toStringFromBytes(start)
{
    var returnStr = "";
    for(var i=0; i<start.length; i++)
    {
        returnStr += String.fromCharCode(start[i])
    }
    return returnStr;
}

function RequestAction()
{
    if(stopSmash)
    {
        StopSmashing();
    }
    else if(tokensToProcess.length != 0)
    {
        if(!addedFirstBot)
        {
            addedFirstBot = true;
            
            smasherBot.Start(tokensToProcess.pop(),currentKahootId,namingMethod,baseName,answerDelay);
        }
        else
        {
            smasherBot.AddBot(tokensToProcess.pop());
        }
    }
    else if(toDecode!="")
    {
        Decoded(smasherBot.ChallengeSolve(toDecode));
        toDecode="";
    }
}

function Decoded(decodedVal)
{
    tokensToProcess.push(CompleteChallenge(xKahootToken,decodedVal));
    leftToAdd--;
    if(leftToAdd>0)
    {
        GetChallenge(currentKahootId);
    }
}