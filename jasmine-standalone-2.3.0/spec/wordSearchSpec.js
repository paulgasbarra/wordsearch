describe("wordSearch", function() {

    var words;
    var wordArray;

    beforeEach(function (){
        words = [
            ["open", 2, 1, "vertical"],
            ["human", 0, 0, "horizontal"]
        ];
        wordArray = [];
    });

    describe("randomLetter()", function () {
        it('returns a letter', function () {
            spyOn(Math, 'random').and.returnValue(.1);
            expect(randomLetter()).toEqual("C");
        })
    });

    describe("buildGrid", function () {
        beforeEach(function() {
            cssSpy = jasmine.createSpy("css");
            appendSpy = jasmine.createSpy("append");
            htmlSpy = jasmine.createSpy("html");
            randomLetterSpy = spyOn(window, "randomLetter");
            $ = jasmine.createSpy("$").and.callFake(function(selector) {
                return {
                    css: cssSpy,
                    append: appendSpy,
                    html: htmlSpy
                };
            });

            buildGrid(10, 10, 15, 20);
        });

        it('determines the width of the gameBoard', function () {
            expect(cssSpy).toHaveBeenCalledWith("width", "710px");
        });

        it('jQuery selects a class called .game-board', function () {
            expect($).toHaveBeenCalledWith(".game-board");
        });

        it('appends gridSize^2 cards to the gameboard', function () {
            expect(appendSpy.calls.count()).toBe(100);
        });

        it('populates each cards HTML with a random letter', function(){
            //make sure that
            expect(randomLetterSpy.calls.count()).toBe(100);
        });
        it('throws an error if the word argument has the wrong amount of arguments', function() {
            word = ["bank", 0, "horizontal"];
            expect( function() {buildWord(word)} ).toThrow(new Error("Not enough arguments in the word array."));
        })

    });

    describe("buildWord()", function () {
        var result, word;
        beforeEach(function() {
            word = words[0];
            result = buildWord(word, wordArray);
        });

        it('adds a word object to a wordArray', function () {
            var testValue = [{
                incrementX: 0,
                incrementY: 1,
                orientation: "vertical",
                startX: 2,
                startY: 1,
                word: "open"
            }];

//spy on console.error()
            expect(result).toEqual(testValue);
        });
    });

   describe("buildWords()", function(){
       var result;
       beforeEach(function () {
           result = buildWords(words, wordArray);
       });
       it('returns an array of word objects', function(){
           var testValue = [{
               incrementX: 0,
               incrementY: 1,
               orientation: "vertical",
               startX: 2,
               startY: 1,
               word: "open"
           }, {
               incrementX: 1,
               incrementY: 0,
               orientation: "horizontal",
               startX: 0,
               startY: 0,
               word: "human"
           }];
           expect(result).toEqual(testValue);
       });


   });

    describe("filterCoord()", function() {
        var result;
        beforeEach(function () {
            wordArray = [{
                endX: 4,
                endY: 0,
                incrementX: 1,
                incrementY: 0,
                orientation: "horizontal",
                startX: 0,
                startY: 0,
                word: "human"
            }, {
                endX: 0,
                endY: 3,
                incrementX: 0,
                incrementY: 1,
                orientation: "vertical",
                startX: 0,
                startY: 0,
                word: "have"
            }];
            result = filterCoord(wordArray, 0, 0, 'start');
        });
        it("returns an array of word objects that START at given coordinates", function () {
            var testValue = [{
                endX: 4,
                endY: 0,
                incrementX: 1,
                incrementY: 0,
                orientation: "horizontal",
                startX: 0,
                startY: 0,
                word: "human"
            }, {
                endX: 0,
                endY: 3,
                incrementX: 0,
                incrementY: 1,
                orientation: "vertical",
                startX: 0,
                startY: 0,
                word: "have"
            }];
            expect(result).toEqual(testValue);
        });
        it("returns an array of word objects that END at given coordinates", function () {
            result = filterCoord(wordArray, 4, 0, 'end')
            var testValue = [{
                endX: 4,
                endY: 0,
                incrementX: 1,
                incrementY: 0,
                orientation: "horizontal",
                startX: 0,
                startY: 0,
                word: "human"
            }];
            expect(result).toEqual(testValue);
        });
    });

    describe("winCondition()", function(){
        it ("checks if wordArray still has given word Object in it and removes said object from array", function(){
            var word = "have";
            var wordArray = [{endX: 4,
                endY: 0,
                incrementX: 1,
                incrementY: 0,
                orientation: "horizontal",
                startX: 0,
                startY: 0,
                word: "human"},
                {endX: 0,
                    endY: 3,
                    incrementX: 0,
                    incrementY: 1,
                    orientation: "vertical",
                    startX: 0,
                    startY: 0,
                    word: "have"}];
            var result = winCondition(word, wordArray);
            var testValue = [{endX: 4,
                endY: 0,
                incrementX: 1,
                incrementY: 0,
                orientation: "horizontal",
                startX: 0,
                startY: 0,
                word: "human"}];
            expect(result).toEqual(testValue);
        });

        it ("displays a win animation if the last word has been found", function(){
            cssSpy = jasmine.createSpy("css");
            $ = jasmine.createSpy("$").and.callFake(function(selector) {
                return {
                    css: cssSpy
                };
            });
            var wordArray = [{endX: 4,
                endY: 0,
                incrementX: 1,
                incrementY: 0,
                orientation: "horizontal",
                startX: 0,
                startY: 0,
                word: "human"}];
            var word = "human";
            winCondition(word, wordArray);
            expect(cssSpy).toHaveBeenCalledWith("display", "block");
        });
    });

});