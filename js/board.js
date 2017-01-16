/**
  * Board.js in MINESWEEPER GAME
  * @copyright? 2016 - All Rights Reserved - Copyright ©️
  * @author: Alex Gilbert
  * @version: 1.0.0
  * @summary: Board Object
*/

var CreatingBoard = (function(){

  function CreateBoard() {

    var __private__ = {
      DIFFICULTYMODE: 2,
      NUMOFMINES: 5,
      NUMOFGOLD: 2,
      BOARDSIZE:8,
      numOfFlags: 5,
      score: 10000,
      scoreInterval: undefined,
      sound:{},
      mineLocation: [],
      checkAroundArray: [[0, 0],[-1, -1], [-1, 0], [0, -1], [1, 1], [1, 0], [0, 1], [1, -1], [-1, 1]],
      playerClick: [],
      allSquare: {},
      random: function(){return Math.floor(Math.random() * pr.BOARDSIZE)}
    };

    var pr = __private__
    var self = this;

    //BOARD SETTINGS//

    self.reset = function(){
      clearInterval(pr.scoreInterval)
      pr.score = 10000
      $("#score span").html("")
      pr.score = Math.floor(pr.score*pr.NUMOFMINES/pr.BOARDSIZE)
    };

    self.stopSound = function(){
      pr.sound.winSound.stop()
    };

    self.setSound = function(){
      pr.sound.winSound = new buzz.sound("./sounds/win.wav");
      pr.sound.bombSound = new buzz.sound("./sounds/bomb.wav");
      pr.sound.clickSound = new buzz.sound("./sounds/click.wav");
    };

    self.checkDifficulty = function(input) {
      pr.DIFFICULTYMODE = input
      switch (pr.DIFFICULTYMODE) {
        case 1:
        pr.BOARDSIZE = 8, pr.NUMOFMINES = 10, pr.NUMOFGOLD = 2;
        break;
        case 2:
        pr.BOARDSIZE = 15, pr.NUMOFMINES = 25, pr.NUMOFGOLD = 5;
        break;
        case 3:
        pr.BOARDSIZE = 20, pr.NUMOFMINES = 50, pr.NUMOFGOLD = 10;
        break;
        case 4:
        pr.BOARDSIZE = 20, pr.NUMOFMINES = 100, pr.NUMOFGOLD = 15;
        break;
      }

      pr.numOfFlags = pr.NUMOFMINES;
      $("#flags span").text(pr.numOfFlags);
      //Initialze the score depend on the settings
      pr.score = Math.floor(pr.score*pr.NUMOFMINES/pr.BOARDSIZE)
    };

    self.score = function(pauseBool) {
      if (!pauseBool) {
        $("#score span").html(pr.score)
        //Each second update the score
        pr.scoreInterval = setInterval(function(){
          //The more the player click, the more the score go down
          pr.score -= pr.playerClick.length*3
          pr.score -=10
          $("#score span").html(pr.score)
          //Dont go below 0 and stop the interval
          if (pr.score<0) {
            clearInterval(pr.scoreInterval)
            pr.score = 0
            $("#score span").html("0")
          }
        }, 1000)
      }
      else {
        clearInterval(pr.scoreInterval);
        $("#score span").html(pr.score)
      }
    };

    self.drawTable = function() {
      var htmlString = ''
      for (var curRow = 0; curRow < pr.BOARDSIZE; curRow++) {
        htmlString += '<tr>';
        for (var curCol = 0; curCol < pr.BOARDSIZE; curCol++) {
          pr.allSquare[[curRow, curCol]] = new Square(curRow, curCol)
          htmlString += '<td class=\"square\" data-row=\"' +
          curRow + '\" data-col=\"' + curCol + '\">&nbsp;</td>';
        }
        htmlString += '</tr>';
      }
      $("#myTable").html(htmlString);
      //more browser consistency than using vh in the css
      var sizeTable = ($(document).height()/ 10)*0.44
      var squareSize = sizeTable / pr.BOARDSIZE
      $("#tableContainer").css({"width": sizeTable + "rem",
      "height": sizeTable + "rem"});
      $(".square").css({"font-size": (squareSize*0.4) + "rem"});
    };
    //BOARD SETTINGS// END

    //PLAYER INTERACTION//

    self.playerClick = function(playerClickRow, playerClickCol) {
      var cell = pr.allSquare[[playerClickRow,playerClickCol]]
      var mineAroundCell = cell.returnAround();
      pr.playerClick.push([playerClickRow,playerClickCol]);
      pr.sound.clickSound.play();

      if (cell.returnMine()) {
        self.gameOver();
      }
      //if cell contain flag or mine, do nothing
      else if (cell.returnFlag() || cell.returnGold()) {
        return;
      }
      //Reveal around
      else if(mineAroundCell===0 && !cell.returnMine()) {
        if(pr.playerClick.length > 1 ) {
          self.revealSquare(playerClickRow, playerClickCol)
        }
      }
      //Just reveal yourself
      else {
        cell.reveal();
      }

    };

    //When the player click on the gold
    self.toggleGold = function(row,col){
      if (pr.allSquare[[row,col]].returnGold()) {
        pr.allSquare[[row,col]].toggleGold()
        $("#score").toggleClass("scorePopUp")
        //Jquery dont work on this, that why I went to pure JS
        //$("#score").delay(1100).toggleClass("scorePopUp");
        setTimeout(function(){$("#score").toggleClass("scorePopUp")}, 1000);
        pr.score += 2500
      }
    };

    //Toggle flag, also check if the player win
    self.toggleFlag = function(row,col){
      //cant go below 0
      if (pr.numOfFlags === 0) {
        if (pr.allSquare[[row,col]].returnFlag()){
          pr.allSquare[[row,col]].toggleFlag();
          pr.numOfFlags++;
          $("#flags span").text(pr.numOfFlags);
        }
        //return;
      }

      else {
      //if its not the first click
      if (pr.playerClick.length>0) {
        var reveal = pr.allSquare[[row,col]].returnReveal();
        if(!reveal){
          pr.allSquare[[row,col]].toggleFlag()
          var hasFlag = pr.allSquare[[row,col]].returnFlag()

          if(!hasFlag){
            pr.numOfFlags++;
          } else {
            pr.numOfFlags--;
          }

        }
        $("#flags span").text(pr.numOfFlags);
        self.doPlayerWin();
      }
    }
    };

   self.doPlayerWin = function(){
      var complete = 0;
      for(var i=0;i<pr.mineLocation.length;i++){
        var row = pr.mineLocation[i][0],
        col = pr.mineLocation[i][1]
        if (pr.allSquare[[row,col]].hasMineAndFlag()) {
          complete++
        }
      }
      if(complete === pr.NUMOFMINES && pr.numOfFlags ===0 ) {
        self.gameWin();
      }
    };
    //PLAYER INTERACTION// END

    //GAME STATE//

    self.gameWin = function() {
      pr.sound.winSound.loop().play().fadeIn();
      $("#finalScore span").html(pr.score)
      $("#gameDiv").delay(300).fadeOut();
      $("#gameEnd").delay(700).fadeIn();
      $("#gameWin").show();
      $("#gameLose").hide();
    };

    self.gameOver = function() {
      self.bombExplosion();
      $("#gameDiv").delay(1800).fadeOut();
      $("#gameEnd").delay(2200).fadeIn();
      $("#gameWin").hide();
      $("#gameLose").show();
    };

    self.bombExplosion = function() {
        pr.sound.bombSound.play();
        //Thats why I have a mineLocation array, I just have to loop through mineLocation
        //instead of calling all the square and know if they are a mine
        for (var i = 0; i<pr.mineLocation.length; i++) {
          $('[data-row=\"'+ pr.mineLocation[i][0] +'\"][data-col=\"' +
          pr.mineLocation[i][1] + '\"]').addClass("explosion")
        }
    };
    //GAME STATE// END

    //CREATE GAME ITEM//

    self.checkAround = function(centerRow, centerCol) {
      var aroundArray = [];
      for (var i =0;i<pr.checkAroundArray.length;i++) {
        var row = pr.checkAroundArray[i][0]+centerRow
        var col = pr.checkAroundArray[i][1]+centerCol
        //Make sur it not output a non-existent cell
        if (row<0 || row>pr.BOARDSIZE-1 ||
           col<0 || col>pr.BOARDSIZE-1) {
             continue;
          }
        aroundArray.push([row, col]);
      }
      return aroundArray;
    };

    self.createMine = function() {
      //Array of all the position to not put a mine, starting with the player first click position
      var minesLeft = pr.NUMOFMINES
      var excludeArray = self.checkAround(pr.playerClick[0][0], pr.playerClick[0][1]);

      do {
        minesLeft--;
        //Select a random place in the table for that mine
        var rRow = pr.random(), rCol = pr.random()
        for (var i =0;i<excludeArray.length;i++) {
          while(rRow === excludeArray[i][0] && rCol === excludeArray[i][1]) {
            rRow = pr.random(), rCol = pr.random()
            //Reset to 0 so the for loop will restart from the beginning
            i=0
          }
        }
        //Add this mine number into exclude so no mine over each other
        excludeArray.push([rRow, rCol])
        pr.mineLocation.push([rRow, rCol])
        pr.allSquare[[rRow, rCol]].toggleMine();
        self.addNumberAround(rRow, rCol);
      } while (minesLeft > 0);
      //To reveal around, starting from the player first click
      self.revealSquare((pr.playerClick[pr.playerClick.length-1][0]),
      (pr.playerClick[pr.playerClick.length-1][1]));
    };

    self.addNumberAround = function(rRow, rCol){
      var aArray = self.checkAround(rRow, rCol);
      for (var i =0;i<aArray.length;i++) {
        pr.allSquare[[aArray[i][0], aArray[i][1]]].addNumber();
      }
    };

    self.revealSquare = function(row, col) {
      var checkList = [[row,col]]
      while (checkList.length>0) {
        //check around the first item and pass it as aArray
        var aArray = self.checkAround(checkList[0][0], checkList[0][1])
        pr.allSquare[[checkList[0][0],checkList[0][1]]].reveal();

        for (var i =0; i<aArray.length; i++) {
          var cell = pr.allSquare[[aArray[i][0], aArray[i][1]]];
          //Make sur the reveal method will not check a non-existent cell
            if(cell.returnReveal()) {
              continue;
            }
            else if(cell.returnAround() > 0) {
              cell.reveal();
              continue;
            }
            else if (cell.returnAround() === 0 && !cell.returnMine()) {
              cell.reveal();
              //Put this square inside the array that will check around again
              checkList.push([aArray[i][0],aArray[i][1]]);
            }
          }
          //Remove first item of the list
          checkList.shift();
        }
      };

      //Place gold randomly in the map
      self.createGold = function(){
        var numOfGoldTemp = pr.NUMOFGOLD
        while(numOfGoldTemp > 0) {
          do {
            var rRow = pr.random(), rCol = pr.random()
            var hasGold = pr.allSquare[[rRow, rCol]].returnGold()
            var hasMine = pr.allSquare[[rRow, rCol]].returnMine()
            var around = pr.allSquare[[rRow, rCol]].returnAround()

          } while(hasGold || hasMine || around>1)

          pr.allSquare[[rRow, rCol]].toggleGold()
          numOfGoldTemp--
        }
      };
      //CREATE GAME ITEM// END

    };

  return CreateBoard;
})();
