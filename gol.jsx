
var X=50,Y=30;

var cellField=[];
var hyperField=[];
var newHyperField=[];

var numberOfLifeCells=0;
//var newNumberOfLifeCells=0;

var offset=11;
var generation=0;
var Speed="off";
var inMS=10000;

/*

class Cell extends React.Component
{
  
  constructor(props){
   super(props);
   this.state = { className: props.status };
   this.cellClicked = this.cellClicked.bind(this); 
   
  }
  

  cellClicked(e){
   e.preventDefault();
   console.log("cell has been clicked");
   this.setState({className: "lifecell"});
   //this.props.status="lifecell";
  }

  render(){
           return (<div className={this.props.status} onClick={this.cellClicked}></div>);
         }  
}
*/


function Cell(props){

 
 function cellClicked(e){
   var x=parseInt(props.x),y=parseInt(props.y);
   var of=offset;

   e.preventDefault();
   console.log("cell has been clicked x="+props.x+" y="+props.y);
   if( !isNaN(x) && !isNaN(y))
    {cellField[X*y+x]=true;
     hyperField[(y+of)*128+x+of]=true;
     ++numberOfLifeCells; 
     newScreen();
    }
   
  }
 

 return (<div className={props.status} onClick={cellClicked}></div>);
}



function Screen(props)
{    
  var i,j;
  var matrix=[];
  var cn;
  
  function cellElement(i,j,cn) 
   {var x,n,v,vs;
    var id;  
    var of=offset;

    if(cn)
     {x="lifecell";
      n=numberOfLifeCells;
      v=(j+of)*128+i+of;
      hyperField[v]=true;
     }
    else
     {x="deadcell";}
    id=(j+of)*128+i+of;
    return (<Cell key={id} id={id} status={x} x={i} y={j}/>);
   }
  
  console.log("Screen() executed");
  console.log("props.st = "+props.st);
  if(props.st=="init")
   {initScreen();}
  
  
  for(j=0;j<Y;++j)
  {for(i=0;i<X;++i)
    { 
      cn=cellField[X*j+i];
      matrix.push(cellElement(i,j,cn));
    } 
   
  } 
             
  
  console.log("number of life cells "+numberOfLifeCells);           
  
 return (<div>{matrix}</div>); 
}

function getRandom(){
  var i=Math.floor(Math.random()*2);
  if(i==1)
   {return true;}
  else
   {return false;} 
}

function initScreen(){
  var i;
  for(i=0;i<X*Y;++i)
   {cellField[i]=getRandom();
    if(cellField[i])
     {++numberOfLifeCells;}
   } 
  
 eraseHyperField();
 eraseNewHyperField();
 console.log("initScreen executed");
  
}

function eraseHyperField(){
 var  i,j;
 for(j=0;j<128;++j)
  {for(i=0;i<128;++i)
    {hyperField[j*128+i]=false;}
  }
}

function eraseNewHyperField(){
 var  i,j;
 for(j=0;j<128;++j)
  {for(i=0;i<128;++i)
    {newHyperField[j*128+i]=false;}
  }
}


function eraseCellField(){
 var  i,j;
 for(j=0;j<Y;++j)
  {for(i=0;i<X;++i)
    {cellField[j*X+i]=false;}
  }
}



ReactDOM.render(<Screen st="init"/>,
     document.getElementById('screen')
   );

function initGlider(){
  var v;
  var of=offset;

  console.log("initGlider() executed");
  
  eraseHyperField();
  eraseNewHyperField();
  eraseCellField();

  v=(15+of)*128+25+of;// x=25 y=15
  hyperField[v]=true;
  cellField[X*15+25]=true;

  v=(15+of)*128+26+of;
  hyperField[v]=true;
  cellField[X*15+26]=true;
  
  v=(15+of)*128+27+of;
  hyperField[v]=true;
  cellField[X*15+27]=true;

  v=(14+of)*128+25+of;
  hyperField[v]=true;
  cellField[X*14+25]=true;

  v=(13+of)*128+26+of;
  hyperField[v]=true;
  cellField[X*13+26]=true;
  
  numberOfLifeCells=5;
  newScreen(); 

}

function newScreen(){
 ReactDOM.render(<Screen />,document.getElementById('screen') );
}

function update(){
 var v,k;
 var of=offset;

 console.log("update executed");

  
 /*
 v=(15+of)*128+25+of;
 checkLife(v);
 v=(15+of)*128+26+of;
 checkLife(v); 
 v=(15+of)*128+27+of;
 checkLife(v);
 v=(14+of)*128+25+of;
 checkLife(v);
 v=(13+of)*128+26+of;
 checkLife(v);
 */

 eraseNewHyperField();
 k=cameToLife();
 numberOfLifeCells=k;
 console.log("number of life cells "+numberOfLifeCells);
 swapHyper();
 ++generation; 

 function checkLife(x,y){
    var r=0;
    var v;
    var x,y;
    var of=offset;
    
        
     if( hyperField[ (y+of)*128+x+1+of ] ){++r;}
     if( hyperField[ (y+of)*128+x-1+of ] ){++r;}
     if( hyperField[ (y+1+of)*128+x+1+of ] ){++r;}
     if( hyperField[ (y+1+of)*128+x+of ] ){++r;}
     if( hyperField[ (y+1+of)*128+x-1+of ] ){++r;}
     if( hyperField[ (y-1+of)*128+x+1+of ] ){++r;}
     if( hyperField[ (y-1+of)*128+x+of ] ){++r;} 
     if( hyperField[ (y-1+of)*128+x-1+of ] ){++r;}
     
    
    
    //console.log("checkLife()"+" x="+x+" y="+y+" r="+r);
    return r;
  }

 function cameToLife(){
   var v;
   var x,y,n,k=0;
   var of=offset;
  
   for(y=0;y</*128*/Y;++y)
    {for(x=0;x</*128*/X;++x)  
      { 
        v=(y+of)*128+x+of;
       
        if(hyperField[ v ]==false) //if cell is dead
          {n=checkLife(x,y);
           if(n==3) 
            {newHyperField[v]=true;
             ++k;
            } 
          }

        if(hyperField[v]) // if cell is alive
         {n=checkLife(x,y);
           if( n==3 || n==2 ){newHyperField[v]=true;++k;}
           else {newHyperField[v]=false;}
         }
        
      }
    }
   console.log("cameToLife() executed");
   return k;
  }

 function swapHyper(){
  var x,y,v;

   for(y=0;y<128;++y)
    {for(x=0;x<128;++x)  
      {v=y*128+x;hyperField[v]=newHyperField[v];}
    }

  eraseNewHyperField();
  console.log("swapHyper() executed"); 
 }

}

function updateCellField(){
  var x,y,v;
  var of=offset;
  

  eraseCellField();
  for(y=0;y<Y;++y)
   {for(x=0;x<X;++x)  
     {v=(y+of)*128+x+of;cellField[X*y+x]=hyperField[v];}
   }

  console.log("updateCellField() executed");
}

function oneStep(){
 update();
 updateCellField();
 newScreen();
 showGenerationNumber();
}

function showGenerationNumber(){

 ReactDOM.render(<GenDisplay/>,document.getElementById('generations'));
 function GenDisplay(){
  return (<div>generations: {generation}</div>);
 }

}


function initRPentomino(){
  var v;
  var of=offset;
 
  eraseHyperField();
  eraseNewHyperField();
  eraseCellField();

  v=(15+of)*128+25+of;// x=25 y=15
  hyperField[v]=true;
  cellField[X*15+25]=true;
  v=(15+of)*128+26+of;
  hyperField[v]=true;
  cellField[X*15+26]=true;
  v=(16+of)*128+25+of;
  hyperField[v]=true;
  cellField[X*16+25]=true;
  v=(16+of)*128+24+of;
  hyperField[v]=true;
  cellField[X*16+24]=true;
  v=(17+of)*128+25+of;
  hyperField[v]=true;
  cellField[X*17+25]=true;

  numberOfLifeCells=5;
  newScreen(); 

  console.log("initRPentomino() executed");
}

function clearScreen(){
 eraseHyperField();
 eraseNewHyperField();
 eraseCellField();
 numberOfLifeCells=5;
 newScreen();  
 generation=0;
 showGenerationNumber();
}

function onOff(){

 if(Speed=="off"){slowSpeed();return 0;}
 if(Speed=="slow"){Speed="off";inMS=10000;return 0;}
 if(Speed=="fast"){Speed="off";inMS=10000;return 0;}
}

function slowSpeed(){
 Speed="slow";
 inMS=2000;
}

function fastSpeed(){
 Speed="fast";
 inMS=100;
}

function res50x30(){
 X=50;
 Y=30;
 //somehow change div screen defined in sass(css)
}

function res70x40(){
 X=70;
 Y=40;
 //somehow change div screen defined in sass(css)
}

function res100x60(){
 X=50*2;
 Y=30*2;
 //somehow change div screen defined in sass(css)
}

setInterval(function()
  {
   if(Speed!="off")
    {oneStep();}
   console.log("setInterval executed inMS="+inMS+" Speed="+Speed);
  }          
  ,inMS);



