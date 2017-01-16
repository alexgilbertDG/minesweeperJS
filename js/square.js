/**
  * Square.js in MINESWEEPER GAME
  * @copyright? 2016 - All Rights Reserved - Copyright ©️
  * @author: Alex Gilbert
  * @version: 1.0.0
  * @summary: Square Object
*/

var Square = (function(){

  function SquareClass( aRow, aCol ) {

    var __private__ = {
      hasMine: false,
      revealed: false,
      hasFlag: false,
      hasGold:false,
      surroundingMineCount: 0,
      location: {
        row: aRow,
        col: aCol
      }
    };

    var pr = __private__
    var self = this
    var cell = '[data-row=\"'+ pr.location.row +'\"][data-col=\"' + pr.location.col + '\"]'

    //RETURN METHODS//

    self.returnGold = function() {
      return pr.hasGold;
    };

    self.returnMine =  function() {
      return pr.hasMine;
    };

    self.returnAround =  function() {
      return pr.surroundingMineCount;
    };

    self.returnReveal = function() {
      return pr.revealed;
    };

    self.returnReveal = function() {
      return pr.revealed;
    };

    self.returnFlag = function() {
      return pr.hasFlag;
    };
    //RETURN METHODS// END

    //SET METHODS//

    self.addNumber = function (){
      pr.surroundingMineCount++
    };

    //Reveal the square + add number if number there's
    self.reveal = function() {
      pr.revealed = true
      $(cell).addClass("reveal")
      if (pr.surroundingMineCount > 0 && !pr.hasMine) {
        $(cell).html(pr.surroundingMineCount).addClass("n" + pr.surroundingMineCount)
      }
    };

    self.toggleGold = function() {
      pr.hasGold = !pr.hasGold
      if (pr.revealed) {
        //Remove the number so the gold won't have a number in their square
        pr.surroundingMineCount = 0
        $(cell).html(" ").toggleClass("gold")
      }
    };

    self.toggleMine = function() {
      pr.hasMine = !pr.hasMine
    };

    self.hasMineAndFlag = function() {
      if (pr.hasMine && pr.hasFlag) {
        return true;
      }
      else {
        return false
      }
    };

    self.toggleFlag = function(){
      pr.hasFlag = !pr.hasFlag
      if(pr.hasFlag){
        $(cell).addClass("flag");
      }
      else {
        $(cell).removeClass("flag");
      }
    };
    //SET METHODS// END

  };
  return SquareClass;
})();
