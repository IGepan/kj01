$(function(){
  $(".cnt_item").each(function(i){
    $(this).hover(function(){
      $(".cnt_item").removeClass("active");
      $(this).addClass("active");
    })
  })
});