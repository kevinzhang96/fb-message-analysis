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

  $('#enter-button').click(function(){
    $('#veil').fadeOut(700);
  })
  // $(window).scroll(function(){
  //   if (document.body.scrollTop < 100) {
  //     $("#menu").show({ width:'toggle' }, 500);
  //   }
  //   else { 
  //     $('#menu').hide({ width:'toggle' }, 500); 
  //   }
  // });
});