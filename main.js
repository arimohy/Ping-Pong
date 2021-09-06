//creaccion de la clase Board
(function(){
    self.Board=function(width,height){
        this.width=width;
        this.height=height;
        this.playing=false;
        this.game_over=false;
        this.bars=[];
        this.ball=null;
    }
    self.Board.prototype={
        get elements(){
            var elements =this.bars;
            elements.push(ball);
            return elements;
        }
        
    }
})();
//creacion de la clase Bar o barras
(function(){
    //creacion del constructor
    self.Bar=function(x,y,width,height,board){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.board=board;

        this.board.bars.push(this);
        this.kind="rectangle"; //atributo para saber la forma de las barras
    }
    //metodos
    self.Board.prototype={
        down:function(){

        }
        up:function(){

        }   
    }
})();

(function(){
    self.BoardView=function(canvas,board){
        this.canvas=canvas;
        this.board=board;
        this.canvas.width=board.width;
        this.canvas.height=board.height;
        
        this.ctx=canvas.getContext("2d")
    }
    
})();
window.addEventListener("load",main)
function main(){
    var board=new Board(800,400);
    var canvas=document.getElementById("canvas");
    var board_view=new BoardView(canvas,board);

}