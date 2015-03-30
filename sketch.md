//not sure how to do this. It appears I can make a Tile constructor but not sure how to assign
//different variable name to each new instance
function Tile(id){
    this.words = [];
    this.letter = "";
    this.wordStart = false;
    this.wordEnd = false;
    this.row = id[0];
    this.column = id[2];
    this.highlighted = false;
    this.id = this.row + "_" + this.column;
}