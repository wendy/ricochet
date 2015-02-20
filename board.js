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
var currentObject = null;

var board = d3.selectAll('body')
  .append('svg')
  .attr( 'class', 'board')
  .attr( 'width', settings.width )
  .attr( 'height', settings.height )
  .style( "border", "1px solid black")


var randomBlockXY = function(){ 
  return (Math.floor(Math.random() * 16) * block) + 19;
}

var blocks = board.selectAll('.blocks')
  .data( blockData )
  .enter()
  .append('svg:rect')
  .attr( 'class', 'blocks' )
  .attr( "x", function(d, i){return (i % 16) * settings.width/16} )
  .attr( 'y', function(d, i){return d * settings.width/16} )
  .attr( 'width', settings.width/16 )
  .attr( 'height', settings.width/16 )
// var blocks = d3.select('svg').selectAll('.blocks')
//   .data( d3.range( settings.n )).enter()
//   .append("svg:image")
//   .attr('class', 'blocks')
//   .attr('xlink:href', 'ray1.png')
//   .attr('class', 'blocks')
//   .attr("x", function(d){return d*30})
//   .attr('y', '0')
//   .attr( 'width', '40' )
//   .attr( 'height', '40')

blocks.data(blockData).each(function(d){console.log(d)})

// var line = board.selectAll('.lines')
//   .data([1])
//   .enter().append('line')
//   .attr("class", "line")
//   .attr()
//   .attr()


var players = board.selectAll('.players')
  .data(["orange","blue","yellow","green"])
  .enter().append('circle')
  .attr('class', 'players')
  .attr({
    cx: function(d){ return randomBlockXY(); },
    cy: function(d){ return randomBlockXY(); },
    r: 14,
    fill: function(d){ return d; }
  })
  .on("mouseover", function(d){
    d3.select(this).attr("fill", "red");
  })
  .on("mouseout", function(d){
    d3.select(this).attr("fill", function(d){ return d; });
  })
  .on("click", function(d){
    d3.select(currentObject)
      .transition()
      .duration(500)
      .attr('r', 14);
    d3.select(this)
      .transition()
      .duration(500)
      .attr('r', 17);
    currentObject = this;
      // .ease('linear')
      // .attr("cx", 50)
  })

var blockers = board.selectAll('.blockers')
  .data([[266,266],[266,304],[342,266],[342,304],[114,152],[76, 342],[152,0],[456,0],[266,570],[532,570],[228,76],[152,380],[342,456],[228,304],[114,532],[456,228],[228,494],[266,190],[456,532],[494,342],[532,190],[532,494]]).enter().append('rect')
  .attr('class', 'blockers')
  .attr( "x", function(d){ return d[0]} )
  .attr( 'y', function(d){ return d[1]} )
  .attr( 'width', 3)
  .attr( 'height', settings.height/16)

var topBlockers = board.selectAll('.topBlockers')
  .data([[266,266],[304,266],[266,342],[304,342],[0,190],[0,456],[76, 152],[38,380],[570,152],[570,380],[190,114],[152,418],[342,456],[190,304],[114,532],[418,228],[190,494],[266,228],[418,570],[456,342],[532,228],[532,532]]).enter().append('rect')
  .attr('class', 'topBlockers')
  .attr( "x", function(d){ return d[0]} )
  .attr( 'y', function(d){ return d[1]} )
  .attr( 'width', settings.height/16 )
  .attr( 'height', 3 )

var moving = false;

function updateLeftRight(data, LorR){
  moving = true;
    var y = data.cy.animVal.value - 19.25;
    var x = data.cx.animVal.value - 19.25;
    var bblockers = blockers[0];
    var distance = 0;
    var closestBlock;
    var left = false;

    if( LorR === "left" ){ 
      left = true;
      closestBlock = [x, 0];
      var change = function(xx){
        distance = x - xx;
        if( distance >= 0 && distance < closestBlock[0] ){
          closestBlock = [distance, xx];
        }
      }
    } else {
      closestBlock = [608 - x, 570];
      var change = function(xx){
        distance = xx - x;
        if( distance > 0 && distance < closestBlock[0] ){
          closestBlock = [distance, xx - 38];
        }
      }
    }


    //check for blockers same y ---
    for( var i = 0; i < bblockers.length; i++ ){
      var by = bblockers[i].y.animVal.value;
      var bx = bblockers[i].x.animVal.value;
      if( by === y ){
        change(bx);
      }
    }

    //check for circles
    for( var i = 0; i < players[0].length; i++ ){
      var cy = players[0][i].cy.animVal.value - 19;
      var cx = players[0][i].cx.animVal.value - 19;
      if( cy === y ){
        if( cx !== x ){
          if( left === true ){
            cx += 38;
          } 
          change(cx);   
        }
      }
    }
    //move currentObject
    d3.select(data).transition().duration(300)
      .attr({
          cx: closestBlock[1] + 19
      })
      .each("end", function(){ moving = false;})
}

function updateTopBot(data, TorB){
  moving = true;
    var y = data.cy.animVal.value - 19;
    var x = data.cx.animVal.value - 19;
    var bblockers = topBlockers[0];
    var distance = 0;
    var closestBlock;
    var circle = false;

    if( TorB === "top" ){
      closestBlock = [y, 0];
      var change = function(yy){
        if( circle === true ){
          yy += 38
        }
        distance = y - yy;
        if( distance >= 0 && distance < closestBlock[0] ){
          closestBlock = [distance, yy];
        }
      }
    } else {
      closestBlock = [608 - y, 570];
      var change = function(yy){
        if( circle === true ){
          distance = yy - y + 37;
        } else {
          distance = yy - y;
        }
        if( distance > 0 && distance < closestBlock[0] ){
          closestBlock = [distance, yy - 38];
        }
      }
    }

    for( var i = 0; i < bblockers.length; i++ ){
      var by = bblockers[i].y.animVal.value;
      var bx = bblockers[i].x.animVal.value;
      if( bx === x ){
        change(by);
      }
    }

    //check for circles
    for( var i = 0; i < players[0].length; i++ ){
      var cy = players[0][i].cy.animVal.value - 19;
      var cx = players[0][i].cx.animVal.value - 19;
      if( cx === x ){
        console.log(cy, y)
        if( cy !== y ){
          console.log('in');
          circle = true;
          change(cy);   
        }
      }
    }
    console.log(closestBlock)
    //move currentObject
    d3.select(data).transition().duration(300)
      .attr({
          cy: closestBlock[1] + 19
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
