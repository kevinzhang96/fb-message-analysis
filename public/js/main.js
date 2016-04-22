$(document).ready(function(){
  $(".menu-item").click(function(){
    var name = "#"+ $(this).text();
    console.log(name);
    $('html, body').animate({
        scrollTop: $(name).offset().top
    }, 700);
  });
  $(document).mousemove(function(e) {
    window.x = e.pageX;
    window.y = e.pageY;
});

$(document).mousemove(function(){
if(window.x < 100)
{
  $("#menu").show({width:'toggle'},350);
  console.log('menu');
}
else{ $('#menu').hide({width:'toggle'},350); console.log('do not menu'); }

})

})

