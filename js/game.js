/**
  * Game.js in MINESWEEPER GAME
  * @copyright? 2016 - All Rights Reserved - Copyright ©️
  * @author: Alex Gilbert
  * @version: 1.0.0
  * @summary: Game Object
*/

var game = (function(){

  function GameManager() {

    var __private__ = {
      board: new CreatingBoard(),
      timer: new Timer(),
      difficultyMode: 2,
      isPause: false
    };

    var pr = __private__,
        self = this

    //GAME SETTINGS//

    self.init = function() {
      pr.board = new CreatingBoard();
      pr.board.checkDifficulty(pr.difficultyMode);
      pr.timer.update();
      pr.timer.reset();
      pr.board.drawTable();
      pr.board.reset();
      pr.board.setSound();
      self.firstClick();
    };

    self.togglePause = function() {
      pr.isPause = !pr.isPause
      $(".square").toggleClass("pauseTableTd");
      $("#tableContainer").toggleClass("pauseTable");
    };

    self.checkDifficulty = function(input) {
      pr.difficultyMode = input
      pr.board.checkDifficulty(input);
    };

    //GAME SETTINGS// END

    //PLAYER INTERACTION//

    self.firstClick = function(){
      $("#myTable tbody").one("click",function() {
        pr.board.createMine();
        pr.board.score(false);
        pr.timer.start();
        pr.board.createGold();
      });
      self.playerClick();
    };

    self.playerClick = function() {
      if(!pr.isPause) {
        $(".startButtonEnd").click(function(){
          pr.board.stopSound();
          $("#gameEnd").fadeOut();
          $("#gameDiv").delay(700).fadeIn();
          pr.board.reset();
          game.init();
        });
        $(".square").contextmenu(function() {
          pr.board.toggleFlag($(this).data("row"),$(this).data("col"));
        });

      //Handle the click on cell of the game
      $(".square").on("click", function() {
        if ($("#flags span").text() >= 0) {
          pr.board.playerClick($(this).data("row"),$(this).data("col"))
        }
        $("td").mousedown(function(e) {
          var row = $(this).data("row")
          var col = $(this).data("col")
          var hasGold = $(this).hasClass("gold")

          clearTimeout(self.downTimer);

          self.downTimer = setTimeout(function() {
            if (hasGold) {
              $(this).addClass("scorePopUp");
              pr.board.toggleGold(row,col)}
          }, 1500)
        }).mouseup(function(e) {
        clearTimeout(self.downTimer);
        });

        });

        //Play game to change the button and also play the game
        $("#playButton").on("click", function() {
          $('#pauseButton').toggleClass('hideButton');
          $('#playButton').toggleClass('hideButton');
          pr.timer.start();
          self.togglePause();
          pr.board.score(false);
        });

        //Pause game function to change the button and also pause the game
        $("#pauseButton").on("click", function() {
          $('#pauseButton').toggleClass('hideButton');
          $('#playButton').toggleClass('hideButton');
          pr.timer.pause();
          self.togglePause();
          pr.board.score(true);
        });

        $("#restartButton").on("click", function() {
          //Handle if the user click on restart during a paused game
          if(pr.isPause) {
            self.togglePause();
          }
          //Reset
          pr.board.reset();
          self.init();
        });

        //When the button how to play is click, display none the gameScreen
        //but display block the how to play Screen
        $('#howToPlayButton').on("click", function(){
          $("#gameDiv").hide();
          $("#howToPlayDiv").show();
          $(".difficultyChoose").removeClass("difficultyChoose")
          pr.board.reset();
          self.init();
        });

      };
    };
    //PLAYER INTERACTION// END

  };
  return new GameManager();
})();

$(document).ready(function(){
  $("#difficultyMode span").click(function(){
    $(".difficultyChoose").removeClass("difficultyChoose")
    $(this).toggleClass("difficultyChoose");
    game.checkDifficulty($(this).data("num"));
  });

  $("#splashScreenDiv").delay(2700).fadeOut();
  $("#howToPlayDiv").delay(3500).fadeIn();

  $("#startButton").click(function(){
    $("#howToPlayDiv").delay(300).hide();
    $("#gameDiv").show();
    game.init();
  });
});
