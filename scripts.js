var tiles = 6;
var tileWidth = 50;
var tileMargin = 1;
var gameBoardWidth = tiles * tileWidth;

function Word(word, startX, startY, endX, endY, order, condition){
    this.word = word;
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    this.order = order;
    this.condition = condition;
}

//Construction of words assumes that the start and end coordinates make sense.
words = [
    ["scope", 0, 1, 0, 5, "forwards", "hidden"],
    ["coat", 0, 2, 3, 2, "forwards", "hidden"],
    ["heart",2, 0, 2, 4, "forwards", "hidden"],
    ["ran", 2, 3, 4, 5, "forwards", "hidden"],
    ["hope", 2, 0, 5, 0, "forwards", "hidden"],
    ["escape", 5, 0, 5, 5, "forwards", "hidden"]
];

function buildWords(words){
    var wordArr = [];
    for (var i = 0; i < words.length; i++){
        var word = new Word(words[i][0], words[i][1], words[i][2], words[i][3], words[i][4], words[i][5], words[i][6]);
        wordArr.push(word);
    }
    console.log(wordArr);
    return wordArr;
}

function randomLetter() {
  var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return alpha.charAt(Math.floor(Math.random() * alpha.length));
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

function setIncrement(word){
    //vertical
    if (word.startX == word.endX){
        incrementer = [0,1];
        return incrementer;
    }
    //horizontal
    else if (word.startY == word.endY){
        incrementer = [1,0];
        return incrementer;
    }
    //diagonal
    else if ((word.endX - word.startX) == (word.endY - word.startY)){
        incrementer = [1,1];
        return incrementer;
    } else {
        console.log("Major Fuckery!")
    }
}

function placeWords(words){
    for (var i = 0; i < words.length; i++){
        var word = words[i];
        var x = 0;
        var y = 0;
        incrementer = setIncrement(words[i]);
        for (var j = 0; j < word.word.length; j++){
            //mark tile as word start, associate with word.
            $('#' + (word.startX + x) + "_" + (word.startY + y)).html(word.word[j]);
            if (j == 0){
                $('#' + (word.startX + x) + "_" + (word.startY + y)).addClass("word_start");
            } else if (j == word.word.length - 1) {
                $('#' + (word.startX + x) + "_" + (word.startY + y)).addClass("word_end");
            } else {
                $('#' + (word.startX + x) + "_" + (word.startY + y)).addClass("" + word.word + "");
            }
            x = x + incrementer[0];
            y = y + incrementer[1];
        }
    }
}


function listWords(words){
    words.map(function (word) {
        $("body").append('<div class="word">'+word.word+'</div>');
    })
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
  } else {
    var secondClicked = tileID;
    highlight(secondClicked);
    highlightWord(firstClicked, secondClicked);
    isWord(firstClicked, secondClicked);
    firstClicked = "";
  }

}

function isWord(firstClicked, secondClicked)
{
    console.log(firstClicked);
    if ($("#"+firstClicked).hasClass("word_start") && $("#"+secondClicked).hasClass("word_end"))

    {
        console.log("Word found.");
    }
    //is one of the tiles the beginning or end of word and
    //is the other tile the end or beginning of same word.
    //word.start = tileID, word.end = tileID;
    //if firstclicked === wordEnd || wordStart
}""

function selectTiles(){
    console.log("selectTiles() called.")
    var word = $("#"+this.id).html();
    console.log("currentTile="+word);
    // $("#"+this.id).html(word.toLowerCase());
}

$(function(){
    buildGrid();
    wordArr = buildWords(words);
    placeWords(wordArr);
    listWords(wordArr);
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

