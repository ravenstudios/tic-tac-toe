
let player1Turn;
let player2Turn;
let player1;
let player2;
let currentPlayer = "X";
let positions = ["xo0", "xo1", "xo2", "xo3", "xo4", "xo5", "xo6", "xo7", "xo8"];
let board = ["", "", "", "", "", "", "", "", ""];
let singlePlayer; //boolean
let canPlay = false;
let fadeTimer = 1;
let cpuFirst = false;
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

  $("#2Player").click(()=>{
    cpuTurn();
  });

  $("#reset").click(()=>{
    reset();
    $(".chalkBoard").fadeIn(fadeTimer);
  });

  $("#onePlayer").click(()=>{

    singlePlayer = true;
    $(".playerChoice").fadeOut(fadeTimer, ()=>{
      $(".xoSelect").fadeIn(fadeTimer);
    });

  });

  $("#twoPlayer").click(()=>{
    singlePlayer = false;
    $(".playerChoice").fadeOut(fadeTimer, ()=>{
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

          if(checkBoard(currentPlayer)){
            canPlay = false;
            message("\"" + currentPlayer + "\" WINS!!!", ()=>{

              reset();
            });
            return;
          }
          if(checkDraw()){
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

        if(checkBoard(currentPlayer)){
          canPlay = false;
          message("\"" + currentPlayer + "\" WINS!!!", ()=>{
            reset();
          });
        }
        if(checkDraw()){
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

function checkBoard(player){

  let win = false;
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

function checkDraw(){
  // if(board.indexOf("") === -1){
  //   return true;
  // }
  return board.indexOf("") === -1
}

function cpuTurn(){
  canPlay = false;
  currentPlayer = player2;
  let arr = [];
  let rand = Math.floor(Math.random() * (2000 - 1000)) + 1000;//sets random time for the cpu to play giving it a feel of human
  setTimeout(()=>{

    board.forEach((i, index)=>{//makes an arry of peices to choose from
      if(i === ""){
        arr.push(index);
      }
    });

    rand = Math.floor(Math.random() * arr.length);//picks a random spot

    board[arr[rand]] = player2//places on board
    $("#" + positions[arr[rand]]).html(player2);//displays choice

    if(checkBoard(currentPlayer)){
      canPlay = false;
      message("\"" + currentPlayer + "\" WINS!!!", ()=>{
        reset();
      });
    }
    if(checkDraw()){
      canPlay = false;
      message("__DrAw__", ()=>{
        reset();
      });
    }

    else{
      currentPlayer = player1;
      canPlay = true;
    }

  }, rand);



}







function cpuLogic(){

  if(cpuFirst){//if cpu goes first pick middle
    board[4] = player2//places on board
    $("#ox4".html(player2));
  }

  //make array of all aviable spots


  //loop through those spots and see if any will win game

  //loop throug again and see if spot will stop a win

  //if none of the above the pick a corner

  //else random

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
