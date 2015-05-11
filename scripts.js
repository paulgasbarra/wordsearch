function prerender(){location.reload()}
function postrender(){}


var orientations = ["downstairs", "horizontal", "upstairs", "vertical"];
var orders = ["forwards", "forwards", "forwards","reverse"];
var wordArray = [];

//grid variables
var gridSize = 6;

var firstClicked;
var secondClicked;

var words = [
    "BANK", "HUMAN", "APP", "SAVE", "ALWAYS", "OPEN"
];

var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";


function randomPick(array){
    return array[Math.floor(Math.random()*array.length)];
}

function reverse(s){
    var o = '';
    for (var i = s.length - 1; i >= 0; i--)
        o += s[i];
    return o;
}

function buildGrid(gridSize) {

    var tileSize = 100;
    var fontSize = tileSize * 0.9;
    var tileMargin = 5;

    var gameBoardWidth = (gridSize * tileSize) + (gridSize * (tileMargin*3)) + gridSize;

    var board = $(".game-board");
    board.css("width", ""+gameBoardWidth+"px");

    for (var i = 0; i < gridSize; i++){
        for(var j = 0; j < gridSize; j++){
            var tileID = j + "_" + i;
            board.append( "<div id =" + tileID + " class = 'card' style = 'width: " + tileSize + "px; font-size: " + fontSize + "px'>"+randomPick(alpha)+"</div>" );
        }
    }

}

function setStartCoords(word, orientation){
    var startX, startY, incrementX, incrementY;

    switch (orientation) {
        case "downstairs":
            startX = Math.floor(Math.random() * (gridSize - (word.length-1)));
            startY = Math.floor(Math.random() * (gridSize - (word.length-1)));
            incrementX = 1;
            incrementY = 1;
            break;
        case "horizontal":
            startX = Math.floor(Math.random() * (gridSize - word.length));
            startY = Math.floor(Math.random() * gridSize);
            incrementX = 1;
            incrementY = 0;
            break;
        case "upstairs":
            startX = Math.floor(Math.random() * (gridSize - word.length));
            startY = gridSize - (Math.floor(Math.random() * (gridSize - word.length)))-1;
            incrementX = 1;
            incrementY = -1;
            break;
        case "vertical":
            startX = Math.floor(Math.random() * gridSize);
            startY = Math.floor(Math.random() * (gridSize - word.length));
            incrementX = 0;
            incrementY = 1;
            break;
    }

    return [startX, startY, incrementX, incrementY];

}

function buildWord(word, wordArray){

    var orientation = randomPick(orientations);
    var order = randomPick(orders);
    var coordinates = setStartCoords(word, orientation);

    var newWord = {word: word, startX: coordinates[0], startY: coordinates[1], orientation: orientation, incrementX: coordinates[2], incrementY: coordinates[3], order: order};
    return newWord;

}

function buildWords(words, wordArray){
    for (var i = 0; i < words.length; i++){
        var newWord = buildWord(words[i]);
        wordArray.push(newWord);
    }
    return wordArray;
}

function conflictCheck(x, y, word, letter){
    var tile = $("#" + x + "_" + y);
    if (tile.hasClass("word")){

        if (tile.html() === letter){
            console.log("Placing " + word + ", encountered same letter at tile #" + x + "_" + y);
            return false;
        } else {
            console.log("Conflict! placing " + word, "tileID: " + tile.attr('id'), "tileClass: " + tile.attr('class'), "letter: " + tile.html());
            return true;
        }

    } else {
        return false;
    }
}



function placeWords(words){
    for (var i = 0; i < words.length; i++){
        var word = words[i];
        var placeWord = word.word;
        if (word.order === "reverse"){ placeWord = reverse(word.word); }
        var x = 0;
        var y = 0;

        for (var j = 0; j < word.word.length; j++){
            var conflict = conflictCheck(word.startX + x, word.startY + y, placeWord, placeWord[j]);
            if (conflict) {
                words[i] = buildWord(words[i].word);
                $( ".card" ).remove();
                buildGrid(gridSize);
                placeWords(words);
                break;
            }
            else {

                if (j === 0){

                    $('#' + (word.startX) + "_" + (word.startY)).addClass("word_start word " + word.word);

                } else if (j === word.word.length - 1) {

                    $('#' + (word.startX + x) + "_" + (word.startY + y)).addClass("word_end word " + word.word);
                    word.endX = word.startX + x;
                    word.endY = word.startY + y;

                } else {

                    $('#' + (word.startX + x) + "_" + (word.startY + y)).addClass(" word " + word.word);

                }
            }
            $('#' + (word.startX + x) + "_" + (word.startY + y)).html(placeWord[j]);
            x = x + word.incrementX;
            y = y + word.incrementY;
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

    var leftMost, rightMost;
  if (firstClicked[2] < secondClicked[2]){
    leftMost = firstClicked;
    rightMost = secondClicked;
  } else {
    leftMost = secondClicked;
    rightMost = firstClicked;
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



function choose(tileID, wordArray){
  if (!firstClicked) {
    $(".card").removeClass("highlight");
    secondClicked ="";
    firstClicked = tileID;
    highlight(firstClicked);
  } else {
    var secondClicked = tileID;
    highlight(secondClicked);
    highlightWord(firstClicked, secondClicked);

    isWord(firstClicked, secondClicked, wordArray);
    firstClicked = "";
  }

}

//depending on the point (start or end), loops through the array of word
//objects (wordArray) and returns those words matching the x and y coordinates
// in the parameters.
function filterCoord(wordArray, X, Y, point) {
    var returnArr = [];
    for (var i = 0; i < wordArray.length; i++){
        var word = wordArray[i];
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

function winCondition(word, wordArray) {
    console.log(wordArray);
    if (wordArray.length > 1) {
        for (var i = 0; i < wordArray.length; i++) {
            if (wordArray[i].word === word) {
                wordArray.splice(i, 1);

            }
        }
        console.log(wordArray);
        return wordArray;
    } else {
        console.log(wordArray);
    $("#fanfareoverlay").css("display", "block");
    $("#fanfarebox").css("display", "block");
}
}

function isWord(firstClicked, secondClicked, wordArray)
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
        //make a double call to filterCoord. Once for words that start at the same tile, once for the word that has
        // the same end tile this assumes that there will never be two words with the same start and no words will
        // repeat.
        console.log("word array isWord: "+ wordArray, startX, startY);
        var wordObj = filterCoord(filterCoord(wordArray, startX, startY, "start"), endX, endY, "end");

        var word = wordObj[0].word;

        console.log("Here's a word: " + word);
        $("." + word).addClass("found");
        $("#" + word).addClass("crossed-out");

        winCondition(word, wordArray);

    }
}

function requestKioskExtension(duration) {
    window.parent.EventBus.pub("extend_current_asset", {time: duration });
}


$(function($){
    buildGrid(gridSize);
    buildWords(words, wordArray);
    placeWords(wordArray);
    listWords(wordArray);
    $(".card").click(function () {
        console.log("currentTile="+this.id);
        choose(this.id, wordArray);
    });
});





