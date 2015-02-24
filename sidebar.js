var target;
var steps = 0;

var tokenBoard = d3.selectAll('.bigboard')
  .data([0]).enter().append('svg')
  .attr('class', 'tokenBoard')
  .attr( 'width', settings.tokenH )
  .attr( 'height', settings.height )

var tokenCurrentBox = tokenBoard.selectAll('.tokenCurrentBox')
  .data([0]).enter().append('rect')
  .attr('class', 'tokenCurrentBox')
  .attr({
    'x': 0,
    'y': 11,
    // 'rx': 5,
    // 'ry': 5,
    'width': 38,
    'height': 42,
  })


var tokens = tokenBoard.selectAll('.tokens')
  .data(landmark).enter().append('text')
  .attr('class', 'tokens')
  .attr( 'id', function(d,i){return "token-" + i} )
  .attr("x", function(d) { return 7})
  .attr("y", function(d,i) { return i * (block + 10) + 45})
  .attr("font-size", "32px")
  .html( function(d) { return d[2] })
  .attr("fill", function(d){ return d[3]})

var startBoard = d3.selectAll('.bigboard')
  .data([0]).enter().append('svg')
  .attr('class', 'startBoard')
  .attr( 'width', 170 )
  .attr( 'height', settings.height + 6 )

var timerBox = startBoard.selectAll('.startBoard')
  .data([0]).enter().append('rect')
  .attr('class', 'timerBox')
  .attr({
    'x': 10,
    'y': 10,
    'rx': 5,
    'ry': 5,
    'width': 150,
    'height': 150,
  })

var timer = 60;
var interval = false;
var timerText = startBoard.selectAll('.startBoard')
  .data([["TIMER",25], [60,70]]).enter().append('text')
  .attr('class', 'timerText')
  .attr( 'id', function(d,i){return "timerText-" + i} )
  .text(function(d){ return d[0] })
  .attr("x", function(d,i){return 45 +( i * 4) })
  .attr("y", function(d,i){return 55 + (i * 65)})
  .attr("font-size", function(d){return d[1] + "px" })
  .attr("fill", "white")
  .on("mouseover", function(){
    d3.selectAll(".timerText").attr("fill", "green")
  })
  .on("mouseleave", function(){
    d3.selectAll(".timerText").attr('fill', 'white')
  })
  .on('click', function(d){
    if( !interval ){
      interval = setInterval(function(){
        timer -= 1;
        if( timer < 10 ){
          d3.select('#timerText-1').transition().duration(50).attr("x", 64);
        }
        d3.select("#timerText-1").text(timer);
        if( timer <= 0 ){
          clearInterval(interval);
        }
      }, 1000)
    } else {
      clearInterval(interval);
      interval = false;
      timer = 60
      d3.select('#timerText-1').transition().duration(50).attr("x", 49)
      d3.select("#timerText-1").text(timer);
    }
  })


var stepsBox = startBoard.selectAll('.startBoard')
  .data([0]).enter().append('rect')
  .attr('class', 'stepsBox')
  .attr({
    'x': 10,
    'y': 165,
    'rx': 5,
    'ry': 5,
    'width': 150,
    'height': 150,
  })

var stepsText = startBoard.selectAll('.startBoard')
  .data([["STEPS",25], [0,70]]).enter().append('text')
  .attr('class', 'stepsText')
  .attr( 'id', function(d,i){return "stepsText-" + i} )
  .text(function(d){ return d[0] })
  .attr("x", function(d,i){return 49 + (i * 15)})
  .attr("y", function(d,i){return 215 + (i * 65)})
  .attr("font-size", function(d){return d[1] + "px" })
  .attr("fill", "white")

var startBox = startBoard.selectAll('.startBoard')
  .data([0]).enter().append('rect')
  .attr('class', 'startBox')
  .attr({
    'x': 10,
    'y': 320,
    'rx': 5,
    'ry': 5,
    'width': 150,
    'height': 50,
  })

var startText = startBoard.selectAll('.startBoard')
  .data(["New Game"]).enter().append('text')
  .attr('class', 'startText')
  .text(function(d){ return d })
  .attr("x", 29)
  .attr("y", 353)
  .attr("font-size", "25px")
  .attr("fill", "white")
  .on("mouseover", function(){
    d3.select(this).attr("fill", "green")
  })
  .on("mouseleave", function(){
    d3.select(this).attr('fill', 'white')
  })
  .on("click", function(){
    newGame();
  })

var nextBox = startBoard.selectAll('.startBoard')
  .data([0]).enter().append('rect')
  .attr('class', 'nextBox')
  .attr({
    'x': 10,
    'y': 375,
    'rx': 5,
    'ry': 5,
    'width': 150,
    'height': 50,
  })

var nextText = startBoard.selectAll('.startBoard')
  .data(["Next Round"]).enter().append('text')
  .attr('class', 'nextText')
  .text(function(d){ return d })
  .attr("x", 29)
  .attr("y", 406)
  .attr("font-size", "23px")
  .attr("fill", "white")
  .on("mouseover", function(){
    d3.select(this).attr("fill", "green")
  })
  .on("mouseleave", function(){
    d3.select(this).attr('fill', 'white')
  })
  .on("click", function(){
    nextRound();
  })


var restartBox = startBoard.selectAll('.startBoard')
  .data([0]).enter().append('rect')
  .attr('class', 'restartBox')
  .attr({
    'x': 10,
    'y': 430,
    'rx': 5,
    'ry': 5,
    'width': 150,
    'height': 50,
  })

var nextText = startBoard.selectAll('.startBoard')
  .data(["Reset Round"]).enter().append('text')
  .attr('class', 'nextText')
  .text(function(d){ return d })
  .attr("x", 23)
  .attr("y", 461)
  .attr("font-size", "23px")
  .attr("fill", "white")
  .on("mouseover", function(){
    d3.select(this).attr("fill", "green")
  })
  .on("mouseleave", function(){
    d3.select(this).attr('fill', 'white')
  })
  .on("click", function(){
    restartPlayers();
  })

var updateSteps = function(){
  d3.select('#stepsText-1').attr("fill", "white");  
  if( steps === 0 ){
    d3.select('#stepsText-1').transition().duration(50).attr("x", 64);
  }
  if( steps > 9 ){
    d3.select('#stepsText-1').transition().duration(50).attr("x", 49);
  }
  if( steps > 99 ){
    d3.select('#stepsText-1').transition().duration(50).attr("x", 34);
  }
  d3.select("#stepsText-1").text(steps);

}

var newGame = function(){
  gameStarted = true;
  steps = 0;
  moving = false;
  updateSteps();
  d3.selectAll('.endtarget').attr('class', 'tokens');
  d3.selectAll('.target').attr('class', 'tokens');
  copylandmark = landmark.slice();
  target = getTarget();
  d3.select("#token-" + target[0][4]).attr('class','target');
  moveTokenCurrentBox();
}

var nextRound = function(){
  d3.select("#token-" + target[0][4]).attr('class','endtarget')
  steps = 0;
  updateSteps();
  moving = false;  
  if( !copylandmark.length ){
    alert("end game");
  } else {
  target = getTarget();
  d3.select("#token-" + target[0][4]).attr('class','target');
  }
  movePlayers();
  moveTokenCurrentBox();
}

var restartPlayers = function(){
  steps = 0;
  updateSteps();
  moving = false;
  for( var i = 0; i < player.data.length; i++ ){
    d3.select('#player-' + i).transition().duration(100)
      .attr({
          cy: function(d){ return d3.select('#coaster-' + i)[0][0].y.animVal.value + player.offset},
          cx: function(d){ return d3.select('#coaster-' + i)[0][0].x.animVal.value + player.offset}
      })
  }
}

var movePlayers = function(){
  for( var i = 0; i < player.data.length; i++ ){
    d3.select('#coaster-' + i).transition().duration(100)
      .attr({
          y: function(d){ return d3.select('#player-' + i)[0][0].cy.animVal.value - player.offset},
          x: function(d){ return d3.select('#player-' + i)[0][0].cx.animVal.value - player.offset}
      })
  }
}

var moveTokenCurrentBox = function(){
  var y = d3.select("#token-" + target[0][4])[0][0].y.animVal[0].value - 34;
  d3.select('.tokenCurrentBox').transition().duration(100)
      .attr({
          y: function(d){ return y },
      })
}