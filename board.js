var currentObject = null;
var target = getTarget();
var steps = 0;
console.log(target[0][2]);

//Creates SVG Board
var bigboard = d3.selectAll('#board')
  .append('svg')
  .attr( 'class', 'bigboard')
  .attr( 'width', settings.width + 100)
  .attr( 'height', settings.height)

var board = d3.selectAll('.bigboard')
  .attr('class', 'board')
  .attr( 'width', settings.width )
  .attr( 'height', settings.height )
  

var tokenBoard = d3.selectAll('.bigboard')
  .data([0]).enter().append('svg')
  .attr('class', 'tokenBoard')
  .attr( 'width', settings.tokenH )
  .attr( 'height', settings.height )

var tokens = tokenBoard.selectAll('.tokens')
  .data(landmark).enter().append('text')
  .attr('class', 'tokens')
  .attr( 'id', function(d,i){return "token-" + i} )
  .attr("x", function(d) { return 7})
  .attr("y", function(d,i) { return i * (block + 10) + 45})
  .attr("font-size", "35px")
  .html( function(d) { return d[2] })
  .attr("fill", function(d){ return d[3]})
  .attr("opacity", "0.8")

// d3.select("#token-1").



//Creates SVG Blocks on Board
var blocks = board.selectAll('.blocks')
  .data( blockData ).enter().append('svg:rect')
  .attr( 'class', 'blocks' )
  .attr( 'id', function(d,i){return "block-" + i} )
  .attr( 'x', function(d, i){return (i % 16) * settings.width/16} )
  .attr( 'y', function(d, i){return d * settings.width/16} )
  .attr( 'width', settings.width/16 )
  .attr( 'height', settings.width/16 )

//Creates Square Center Block on Board
board.select("#block-119").attr("class", "black")
board.select("#block-120").attr("class", "black")
board.select("#block-135").attr("class", "black")
board.select("#block-136").attr("class", "black")

//Puts LandMarks Pieces on Board
var landmarks = board.selectAll('.landmarks')
  .data(landmark).enter().append('text')
  .attr('class', 'landmarks')
  .attr("x", function(d) { return d[0] * block + 7})
  .attr("y", function(d) { return d[1] * block + 33})
  .attr("font-size", "35px")
  .html( function(d) { return d[2] })
  .attr("fill", function(d){ return d[3]})
  .attr("opacity", "0.6")

//Creates Players on Board
var players = board.selectAll('.players')
  .data(player.data).enter().append('circle')
  .attr('class', 'players')
  .attr({
    cx: function(d){ return randomBlockXY(); },
    cy: function(d){ return randomBlockXY(); },
    r: player.radius,
    fill: function(d){ return d; }
  })
  .on('click', function(d){
    d3.select(currentObject)
      .transition()
      .duration(500)
      .attr('r', 14);
    d3.select(this)
      .transition()
      .duration(500)
      .attr('r', 17);
    currentObject = this;
  })

//Creates Vertical Blockers on Board
var lline = board.selectAll('.llines')
  .data(llineData).enter().append('rect')
  .attr('class', 'lline')
  .attr({
    'x': function(d){ return d[0] * block },
    'y': function(d){ return d[1] * block },
    'width': 3,
    'height': block
  })

//Creates Horizontal Blockers on Board
var _line = board.selectAll('._lines')
  .data(_lineData).enter().append('rect')
  .attr('class', '_line')
  .attr({
    'x': function(d){ return d[0] * block },
    'y': function(d){ return d[1] * block },
    'width': block,
    'height': 3
  })

//Move Function
var moving = false;
function updateLeftRight(data, LorR){
  moving = true;
  var playerY = Math.floor(data.cy.animVal.value/block);
  var playerX = Math.floor(data.cx.animVal.value/block);
  var distance = 0;
  var closestBlock, change, left;

  if( LorR === "left" ){ 
    left = true;
    closestBlock = [ playerX, 0];
    change = function( DataX ){
      if( DataX <= playerX ){
        distance = playerX - DataX;
        if( distance <= closestBlock[0] ){
          closestBlock = [distance, DataX];
        }
      }
    }
  } else {
    closestBlock = [16 - playerX, 15];
    change = function( DataX ){
      if( DataX > playerX ){
        distance = DataX - playerX + 1;
        if( distance <= closestBlock[0] ){
          closestBlock = [distance, DataX - 1];
        }
      }
    }
  }
  //check for blockers
  for( var i = 0; i < llineData.length; i++ ){
    if( playerY === llineData[i][1] ){
      change( llineData[i][0] )
    }
  }
  //check for circles
  for( var i = 0; i < players[0].length; i++ ){
    var circleY = Math.floor(players[0][i].cy.animVal.value/block);
    var circleX = Math.floor(players[0][i].cx.animVal.value/block);
    if( circleY === playerY && circleX !== playerX){
      if( left === true ){
        circleX += 1;
      } 
      change(circleX);   
    }
  }

  if( closestBlock[1] !== playerX ){
    steps += 1;
  }
  //move currentObject
  d3.select(data).transition().duration(200)
    .attr({
        cx: (closestBlock[1] * 38) + player.offset
    })
    .each("end", function(){ moving = false;})

  console.log(steps)
}

function updateTopBot(data, TorB){
  moving = true;
  var playerY = Math.floor(data.cy.animVal.value/block);
  var playerX = Math.floor(data.cx.animVal.value/block);
  var distance = 0;
  var closestBlock, circle;

    if( TorB === "top" ){
      closestBlock = [ playerY, 0 ];
      change = function(DataY){
        if( DataY <= playerY ){
          if( circle === true ){
            DataY += 1;
          }
          distance = playerY - DataY;
          if( distance <= closestBlock[0] ){
            closestBlock = [distance, DataY];
          }   
        }
      }
    } else {
      closestBlock = [15 - playerY, 15];
      change = function(DataY){
        if( DataY > playerY ){
          DataY -= 1;
          distance = DataY - playerY;
          if( distance < closestBlock[0] ){
            closestBlock = [distance, DataY]
          }
        }
      }
    }

    for( var i = 0; i < _lineData.length; i++ ){
      if( playerX === _lineData[i][0] ){
        change( _lineData[i][1] );
      }
    }

    // check for circles
    for( var i = 0; i < players[0].length; i++ ){
      var circleY = Math.floor(players[0][i].cy.animVal.value/block);
      var circleX = Math.floor(players[0][i].cx.animVal.value/block);
      if( circleX === playerX && circleY !== playerY ){
        circle = true;
        change(circleY);   
      }
    }

    if( closestBlock[1] !== playerY ){
      steps += 1;
    }

    //move currentObject
    d3.select(data).transition().duration(200)
      .attr({
          cy: (closestBlock[1] * 38) + player.offset
      })
      .each("end", function(){ moving = false;})

    console.log(steps);
  }

//Keyboard Events
d3.select("body")
  .on("keydown", function() {
    if( moving === false && currentObject !== null){
      if( d3.event.keyCode === 37 ){
        updateLeftRight(currentObject, "left"); 
      }
      if( d3.event.keyCode === 39 ){
        updateLeftRight(currentObject, "right"); 
      }
      if( d3.event.keyCode === 38 ){
        updateTopBot(currentObject, "top"); 
      }
      if( d3.event.keyCode === 40 ){
        updateTopBot(currentObject, "bot"); 
      }      
    }
  });
