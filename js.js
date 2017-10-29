
let player1Turn;
let player2Turn;
let player1;
let player2;
let currentPlayer = "X";
let positions = ["xo0", "xo1", "xo2", "xo3", "xo4", "xo5", "xo6", "xo7", "xo8"];
let board = ["", "", "", "", "", "", "", "", ""];
let singlePlayer; //boolean
let canPlay = false;
let fadeTimer = 1000;
let cpuFirst = false;
let difficulty;
let winConditions = [
  [0,1,2],
  [3,4,5],
  [6,7,8],//horz
  [0,3,6],
  [1,4,7],
  [2,5,8],//vert
  [0,4,8],
  [2,4,6]//diag
];
let test = [
  {score: -123, index: 0},
  {score: 123423, index: 0},
  {score: 1223, index: 0},
  {score: 1423, index: 0},
  {score: 156723, index: 0},
  {score: 13223, index: 0},
  {score: 23423, index: 0},
  {score: 122343, index: 0},
  {score: 1243, index: 0},
  {score: 1223, index: 0},
  {score: 1263, index: 0},
  {score: 12003, index: 0},

]

$(()=>{
  $("#test").click(()=>{
    reset();
    console.log(minValue(test));
  });

  $(".xo").click((e)=>{
    placePiece(e.target.id);
  });



  $("#reset").click(()=>{
    reset();

  });

  $("#onePlayer").click(()=>{

    singlePlayer = true;
    $(".playerChoice").fadeOut(fadeTimer, ()=>{
      $(".difficultyChoice").fadeIn(fadeTimer);
    });

  });

  $("#twoPlayer").click(()=>{
    singlePlayer = false;
    $(".playerChoice").fadeOut(fadeTimer, ()=>{
      $(".xoSelect").fadeIn(fadeTimer);
    });
  });
  // difficultyChoice

    $("#easy").click(()=>{
      difficulty = 3;
      $(".difficultyChoice").fadeOut(fadeTimer, ()=>{
        $(".xoSelect").fadeIn(fadeTimer);
      });
    });

    $("#hard").click(()=>{
      difficulty = 9;
      $(".difficultyChoice").fadeOut(fadeTimer, ()=>{
        $(".xoSelect").fadeIn(fadeTimer);
      });
    });

    $("#impossible").click(()=>{
      difficulty = 10;
      $(".difficultyChoice").fadeOut(fadeTimer, ()=>{
        $(".xoSelect").fadeIn(fadeTimer);
      });
    });


  $("#selectXButton").click(()=>{
    player1 = "X"
    player2 = "O"
    startGame();
  });

  $("#selectOButton").click(()=>{
    player1 = "O"
    player2 = "X"
    startGame();
  });

  // $("#test").click(()=>{
  //   cpuLogic();
  // });


});

function startGame(){

  let rand = Math.floor(Math.random() * 2);
  if (rand === 0) {
    currentPlayer = "X"
  }
  else{
    currentPlayer = "O"
  }
  $(".xoSelect").fadeOut(fadeTimer, ()=>{
    $(".chalkBoard").fadeIn(fadeTimer, ()=>{
      message("Player 1 is " + player1, ()=>{
        message("\"" + currentPlayer + "\" goes first", ()=>{
          if(player2 === currentPlayer && singlePlayer){
            cpuFirst = true;
            cpuTurn();
          }
          else{
            canPlay = true;
          }
        });
      });
    });
  });
}


function message(message, callback){
  $(".message").html(message);

  $(".message").fadeIn(fadeTimer, ()=>{
    setTimeout(()=>{
      $(".message").fadeOut(fadeTimer, callback)
    }, 300);
  })
}

function placePiece(id){
  let index = positions.indexOf(id);

  if(canPlay){
    if(singlePlayer){
      if(currentPlayer === player1){
        if(board[index] === ""){
          board[index] = currentPlayer;
          $("#" + id).html(currentPlayer);

          if(checkBoard(currentPlayer, board)){
            canPlay = false;
            message("\"" + currentPlayer + "\" WINS!!!", ()=>{

              reset();
            });
            return;
          }
          if(checkDraw(board)){
            canPlay = false;
            message("__DrAw__", ()=>{
              reset();
            });
          }
          else{
            cpuTurn();
          }

        }
      }
    }

    else{//2 player


      if(board[index] === ""){
        board[index] = currentPlayer;
        $("#" + id).html(currentPlayer);

        if(checkBoard(currentPlayer, board)){
          canPlay = false;
          message("\"" + currentPlayer + "\" WINS!!!", ()=>{
            reset();
          });
        }
        if(checkDraw(board)){
          canPlay = false;
          message("__DrAw__", ()=>{
            reset();
          });
        }

        else{
          if(currentPlayer === "X"){
            currentPlayer = "O";
          }
          else{
            currentPlayer = "X";
          }
        }
      }
    }
  }
}

function checkBoard(player, board){


  for (var i = 0; i < winConditions.length; i++) {
    let temp = winConditions[i];


    if(board[temp[0]] === player &&
       board[temp[1]] === player &&
       board[temp[2]] === player){



      return true;
    }
  }
  return false;
}

function checkDraw(board){
  // if(board.indexOf("") === -1){
  //   return true;
  // }
  return board.indexOf("") === -1
}

function cpuTurn(){
  canPlay = false;
  currentPlayer = player2;
  // let arr = [];
  let randTimeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;//sets random time for the cpu to play giving it a feel of human
  setTimeout(()=>{


    let spot = miniMax(board, 0, player2);
    board[spot] = player2//places on board
    $("#" + positions[spot]).html(player2);//displays choice

    if(checkBoard(currentPlayer, board)){
      canPlay = false;
      message("\"" + currentPlayer + "\" WINS!!!", ()=>{
        reset();
      });
    }
    if(checkDraw(board)){
      canPlay = false;
      message("__DrAw__", ()=>{
        reset();
      });
    }

    else{
      currentPlayer = player1;
      canPlay = true;
    }

  }, randTimeout);



}






function miniMax(inBoard, depth, player){

  if(depth < difficulty){
    if (checkDraw(inBoard)) {
      return 0;
    }

    else if (checkBoard(player, inBoard)) {

      if(player === player2){
        return 10;
      }

      if(player === player1){
        return -10;
      }
    }

    else if(inBoard.indexOf("") !== -1){//game still going

      let scores = [];

      inBoard.forEach((item, index)=>{

        if(item === ""){
          // console.log("item: " + item + " index: " + index);
          const boardCopy = inBoard.slice();
          boardCopy[index] = player;

          let nextPlayer = (player === player1) ? player2 : player1;

          let score = miniMax(boardCopy, depth + 1, nextPlayer);
          // console.log(score);
          scores.push({score: score, index: index});
          //console.log(scores);
        }
      });

      if(player === player2){
        let max = maxValue(scores);
        if(depth === 0){

          //console.log(max);
          return max.index;
        }
        else{
          return max.score;
        }
      }
      else{
        let min = minValue(scores);
        if(depth === 0){
          // console.log("min index: " + min.index);
          return min.index;
        }
        else{
          return min.score;
        }
      }
  }


  }








}



function maxValue(arr){

  let maxObj;

  arr.forEach((item, index)=>{
    if(index === 0){
      maxObj = item;
    }
    if(item.score > maxObj.score){
      maxObj = item;
    }
  });

  return maxObj;
}

function minValue(arr){

  let minObj;

  arr.forEach((item, index)=>{
    if(index === 0){
      minObj = item;
    }
    if(item.score < minObj.score){
      minObj = item;
    }
  });

  return minObj;
}

function reset(){

  currentPlayer = "";
  board = ["", "", "", "", "", "", "", "", ""];
  positions.forEach((i)=>{
    $("#" + i).html("");
  });

  $(".chalkBoard").fadeOut(1000, ()=>{
    $(".playerChoice").fadeIn(1000);
  });

  cpuFirst = false;
}
