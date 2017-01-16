/**
  * Ranking.js in MINESWEEPER GAME
  * @copyright? 2016 - All Rights Reserved - Copyright ©️
  * @author: Alex Gilbert
  * @version: 1.0.0
  * @summary: Ranking Table Object
*/

var RankTable = (function(){

  function RankClass() {

    var __private__ = {
      counter:0,
      list: []
    };

    var pr = __private__
    var self = this

    //RANKING SETTINGS//

    self.clearRanking = function() {
      localStorage.clear();
      pr.list =  [];
      self.createList(6);
      self.buildTable();
    };

    self.buildTable = function() {
      var ranking = "";
      for (var i=0;i<pr.list.length;i++) {
        if(pr.list[i].playerName === "" || pr.list[i].playerScore === -1) {
          ranking += '<tr><td class=\"playerName\"></td><td class=\"playerScore\"></td></tr>';
        }
        else {
          ranking += '<tr><td class=\"playerName\">' + pr.list[i].playerName  +
          '</td><td class=\"playerScore\">' + pr.list[i].playerScore  + '</td></tr>';
        }
      }
      $("#tbodyRanking").html(ranking);
    };

    self.createList = function(number){
      for(var i = 0;i<number;i++ ) {
        pr.list.push({playerName:"", playerScore:-1});
      }
    };


    //Sort the list so the biggest number go to the first one
    self.sort = function() {
      pr.list.sort(function(a,b){
        return b.playerScore - a.playerScore
      });
    };
    //RANKING SETTINGS// END

    //BROWSER//

    //Allow the ranking to be save in the browser and still be there after refresh
    self.saveIntoBrowser = function(){
      localStorage.setItem("rankList", JSON.stringify(pr.list));
    };

    self.loadFromBrowser = function(){
      //If there's information inside localStorage then replace pr.list
      if (window.localStorage.length != 0) {
        pr.list = JSON.parse(localStorage.getItem("rankList"));
      }
    };
    //BROWSER// END

    //PLAYER INTERACTION//

    //Change the last item of the list (the lowest score) by the user score
    self.insertUserInfo = function(playerName, playerScore) {
      pr.list[pr.list.length-1].playerName = playerName
      pr.list[pr.list.length-1].playerScore = playerScore
    };

    self.userInputCheck = function(counter){
      if (counter === 0) {
        var playerName = $("#namePlayerInput").val(),
        playerScore = $("#finalScore span").text();
        if(playerName.length < 2) {
          //If the user write nothing only one character
          window.alert("Please enter a valid name of 2 characters minimum")
          //reset to counter to zero so the next user input, it will pass it to the table
          return counter = 0
        }
        else {
          self.insertUserInfo(playerName, playerScore);
          self.sort();
          self.buildTable();
        }
      }
      counter++
      //Clear the input field
      $("#namePlayerInput").val("");
      self.saveIntoBrowser();
      return counter;
    };
    //PLAYER INTERACTION// END
  };
  return RankClass;
})();

var rankTable = new RankTable()
//Build the table with the information in the browser
rankTable.createList(6);
rankTable.loadFromBrowser();
rankTable.buildTable();


//To make sure the player enter his information just once
var counter = 0
$("#rankingSubmit").click(function(){
  if (counter === 0) {
    counter = rankTable.userInputCheck(counter)
  }
});


//To press enter and the form will submit it
$('#namePlayerInput').keypress(function(event) {
  if (event.keyCode === 13 || event.which === 13) {
    if (counter === 0) {
      counter = rankTable.userInputCheck(counter)
    }
    event.preventDefault();
  };
});

$("#clearRanking").click(function(){
  rankTable.clearRanking();
});
