$(document).ready(function(){

$(".menu-item").click(function(){
  var name = "#"+ $(this).text();
  console.log(name);
  $('html, body').animate({
      scrollTop: $(name).offset().top
  }, 700);
});

})