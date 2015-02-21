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
  bodyW: window.innerWidth, 
  bodyH: window.innerHeight,
  width: 608,
  height: 608,
  tokenH: 38,
};

var block = settings.width/16;
var blockData = generateArr(16);

var player = {
  data: ['orange','blue','red','green'],
  radius: 14,
  offset: block/2,
}


var randomNumber = function(max){ return Math.floor(Math.random() * max) }

var randomBlockXY = function(){ 
  var number = 7;
  while (number === 7 || number === 8) {
    number = randomNumber(16);
  }
  return ( number * block) + player.offset; 
}
 
var syms = ['&#10052;','&#10026;', '&#10050;'];
var landmark = [[2,4, syms[0],player.data[0]], [1,9,syms[0],player.data[1]],[11,14,syms[0],player.data[2]],[11,6,syms[0],player.data[3]],
  [4,10,syms[1],player.data[0]],[12,9,syms[1],player.data[1]],[13,1,syms[1],player.data[2]],[9,12,syms[1],player.data[3]],
  [14,13,syms[2], player.data[0]], [5,2,syms[2], player.data[1]],[7,5,syms[2], player.data[2]], [3,14,syms[2], player.data[3]]]

var llineData = [[7,7],[7,8],[9,7],[9,8],[4,0],[12,0],[7,15],[14,15],[2,9],[3,4],[6,2],[6,8],[4,10],[3,14],[6,13],[7,5],[9,12],[12,6],[12,14],[13,9],[13,1],[14,5],[14,13]];
var _lineData = [[7,7],[8,7],[7,9],[8,9],[0,5],[0,12],[15,10],[14,14],[1,10],[2,4],[5,3],[5,8],[4,11],[5,13],[3,14],[7,6],[9,12],[11,6],[12,9],[11,15],[13,1],[14,6],[15,4]];

var copylandmark = landmark.slice();
var getTarget = function(){
  var index = randomNumber(copylandmark.length);
  var target = copylandmark.splice(index, 1);
  return target;
}
