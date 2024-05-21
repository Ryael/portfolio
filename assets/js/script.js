function initPortfolio() {
  //  Clone Hero Dots.
  $.fn.duplicate = function (a, b) {
    var c = [];
    for (var d = 0; d < a; d++) $.merge(c, this.clone(b).get());
    return this.pushStack(c);
  };
  $("<div class='hero-dot'></div>").duplicate(12).appendTo(".hero-dot-container");

  function heroDotAnimation() {
    function a(a) {
      var b = a.length,
        c, d;
      while (b) {
        d = Math.floor(Math.random() * b--);
        c = a[b];
        a[b] = a[d];
        a[d] = c;
      }
      return a;
    }
    var b = $(".hero-dot");
    $(a(b).slice(0, $(".hero-dot-container").data("ran"))).each(function (a) {
      var bc = $(this);
      b.removeClass("dot-visible")
      bc.addClass("dot-visible");

    });
  }
  setInterval(function () {
    heroDotAnimation();
  }, 2000);
}

initPortfolio()
