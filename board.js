var generateArr = function(number){
  var array = [];
  for( var value = 0; value < number; value++ ){    
    for( var index = 0; index < number; index++ ){
      array.push(value);
    }
  }
  return array;
}

var settings = {
  width: 608,
  height: 608,
};
var block = settings.width/16;
var blockData = generateArr(16);

var player = {
  data: ['orange','blue','red','green'],
  radius: 14,
  offset: block/2,
}


var board = d3.selectAll('body')
  .append('svg')
  .attr( 'class', 'board')
  .attr( 'width', settings.width )
  .attr( 'height', settings.height )


var randomBlockXY = function(){ return (Math.floor(Math.random() * 16) * block) + player.offset; }

var blocks = board.selectAll('.blocks')
  .data( blockData ).enter().append('svg:rect')
  .attr( 'class', 'blocks' )
  .attr( 'id', function(d,i){return "block-" + i} )
  .attr( 'x', function(d, i){return (i % 16) * settings.width/16} )
  .attr( 'y', function(d, i){return d * settings.width/16} )
  .attr( 'width', settings.width/16 )
  .attr( 'height', settings.width/16 )

board.select("#block-119").attr("class", "black")
board.select("#block-120").attr("class", "black")
board.select("#block-135").attr("class", "black")
board.select("#block-136").attr("class", "black")

var syms = ['&#10052;','&#10026;', '&#10050;'];
var landmark = [[2,4, syms[0],player.data[0]], [1,9,syms[0],player.data[1]],[11,14,syms[0],player.data[2]],[11,6,syms[0],player.data[3]],
               [4,10,syms[1],player.data[0]],[12,9,syms[1],player.data[1]],[13,1,syms[1],player.data[2]],[9,12,syms[1],player.data[3]],
               [14,13,syms[2], player.data[0]], [5,2,syms[2], player.data[1]],[7,5,syms[2], player.data[2]], [3,14,syms[2], player.data[3]]]
var landmarks = board.selectAll('.landmarks')
  .data(landmark).enter().append('text')
  .attr('class', '.landmarks')
  .attr("x", function(d) { return d[0] * block + 7})
  .attr("y", function(d) { return d[1] * block + 33})
  .attr("font-size", "35px")
  .html( function(d) { return d[2] })
  .attr("fill", function(d){ return d[3]})
  .attr("opacity", "0.6")

var currentObject = null;
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

var llineData = [[7,7],[7,8],[9,7],[9,8],[4,0],[12,0],[7,15],[14,15],[2,9],[3,4],[6,2],[6,8],[4,10],[3,14],[6,13],[7,5],[9,12],[12,6],[12,14],[13,9],[13,1],[14,5],[14,13]];
var _lineData = [[7,7],[8,7],[7,9],[8,9],[0,5],[0,12],[15,10],[14,14],[1,10],[2,4],[5,3],[5,8],[4,11],[5,13],[3,14],[7,6],[9,12],[11,6],[12,9],[11,15],[13,1],[14,6],[15,4]];
//(x = columns, y = rows--)

var lline = board.selectAll('.llines')
  .data(llineData).enter().append('rect')
  .attr('class', 'lline')
  .attr({
    'x': function(d){ return d[0] * block },
    'y': function(d){ return d[1] * block },
    'width': 3,
    'height': block
  })

var _line = board.selectAll('._lines')
  .data(_lineData).enter().append('rect')
  .attr('class', '_line')
  .attr({
    'x': function(d){ return d[0] * block },
    'y': function(d){ return d[1] * block },
    'width': block,
    'height': 3
  })

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
  //move currentObject
  d3.select(data).transition().duration(200)
    .attr({
        cx: (closestBlock[1] * 38) + player.offset
    })
    .each("end", function(){ moving = false;})
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

    //move currentObject
    d3.select(data).transition().duration(200)
      .attr({
          cy: (closestBlock[1] * 38) + player.offset
      })
      .each("end", function(){ moving = false;})
  }

d3.select("body")
  .on("keydown", function() {
    if( moving === false ){
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
