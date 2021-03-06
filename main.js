//
//creaccion de la clase Board
(function(){
    self.Board=function(width,height){
        this.width=width;
        this.height=height;
        this.playing=false;
        this.game_over=false;
        this.bars=[];
        this.ball=null;
        this.playing=false;
        
    }
    self.Board.prototype={
        get elements(){
            var elements =this.bars.map(function(bar){return bar;});
            elements.push(this.ball);
            return elements;
        }
        
    }
})();
//clase ball o pelota
(function(){
    self.Ball=function(x,y,radius,board){
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.speed_y=0;
        this.speed_x=3;
        this.board=board;
        this.direction=Math.random() < 0.5 ? -1 : 1;
        this.bounce_angle=0;
        this.max_bounce_angle=Math.PI/12;
        this.speed=3;

        board.ball=this;
        this.kind="circle"

        this.aux_x=x;
        this.aux_y=y;
    }
    self.Ball.prototype={
        move:function(){
            this.x+=(this.speed_x*this.direction);
            this.y+=(this.speed_y)
        },
        get width(){
            return this.radius*2;
        },
        get height(){
            return this.radius*2;
        },
        collision:function(bar){
            //reacciona a la colision con una barra q recibe como parametro
            var relative_intersect_y=(bar.y+(bar.height/2)-this.y);
            var normalized_intersect_y=relative_intersect_y/(bar.height/2);
            this.bounce_angle=normalized_intersect_y * this.max_bounce_angle;
            this.speed_y=this.speed*-Math.sin(this.bounce_angle);
            this.speed_x=this.speed*Math.cos(this.bounce_angle)

            if(this.x>(this.board.width/2)) this.direction=-1;
            else this.direction=1

        },
        //funcion si choca arriba o abajo
        collisions_board:function(){
            //inversa de angulo
            this.speed_y=this.speed*Math.sin(this.bounce_angle);
            this.speed_x=this.speed*-Math.cos(this.bounce_angle)

            this.direction=Math.random() < 0.5 ? -1 : 1//sentido de la pelota aleatorio
            


        },
        reiniciar:function(){
            this.x=this.aux_x;
            this.y=this.aux_y;
            this.speed_y=0;
            this.speed_x=3;
            this.direction=Math.random() < 0.5 ? -1 : 1;
            this.bounce_angle=0;
            this.max_bounce_angle=Math.PI/12;
            this.speed=3;
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
        this.speed=5;
    }
    //metodos
    self.Bar.prototype={
        down:function(){
            if(this.y<(this.board.height-this.height))
                this.y +=this.speed;
        },
        up:function(){
            if(this.y>0)
                this.y -=this.speed;
        },
        toString:function(){
            return "x: "+this.x+"y:"+this.y;
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
        this.ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
        
        //
        this.puntos_a=0;
        this.puntos_b=0;
    }
    self.BoardView.prototype={
        clean:function(){
            this.ctx.clearRect(0,0,this.board.width,this.board.height)
        },
        draw:function(){
            for(var i=this.board.elements.length-1 ;i>=0;i--){
                var el=this.board.elements[i]; 
                draw(this.ctx,el)
            };
        },
        check_collisions:function(){
            for(var i =this.board.bars.length-1;i>=0;i--){
                var bar= this.board.bars[i];
                if(hit(bar,this.board.ball)){
                    this.board.ball.collision(bar);
                }
            };
        },
        //metodo creado para solucionar choques en el tablero
        check_collisions_board:function(){
            //choque arriba del tablero
            if(this.board.ball.y<=this.board.ball.height || this.board.ball.y>this.board.height-this.board.ball.height){
                this.board.ball.collisions_board()
            }
        },
        actualizarpuntos:function(){
            
            if(this.board.ball.x>this.board.width){
                this.board.ball.reiniciar()
                this.puntos_b+=1;
                console.log(":P")
            }
            if(this.board.ball.x<0){
                this.board.ball.reiniciar()
                this.puntos_a+=1;
            }
        },
        play:function(){
            if(this.board.playing){
                this.clean();
                this.draw();
                this.check_collisions();
                this.check_collisions_board();
                this.actualizarpuntos();
                this.board.ball.move();
                console.log("===")
                console.log(this.puntos_a)
                console.log(this.puntos_b)
                

            }
            
        }

    }

    //
    //desque aqui son otras funciones auxiliares
    //
    function hit(a,b){
        //revisa si coliciona a con b
        var hit=false;
        //colisiones horizontales
        if(b.x+b.width>=a.x && b.x<a.x+a.width){
            if(b.y+b.height>=a.y && b.y < a.y +a.height)
                hit =true;
        }
        if(b.x<=a.x &&b.x+b.width>=a.x +a.width){
            if(b.y<=a.y && b.y +b.height>=a.y +a.height)
                hit =true;
        }
        if(a.x<=b.x &&a.x+a.width>=b.x +b.width){
            if(a.y<=b.y && a.y +a.height>=b.y +b.height)
                hit =true;
        }
        return hit;


    }
    function draw(ctx,element){
        //if(element !==null && element.hasOwnProperty("kind")){
            switch(element.kind){
                case "rectangle":
                    ctx.fillRect(element.x,element.y,element.width,element.height);
                    break;
                    case "circle":
                        ctx.beginPath();
                        ctx.arc(element.x,element.y,element.radius,0,7)
                        ctx.fill();
                        ctx.closePath();
                        break;
            }
        //}
    }
})();
//inicializacion de pizarra y barras
var board=new Board(800,400);
    var bar=new Bar(20,100,40,100,board);
    var bar_2=new Bar(735,100,40,100,board);
    
    var canvas=document.getElementById("canvas");
    var board_view=new BoardView(canvas,board);
    var ball=new Ball(350,100,10,board);

    
//evento cuando apretamos los comandos para mover lasbarras
document.addEventListener("keydown",function(ev){
    //console.log(ev.keyCode);
    //para que no baje la pantella
    
    if(ev.keyCode==87){
        ev.preventDefault();
        bar.up();
    }
    else if(ev.keyCode==83){
        ev.preventDefault();
        bar.down();
    }
    else if(ev.keyCode==38){
        ev.preventDefault();
        //tecla W
        bar_2.up();
    }
    else if(ev.keyCode==40){
        ev.preventDefault();
        //tela S
        bar_2.down();
    }
    else if(ev.keyCode==32){
        ev.preventDefault();
        board.playing=!board.playing;//este es como un switch 
        
    }
    //console.log(bar.toString())
})

//paraque al inicio dibuje y no se quede en blando
board_view.draw();
window.requestAnimationFrame(controller);

//para que se repita
function controller(){
    
    board_view.play();
    var pa=document.getElementById('puntajea')
    pa.value=board_view.puntos_a;
    var pe=document.getElementById('puntajeb')
    pe.value=board_view.puntos_b;

    if(board_view.puntos_a<11 && board_view.puntos_b<11)
        window.requestAnimationFrame(controller);
    else
        {
            ganador="A";
            if(board_view.puntos_b>=11)
                ganador="B";
            alert("Juego termino gano el jugador:"+ganador)
            location.reload();
        }
}