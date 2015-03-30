var tiles = 6;
var tileWidth = 50;
var tileMargin = 1;
var words = ["book", "food", "goop"];
var gameBoardWidth = tiles * tileWidth;


var words = [
            ["scope", "0_1", "0_5"],
            ["coat", "0_2", "2_3"],
            ["heart","",""],
            ["ran", "", ""],
            ["hope", "", ""],
            ["escape","",""]
            ];
var wordGrid =
        [
            [ "", "S", "C", "O", "P", "E"],
            ["", "", "O", "", "", ""],
            ["H", "E", "A", "R", "T", ""],
            ["O", "", "T", "", "A", ""],
            ["P", "", "", "", "", "N"],
            ["E", "S", "C", "A", "P", "E"]
        ];

var wordStart =
    [
        [0, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [2, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0]
    ];

var wordEnd =
    [
        [0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0],
        [0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1]
    ];

function randomLetter() {
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return possible.charAt(Math.floor(Math.random() * possible.length));
}

function buildGrid() {
  $("body").append("<div class=game-board></div>");

  for (var i = 0; i < tiles; i++){
    for(var j = 0; j < tiles; j++){
        var tileID = i + "_" + j;
        $( ".game-board" ).append( "<div class=card id =" + tileID + "></div>" );
        $("#"+tileID).html(randomLetter());
    }
  }
    $(".game-board").css("width", "gameBoardWidth");
}

function placeWords(wordGrid){
  //throwing in random word for fun
  //word = words[Math.floor(Math.random()*words.length)];
  ////word is horizontal for now
  //row = Math.floor(Math.random()*tiles);
  //col = Math.floor(Math.random()*(tiles-word.length));
  //mark word start and word end to each
  //$("#" + row + "_" + col).addClass("wordStart");
  //$("#" + row + "_" + (col+word.length-1)).addClass("wordEnd");
  //for (var i = 0; i < word.length; i++){
  //  $("#" + row + "_" + (col+i)).html(word[i].toUpperCase());
  //}
    for (var i = 0; i < tiles; i++){
        for (var j = 0; j < tiles; j++){
            $("#" + i + "_" + j ).html(wordGrid[i][j]);
            if ($("#" + i + "_" + j ).html()===""){
                $("#" + i + "_" + j ).html(randomLetter());
            }
        }
    }
}

function isWord(firstClicked, secondClicked)
{
    console.log(firstClicked);
  if (($("#"+firstClicked).hasClass("wordStart")&&$("#"+secondClicked).hasClass("wordEnd")) ||(($("#"+firstClicked).hasClass("wordEnd") && $("#"+secondClicked).hasClass("wordStart"))))
  {
    console.log("Word found.");
  }
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


  if ((row1 === row2 || col1 === col2 || rowDiff === colDiff) && (firstClicked != secondClicked)){
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
    highlightWord(firstClicked, secondClicked);
    isWord(firstClicked, secondClicked);
    firstClicked = "";
  }

}

$(function(){
  buildGrid();
  placeWords(wordGrid);
  $(".card").click(function () {
      var word = $("#"+this.id).html();
      console.log("currentTile="+this.id);
      choose(this.id)
  });
});

//var person = {firstName:"John", lastName:"Doe", age:50, eyeColor:"blue"};



//across =   row col++
//down   =   row++ col
//diagonal = row++ col++
//acrossBackwards = row col--
//downBackwards = row-- col


// word constructor
// position of beginning of word
// position of end of word
// found?

// tile constructor
// part of a word(s)
// beginning of word(s)
// end of word(s)
// highlighted status
// words tiles belong to
//

// Tile {
// this.words = ['oak','keep','kite']
// this.beginning = true
// this.end = true
// this.row = 2
// this.column = 2
// this.highlighted = false
// this.id = 2_2
//
// }


// Word {
// this.found = false
// }

//add available words to the bottom of the display

//check if firstClicked is beginning or end of word
//and then check if secondClicked is beginning or end word
//if not valid selection or word => reset selection
//if valid word => change the following:
//permanent highlight value of involved tiles (redundant highlighting)
//status of word as found or hidden
//if not beginning or end of another word => remove status as beginning or end of word
//cross off the word from the list
//end turn

//CASE STUDY
// a tile is the beginning of two words and end of one

//O.....
//.A....
//..KEEP
//..I...
//..T...
//..E...

//in case of K or 2_2.

