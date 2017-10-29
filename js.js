

let player1;
let player2;
let currentPlayer;
let positions = ["xo0", "xo1", "xo2", "xo3", "xo4", "xo5", "xo6", "xo7", "xo8"];
let board = ["", "", "", "", "", "", "", "", ""];
let singlePlayer; //boolean
let canPlay = false;
let fadeTimer = 1000;
let difficulty;//affects minimax depth 3-easy 9-med/hard 10-impossible

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

$(()=>{

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
    if(inBoard.indexOf("") !== -1){//game still going
      let boardCopy = inBoard.slice();//make a copy of the passed in array
      let scores = [];

      boardCopy.forEach((item, index)=>{//loop through all empty spots

        if(item === ""){//if spot is available

          boardCopy[index] = player;//set token in copied array
          let score = miniMax(boardCopy, depth + 1, (player === player1) ? player2 : player1);//call minimax again with new array and flipped player

          scores.push({score: score, index: index});

        }
      });

      if(player === player2){//checks max
        let max = maxValue(scores);
        if(depth === 0){//if at terminal node return the index else return the score
          return max.index;
        }
        else{
          return max.score;
        }
      }
      else{//checks min
        let min = minValue(scores);
        if(depth === 0){//if at terminal node return the index else return the score
          return min.index;
        }
        else{
          return min.score;
        }
      }
    }


    else if (checkBoard(player2, inBoard)) {//check if payer 2 wins

      return 10;
    }

    else if (checkBoard(player1, inBoard)) {//check if player 1 wins

      return -10;
    }


    else if (checkDraw(inBoard)) {//checks for draw
      // console.log("draw");
      return 0;
    }
  }

}



function maxValue(arr){//finds the higest value in array

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

function minValue(arr){//finds the lowest value in arrray

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


}
