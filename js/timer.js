/**
  * Timer.js in MINESWEEPER GAME
  * @copyright? 2016 - All Rights Reserved - Copyright ©️
  * @author: Alex Gilbert
  * @version: 1.0.0
  * @summary: Timer Object
*/

var Timer = (function(){

  function CreateTimer() {

    var __private__ = {
      sec: 0,
      min: 0,
      counter: undefined,
      timer: $('#timer')
    };

    var pr = __private__
    var self = this

    //TIMER SETTINGS//

    self.formatTimer = function(addSecBool) {
      var newTime = '';
      //Divide each 60 sec to minutes
      if (Math.floor(pr.sec / 60) > 0) {
        pr.sec = 0
        pr.min++
      }
      if (pr.sec < 10) {
        newTime = pr.min + ':0' + pr.sec;
      } else {
        newTime = pr.min + ':' + pr.sec;
      }

      //I create a boolean so I can format the timer without adding a second
      if (addSecBool) {
        pr.sec++
      }

      //User feedback
      if (pr.min === 19 && pr.sec === 59) {
        window.alert("Are you sleeping or you want zero points ? ")
      };

      return newTime;
    };
    //TIMER SETTINGS// END

    //CHANGING STATE//

    //Update the timer html with the current time with add a second
    self.update = function() {
      pr.timer.html(self.formatTimer(true))
    };

    self.start = function() {
      //Set the counter that will add a sec each 1000ms-1sec
      pr.counter = setInterval(self.update, 1000);
    };

    self.pause = function() {
      clearInterval(pr.counter);
      //Update the timer html with the current time without adding a second
      pr.timer.html(self.formatTimer(false))
    };

    self.reset = function() {
      clearInterval(pr.counter);
      pr.sec = 0;
      pr.min = 0;
      //Update the timer html with the current time without adding a second
      pr.timer.html(self.formatTimer(false))
    };
    //CHANGING STATE// END

  };

  return CreateTimer;
})();
