function prerender(){location.reload()}
function postrender(){}


//var orientations = ["downstairs", "horizontal", "upstairs", "vertical"];
//var orders = ["forwards", "reverse"];
var wordArray = [];

//grid variables
var gridSize = 6;
var tileSize = 100;
var fontSize = tileSize * 0.9;
var tileMargin = 5;

var firstClicked;
var secondClicked;

var words = [
        ["bank", 0, 4, "horizontal"],
        ["human", 0, 0, "horizontal"],
        ["save", 5, 1, "vertical"],
        ["app", 1, 1, "downstairs"],
        ["always", 0, 5, "horizontal"],
        ["open", 2, 1, "vertical"]
];

function randomLetter() {
    var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return alpha.charAt(Math.floor(Math.random() * alpha.length));
}

function buildGrid(gridSize, tileSize, fontSize, tileMargin) {

    var gameBoardWidth = (gridSize * tileSize) + (gridSize * (tileMargin*3)) + gridSize;

    var board = $(".game-board");
        board.css("width", ""+gameBoardWidth+"px");

    for (var i = 0; i < gridSize; i++){
        for(var j = 0; j < gridSize; j++){
            var tileID = j + "_" + i;
            board.append( "<div class=card id =" + tileID + " style = 'width: " + tileSize + "px; font-size: " + fontSize + "px'>"+randomLetter()+"</div>" );
        }
    }

}

function buildWord(word, wordArray){
    //add gridsize argument when we have random builder function so we can place things. If that's what we want.
    if (word.length != 4) {throw new Error("Not enough arguments in the word array."); return}

    var startX = word[1];
    var startY = word[2];
    var orientation = word[3];
    var incrementX, incrementY;
    //var order = randomPick(orders);


    switch (orientation) {
        case "downstairs":
            //startX = Math.floor(Math.random() * (gridSize - word.length));
            //startY = Math.floor(Math.random() * (gridSize - word.length));
            incrementX = 1;
            incrementY = 1;
            break;
        case "horizontal":
            //startX = Math.floor(Math.random() * (gridSize - word.length));
            //startY = Math.floor(Math.random() * gridSize);
            incrementX = 1;
            incrementY = 0;
            break;
        case "upstairs":
            //startX = Math.floor(Math.random() * (gridSize - word.length + 1));
            //startY = Math.floor(Math.random() * (gridSize - word.length + 1)) + word.length-1;
            incrementX = 1;
            incrementY = -1;
            break;
        case "vertical":
            //startX = Math.floor(Math.random() * gridSize);
            //startY = Math.floor(Math.random() * (gridSize - word.length));
            incrementX = 0;
            incrementY = 1;
            break;
    }

    wordArray.push({word: word[0], startX: startX, startY: startY, orientation: orientation, incrementX: incrementX, incrementY: incrementY});

    return wordArray;

}

function buildWords(words, wordArray){
    for (var i = 0; i < words.length; i++){
        buildWord(words[i], wordArray);
    }
    return wordArray;
}

function placeWords(words){
    for (var i = 0; i < words.length; i++){
        var word = words[i];
//        word.word = reverse(word.word);
        var x = 0;
        var y = 0;
        console.log(word)
        for (var j = 0; j < word.word.length; j++){
            if (j === 0){
                $('#' + (word.startX) + "_" + (word.startY)).addClass("word_start " + word.word);
            } else if (j === word.word.length - 1) {
                $('#' + (word.startX + x) + "_" + (word.startY + y)).addClass("word_end " + word.word);
                word.endX = word.startX + x;
                word.endY = word.startY + y;
            } else {
                $('#' + (word.startX + x) + "_" + (word.startY + y)).addClass("" + word.word + "");
            }
            $('#' + (word.startX + x) + "_" + (word.startY + y)).html(word.word[j]);
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
    buildGrid(gridSize, tileSize, fontSize, tileMargin);
    buildWords(words, wordArray);
    placeWords(wordArray);
    listWords(wordArray);
    $(".card").click(function () {
        console.log("currentTile="+this.id);
        requestKioskExtension(10000)
        choose(this.id, wordArray);
    });
});




