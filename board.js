var currentObject = null;


//Creates SVG Body
var bigboard = d3.selectAll('#board')
  .append('svg')
  .attr( 'class', 'bigboard')
  .attr( 'width', settings.width + 100)
  .attr( 'height', settings.height)

//Creates SVG Board
var board = d3.selectAll('.bigboard')
  .attr('class', 'board')
  .attr( 'width', settings.width )
  .attr( 'height', settings.height )
  

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

var coasters = board.selectAll('.coasters')
  .data(player.data).enter().append('rect')
  .attr('class', 'coasters')
  .attr( 'id', function(d,i){return "coaster-" + i} )
  .attr({
    'x': function(d){ return randomBlockXY(); },
    'y': function(d){ return randomBlockXY(); },
    'width': block,
    'height': block,
    'fill': function(d){ return d; },
    'opacity': .2
  })

    // 'x': function(d, i){ return Math.floor(d3.select('#player-' + i)[0][0].cx.animVal.value/block) * block},
    // 'y': function(d, i){ return Math.floor(d3.select('#player-' + i)[0][0].cy.animVal.value/block) * block},

//Creates Players on Board
var players = board.selectAll('.players')
  .data(player.data).enter().append('circle')
  .attr('class', 'players')
  .attr( 'id', function(d,i){return "player-" + i} )
  .attr('class', function(d){ return d})
  .attr({
    cx: function(d,i){ return d3.select('#coaster-' + i)[0][0].x.animVal.value + player.offset},
    cy: function(d,i){ return d3.select('#coaster-' + i)[0][0].y.animVal.value + player.offset},
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

  updateSteps();
  console.log(target[0][0], closestBlock[1], target[0][1],playerY)
  if( target[0][0] === closestBlock[1] && target[0][1] === playerY && d3.select(currentObject).classed(target[0][3]) ){
    console.log("yay");
  }

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

    updateSteps();
      console.log(target[0][0], playerX, target[0][1],closestBlock[1])

    if( target[0][0] === playerX && target[0][1] === closestBlock[1] && d3.select(currentObject).classed(target[0][3])){
      console.log("yay");
    }
  }

//Keyboard Events
var gameStarted = false;
d3.select("body")
  .on("keydown", function() {
    var key = d3.event.keyCode
    if( moving === false && currentObject !== null && gameStarted){
      if( key === 37 ){
        updateLeftRight(currentObject, "left"); 
      }
      if( key === 39 ){
        updateLeftRight(currentObject, "right"); 
      }
      if( key === 38 ){
        updateTopBot(currentObject, "top"); 
      }
      if( key === 40 ){
        updateTopBot(currentObject, "bot"); 
      }      
    }
    if( key === 83 ){
      newGame();
    }
    if( gameStarted && key === 78 ){
      nextRound();
    }
    if( gameStarted && key === 82 ){
      restartPlayers();
      updateSteps();
    }
  });
//press s to start new game
//press n for next game