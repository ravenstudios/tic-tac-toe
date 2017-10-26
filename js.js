

$(()=>{

  $(".xo").click((e)=>{
    //console.log(e);
    console.log("xo: " + e.target.id+ " click");
    $("#" + e.target.id).html("X");
  });
});
