#MTA Word Search Overview

##Intro

Riding the subway in NYC, I’ve often seen straphangers keeping busy with word search puzzles. Given their popularity, I thought that this may be a good application for the MTA kiosks. 

The word search can be a relatively short engagement. Clients can promote buzzwords they’d like to associate with their brand by hiding them in the puzzles. Also, interactive ads raise the visibility and usage of kiosks by making them fun and approachable. 

##Objectives

Create a word search puzzle program. 
Create an experience that can be skinned for different clients, events, seasons, holidays, campaigns. 
Create a user experience that is obvious, easy, and delightful. 
Create an advertising platform that can message key terms or buzzwords.
Broaden my front-end toolset and expand my software engineering knowledge.  

##Architecture

Given the relative simplicity of the project I didn’t use any frameworks. The only other library I used was jQuery, which is very helpful for building code quickly and manipulating classes. 

####Build Phase

The puzzle’s dimensions are derived from initial variables set at the beginning of the scripts.js file. These determine the amount of tiles in the square grid and the spacing between them. 

The program builds a grid and populates that grid with random letters. When the grid is built each ‘card’ is given an id based on it’s position in the grid. So the first card in the grid has the id “0_0.” Most of the game logic depends on parsing the id of the card. The 0th index of the card id (0 in this case) represents the x coordinate of the card. The 2nd index represents its y coordinate. 

After the grid is built, a new array of word objects is built using the ‘word’ constructor. This constructor takes an array of words and their beginning and ending “x” & “y” coordinates. This was done to make code more readable. For example, the beginning tile of a word can be accessed using (word.startX, word.startY). This also opens the word object up to the addition of other properties or methods in the future. The word objects are stored in an array called “wordArr”.  

The words are then placed on the board. The words overwrite the random letters placed in the step before. At this step, each card in the word gets that word as a class. So if ‘card’ 0_2 is a part of the word “find” it will have the class of “find.” “word_start” and “word_end” are also added to the respective cards and these are used to determine if a word is select.  

Finally the list words to find are displayed beneath the puzzle. 

####Play Phase

Players engage with the puzzle by selecting the first letter of a word and the last letter of the word. 

This results in highlighting the tiles in between these two selections. In order to achieve a highlighting effect, classes are applied to the game ‘cards.’ Each selection is checked for validity, i.e. is it in the same row, column or diagonal vector.  

If they have done this for the proper word, its class will change to ‘found’ and the word at the bottom of the list will be crossed out. 

####Win Phase

Each time a word is found, it is removed from the wordArr. Once the is down to the last word the game displays a winning fanfare and the player can reset the game. 

###Flowchart for Word Search

##Challenges

####Traversing The Dom/Grid

One of the trickier parts of making this puzzle work properly was how to place words based solely on their beginning and ending positions in the grid. The other challenge was how to highlight them. I wanted users to be able to select a word either at the beginning or end of the word. Clicking on the last letter of a word and then the first works just as well as going from beginning to end. Figuring out how to walk through the grid and apply classes took some time. The function “highlightWord” is one of the longest functions because of the conditionals involved in determining if the selection is valid and where it’s coming from. Ultimately the use of incrementation from left/top most ‘cards’ to right/bottom most ‘cards’ solved this problem. But the way in which the program increments depends on some conditional logic which compares the position of tiles as well as the difference between the positions of the first and last title. One example would be that if the difference between two tiles x coordinate is 0, then both tiles are in the same column. 

####Determining Word Matches

Determining whether or not a word has been found also proved to be a trick. The information that I had about each ‘card’ comes from id of the card. It took some creative thought to figure out that I could parse the id as a string and compare that to word objects. 

Once I could parse that, I needed a way to step through the wordArr looking for matches. One of the challenges here was how to deal with words that have the same beginning tile. To do so, I make one call to fliterCoord to filter out words that don’t have the same start point, and I do it a second time to find which one of those words in the wordArr has the given endpoint. It stands to reason that no two words will share both the same start and end points. 

####Uncertainty Around Use of Constructor

One of the areas that I groped around in was the use of anonymous objects in wordArr. I’m not sure how to make an assignment using a variable as a name. For example buildWords(words) function, is there way to make “word” in the third line the name of the word for each object the constructor is creating.

At the moment, the only way to access an object built by the ‘Word’ constructor was to push it into an array and use the index of that array to get specific objects. 

It would be great if I could figure out a way to name the objects as well. 

##Next

####Tests!!!

Need to write a battery of tests for this code. 

####More Puzzles

At the moment the program uses a single array with predetermined words and xy coordinates to create the puzzle. It would be sweet to have a variety of puzzles to choose from so that each user experience is as different than the next as possible. 

####Manual Puzzle Builder

In order to create new puzzles it would be great to make an app that will take puzzle dimensions and provide a grid that users can manually fill in. The table below provides an example.

#INSERT TABLE

Users simply choose a 4x4 grid and then build the puzzle themselves. Each puzzle could be saved in an array and accessed at random so the players will have differing experiences. 

####Procedural Puzzle Builder

Even better than helping people create puzzles, would be letting the computer do it. Users simply provide a list of words they want included in the puzzle and an algorithm determines where the letters go in the grid. 

####Timer

A bit of excitement could be added by letting users race against the clock to find all the words. 

####Analytics

Making and parsing records of interactions could be enormously useful in determining the success of the engagement and determining the future of this application. 
