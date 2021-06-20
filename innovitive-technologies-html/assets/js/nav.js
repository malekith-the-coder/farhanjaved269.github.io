$(document).ready(function () {
    $("#menu-item-143").mouseover(function () {
      $(".menu-company").css("display", "block");
    });
    $("#menu-item-143").mouseout(function () {
      $(".menu-company").css("display", "none");
    });
    $("#menu-item-282").mouseover(function () {
      $(".menu-services").css("display", "block");
    });
    $("#menu-item-282").mouseout(function () {
      $(".menu-services").css("display", "none");
    });
    $("#menu-item-340").mouseover(function () {
      $(".menu-portfolio").css("display", "block");
    });
    $("#menu-item-340").mouseout(function () {
      $(".menu-portfolio").css("display", "none");
    });
  });

  $(window).scroll(function() {    
    var scroll = $(window).scrollTop();    
    if (scroll >= 30) {
        $("nav").addClass("sticked");
    }
    
  });
  $(window).scroll(function() {    
    var scroll = $(window).scrollTop();    
    if (scroll <= 30) {
        $("nav").removeClass("sticked");
    }
  });