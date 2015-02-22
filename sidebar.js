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
  .attr("font-size", "32px")
  .html( function(d) { return d[2] })
  .attr("fill", function(d){ return d[3]})

var startBoard = d3.selectAll('.bigboard')
  .data([0]).enter().append('svg')
  .attr('class', 'startBoard')
  .attr( 'width', 170 )
  .attr( 'height', settings.height )

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
  .on('click', function(d){
    if( !interval ){
      interval = setInterval(function(){
        timer -= 1;
        if( timer < 10 ){
          d3.select('#timerText-1').transition().duration(50)
            .attr("x", 64);
        }
        d3.select("#timerText-1").text(timer);
        if( timer <= 0 ){
          clearInterval(interval);
          interval = false;
        }
      }, 100)
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

var target;
var steps = 0;
//target[0][0] - x, target[0][1] - y
// console.log(target[0][3]);
//when game ends - change token, step 0, 
// d3.select(currentObject).classed(target[0][3]) - boolean

var updateSteps = function(){
  if( steps === 0 ){
    d3.select('#stepsText-1').transition().duration(50)
      .attr("x", 64);
  }
  if( steps > 9 ){
    d3.select('#stepsText-1').transition().duration(50)
      .attr("x", 49);
  }
  d3.select("#stepsText-1").text(steps);

}

var newGame = function(){
  gameStarted = true;
  steps = 0;
  updateSteps();
  d3.selectAll('.endtarget').attr('class', 'tokens');
  d3.selectAll('.target').attr('class', 'tokens');
  copylandmark = landmark.slice();
  target = getTarget();
  d3.select("#token-" + target[0][4]).attr('class','target');
}

var nextRound = function(){
  d3.select("#token-" + target[0][4]).attr('class','endtarget')
  steps = 0;   
  updateSteps();
  if( !copylandmark.length ){
    alert("end game");
  } else {
  target = getTarget();
  d3.select("#token-" + target[0][4]).attr('class','target');
  }
}

var restartPlayers = function(){
  steps = 0;
  for( var i = 0; i < player.data.length; i++ ){
    d3.select('#player-' + i).transition().duration(100)
      .attr({
          cy: function(d){ return d3.select('#coaster-' + i)[0][0].y.animVal.value + player.offset},
          cx: function(d){ return d3.select('#coaster-' + i)[0][0].x.animVal.value + player.offset}
      })
  }
}