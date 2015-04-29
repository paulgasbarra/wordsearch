var tiles = 6;
var tileSize = 100;
var fontSize = tileSize * 0.9;
var tileMargin = 5;
var gameBoardWidth = (tiles * tileSize) + (tiles * (tileMargin*3))+tiles;
//6*50 = 300 6 * 2 * 2 = 24
var wordsFound = 0;

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
words2 = [
    ["scope", 0, 1, 0, 5, "forwards", "hidden"],
    ["coat", 0, 2, 3, 2, "forwards", "hidden"],
    ["heart",2, 0, 2, 4, "forwards", "hidden"],
    ["ran", 2, 3, 4, 5, "forwards", "hidden"],
    ["hope", 2, 0, 5, 0, "forwards", "hidden"],
    ["escape", 5, 0, 5, 5, "forwards", "hidden"]
];

words = [
   ["bank", 4, 0, 4, 3, "forwards", "hidden"],
   ["human", 0, 0, 0, 4, "forwards", "hidden"],
    ["save", 0, 5, 3, 5, "forwards", "hidden"],
   ["app", 1, 1, 3, 3, "forwards", "hidden"],
    ["always", 5, 0, 5, 5, "forwards", "hidden"],
   ["open", 1, 2, 4, 2, "forwards", "hidden"],
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
    $(".game-board").css("width", ""+gameBoardWidth+"px");
    for (var i = 0; i < tiles; i++){
        for(var j = 0; j < tiles; j++){
            var tileID = i + "_" + j;
            $( ".game-board" ).append( "<div class=card id =" + tileID + " style = 'width: " + tileSize + "px; font-size: " + fontSize + "px'></div>" );
            $("#"+tileID).html(randomLetter());
    }
  }

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
                $('#' + (word.startX + x) + "_" + (word.startY + y)).addClass("word_start " + word.word);
            } else if (j == word.word.length - 1) {
                $('#' + (word.startX + x) + "_" + (word.startY + y)).addClass("word_end " + word.word);
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
        $("#wordList").append('<div class="list-word" id=' + word.word + ' >' + word.word + '</div>');
    })

}

function highlight(tileID){
  $("#"+tileID).addClass("highlight");
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
    var rightMost = firstClicked;
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
    $(".card").removeClass("highlight");
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

//depending on the point (start or end), loops through the array of word
//objects (wordArr) and returns those words matching the x and y coordinates
// in the parameters.
function filterCoord(wordArr, X, Y, point) {
    var returnArr = [];
    for (var i = 0; i < wordArr.length; i++){
        var word = wordArr[i];
        if (point === "start") {
            if ((word.startX == X) && (word.startY == Y)) {
                returnArr.push(word);
            }
        } else if (point === 'end'){
            if ((word.endX == X) && (word.endY == Y)) {
                returnArr.push(word);
            }
        }
    }
    return returnArr;
}

function winCondition(word) {
    if (wordArr.length > 1) {
        for (var i = 0; i < wordArr.length; i++) {
            if (wordArr[i].word === word) {
                wordArr.splice(i, 1);
                console.log(wordArr);
            }
        }
        return;
    } else {
    $("#fanfareoverlay").css("display", "block");
    $("#fanfarebox").css("display", "block");
}
}

function isWord(firstClicked, secondClicked)
{
    if (($("#"+firstClicked).hasClass("word_start") && $("#"+secondClicked).hasClass("word_end"))||($("#"+firstClicked).hasClass("word_end") && $("#"+secondClicked).hasClass("word_start")))
    {
        //is first clicked word start or word end
        if ($("#" + firstClicked).hasClass("word_start")){
            var startX = firstClicked[0];
            var startY = firstClicked[2];
            var endX = secondClicked[0];
            var endY = secondClicked[2];
            //i think the initial conditionals will catch all other cases. Firstclicked will either be word start or word end.
        } else {
            var startX = secondClicked[0];
            var startY = secondClicked[2];
            var endX = firstClicked[0];
            var endY = firstClicked[2];
        }
        console.log("startX="+startX+", startY="+startY+", endX="+endX+", endY="+endY);
        //make a double call to filterCoord
        var wordObj = filterCoord(filterCoord(wordArr, startX, startY, "start"), endX, endY, "end");
        var word = wordObj[0].word;

        console.log("Here's a word: " + word);
        $("." + word).addClass("found");
        $("#" + word).addClass("crossed-out");

        winCondition(word);

        //this assumes that there will never be two words with the same start
        //and no words will repeat.
    }
}

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
      console.log("currentTile="+this.id);
      choose(this.id)
    });
});




