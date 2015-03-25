var tiles = 6;
var tileWidth = 50;
var tileMargin = 1;
var words = ["book", "food", "goop"];
var gameBoardWidth = tiles * tileWidth;

// directions: horizontal, vertical, downstairs, upstairs


function unNamed(word){
  word.end()
}

function randomLetter() {
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return possible.charAt(Math.floor(Math.random() * possible.length));
}

function buildGrid() {
  $("body").append("<div class=game-board></div>");

  for (var i = 0; i < tiles; i++){
    for(var j = 0; j < tiles; j++){
      $( ".game-board" ).append( "<div class=card id = "+i+"_"+j+"></div>" );
      var letter = randomLetter();
      $("#"+i+"_"+j).html(letter);
    }
  }
    $(".game-board").css("width", "gameBoardWidth");
}

function placeWord(word){
  word = words[Math.floor(Math.random()*words.length)];
  row = Math.floor(Math.random()*tiles);
  col = Math.floor(Math.random()*(tiles-word.length));
  $("#" + row + "_" + col).addClass("wordStart");
  $("#" + row + "-" + (col+word.length-1)).addClass("wordEnd");
  for (var i = 0; i < word.length; i++){
    $("#" + row + "_" + (col+i)).html(word[i].toUpperCase());
  }
}

function isWord(firstclicked, secondClicked){
  if ((firstclicked.hasClass("wordStart") || firstclicked.hasClass("wordEnd")) && (secondClicked.hasClass('wordStart') || secondClicked.hasClass('wordEnd'))){
    console.log("Word found.")
  }
  //what cells does it cover?
  //is there a word in those cells?
  //is one of the tiles the beginning or end of word and
  //is the other tile the end or beginning of same word.
  //word.start = tileID, word.end = tileID;
  //if firstclicked === wordEnd || wordStart
}

function selectTiles(){
  console.log("selectTiles() called.")
  var word = $("#"+this.id).html();
  console.log("currentTile="+word);
 // $("#"+this.id).html(word.toLowerCase());
}

function highlight(tileID){
  //set class to highlighted
  //add wiggle.
  $("#"+tileID).css("background-color", "orangered");
}

function highlightWord (firstClicked, secondClicked) {
  var row1 = firstClicked[0];
  var col1 = firstClicked[2];
  var row2 = secondClicked[0];
  var col2 = secondClicked[2];
  console.log(row1+","+col1+" and "+row2+","+col2);

  var rowDiff = Math.abs(row1 - row2);
  var colDiff = Math.abs(col1 - col2);
  var minCol = Math.min(col1,col2);
  var maxCol = Math.max(col1,col2);
  var minRow = Math.min(row1,row2);
  var maxRow = Math.max(row1,row2);
  if (firstClicked[2] < secondClicked[2]){
    var leftMost = firstClicked;
    var rightMost = secondClicked;
  } else {
    var leftMost = secondClicked;
    var rightMost = firstClicked
  }


  if (row1 === row2 || col1 === col2 || rowDiff === colDiff){
    console.log("Valid Selection.");
      if (rowDiff === colDiff) {
        if (leftMost[0] > rightMost[0]) {
          while (minRow < maxRow && minCol < maxCol) {
            highlight(minRow+"_"+maxCol);
            minRow++;
            maxCol--;
          }
        } else {
          while (minRow < maxRow && minCol < maxCol) {
            highlight(minRow+"_"+minCol);
            minRow++;
            minCol++;
        }
       }
      } else {
        if (row1 === row2) {
          while (minCol < maxCol) {
            highlight(row1+"_"+minCol);
            minCol++;
          }
        } else if (col1 === col2) {
          while (minRow < maxRow) {
            highlight(minRow+"_"+col1);
            minRow++;
          }
        }
      }
  } else {
    console.log("Invalid Selection");
  }
}

var firstClicked;
var secondClicked;

function choose(tileID){
  if (!firstClicked) {
    $(".card").css("background-color", "green");
    secondClicked ="";
    firstClicked = tileID;
    highlight(firstClicked);
    //console.log("First Clicked: " + tileID);

  } else {
    var secondClicked = tileID;
    highlight(secondClicked);
    //hightlightWord();
    highlightWord(firstClicked, secondClicked);
    firstClicked = "";
  }

}






$(function(){
  buildGrid();
  placeWord(words);
  $(".card").click(function () {
      var word = $("#"+this.id).html();
      console.log("currentTile="+this.id);
      choose(this.id)
  });
});

//across =   row col++
//down   =   row++ col
//diagonal = row++ col++
//acrossBackwards = row col--
//downBackwards = row-- col




