/* Global Variables */

var menuButton = $(".navigation-menu-btn"),
  navigationContainer = $("#navigation-container"),
  navigationOverlay = $("#navigation-overlay");

/* Dynamically Typing Text */

! function($) {

    "use strict";

  var Typed = function(el, options) {

      // Chosen element to manipulate text.
      this.el = $(el);

      // Options.
      this.options = $.extend({}, $.fn.typed.defaults, options);

      // Attribute to type into.
      this.isInput = this.el.is('input');
      this.attr = this.options.attr;

      // Show cursor.
      this.showCursor = this.isInput ? false : this.options.showCursor;

      // Text content of element.
      this.elContent = this.attr ? this.el.attr(this.attr) : this.el.text()

      // HTML or plain text.
      this.contentType = this.options.contentType;

      // Typing speed.
      this.typeSpeed = this.options.typeSpeed;

      // Add a delay before typing starts.
      this.startDelay = this.options.startDelay;

      // Backspacing speed.
      this.backSpeed = this.options.backSpeed;

      // Amount of time to wait before backspacing.
      this.backDelay = this.options.backDelay;

      // Div containing strings.
      this.stringsElement = this.options.stringsElement;

      // Input strings of text.
      this.strings = this.options.strings;

      // Character number position of current string.
      this.strPos = 0;

      // Current array position.
      this.arrayPos = 0;

      // Number to stop backspacing on.
      // default is 0, can change depending on how many characters
      // you want to remove at the time.
      this.stopNum = 0;

      // Looping logic.
      this.loop = this.options.loop;
      this.loopCount = this.options.loopCount;
      this.curLoop = 0;

      // For stopping.
      this.stop = false;

      // Custom Cursor.
      this.cursorChar = this.options.cursorChar;

      // Shuffle the strings.
      this.shuffle = this.options.shuffle;
      // The order of strings.
      this.sequence = [];

      // All systems go!
      this.build();
  };

  Typed.prototype = {

    constructor: Typed

    ,
    init: function() {
        // Begin the loop with first current string (global self.strings)
        // current string will be passed as an argument each time after this.
        var self = this;
        self.timeout = setTimeout(function() {
            for (var i=0;i<self.strings.length;++i) self.sequence[i]=i;

            // Shuffle the array if true.
            if(self.shuffle) self.sequence = self.shuffleArray(self.sequence);

            // Start typing.
            self.typewrite(self.strings[self.sequence[self.arrayPos]], self.strPos);
        }, self.startDelay);
    }

    ,
    build: function() {
        var self = this;
        // Insert cursor.
        if (this.showCursor === true) {
            this.cursor = $("<span class=\"typed-cursor\">" + this.cursorChar + "</span>");
            this.el.after(this.cursor);
        }
        if (this.stringsElement) {
            self.strings = [];
            this.stringsElement.hide();
            var strings = this.stringsElement.find('p');
            $.each(strings, function(key, value){
                self.strings.push($(value).html());
            });
        }
        this.init();
    }

    // Pass current string state to each function, types 1 character per call.
    ,
    typewrite: function(curString, curStrPos) {
      // Exit when stopped.
      if (this.stop === true) {
          return;
      }

      // Varying values for setTimeout during typing.
      // Can't be global since number changes each time loop is executed.
      var humanize = Math.round(Math.random() * (100 - 30)) + this.typeSpeed;
      var self = this;

      // Contain typing function in a timeout humanize'd delay.
      self.timeout = setTimeout(function() {
          // Check for an escape character before a pause value.
          // Format: \^\d+ .. eg: ^1000 .. should be able to print the ^ too using ^^.
          // Single ^ are removed from string.
          var charPause = 0;
          var substr = curString.substr(curStrPos);
          if (substr.charAt(0) === '^') {
            var skip = 1; // skip atleast 1
            if (/^\^\d+/.test(substr)) {
              substr = /\d+/.exec(substr)[0];
              skip += substr.length;
              charPause = parseInt(substr);
              }

              // Strip out the escape character and pause value so they're not printed.
              curString = curString.substring(0, curStrPos) + curString.substring(curStrPos + skip);
          }

          if (self.contentType === 'html') {
              // Skip over HTML tags while typing.
              var curChar = curString.substr(curStrPos).charAt(0)
              if (curChar === '<' || curChar === '&') {
                  var tag = '';
                  var endTag = '';
                  if (curChar === '<') {
                      endTag = '>'
                  } else {
                      endTag = ';'
                  }
                  while (curString.substr(curStrPos).charAt(0) !== endTag) {
                      tag += curString.substr(curStrPos).charAt(0);
                      curStrPos++;
                  }
                  curStrPos++;
                  tag += endTag;
              }
          }

          // Timeout for any pause after a character.
          self.timeout = setTimeout(function() {
              if (curStrPos === curString.length) {
                  // Fires callback function.
                  self.options.onStringTyped(self.arrayPos);

                  // Is this the final string.
                  if (self.arrayPos === self.strings.length - 1) {
                      // Animation that occurs on the last typed string.
                      self.options.callback();

                      self.curLoop++;

                      // Quit if we won't loop back.
                      if (self.loop === false || self.curLoop === self.loopCount)
                          return;
                  }

                  self.timeout = setTimeout(function() {
                      self.backspace(curString, curStrPos);
                  }, self.backDelay);
              } else {

                  /* Call before functions if applicable. */
                  if (curStrPos === 0)
                      self.options.preStringTyped(self.arrayPos);

                  // Start typing each new char into existing string.
                  // curString: arg, self.el.html: original text inside element.
                  var nextString = curString.substr(0, curStrPos + 1);
                  if (self.attr) {
                      self.el.attr(self.attr, nextString);
                  } else {
                      if (self.isInput) {
                          self.el.val(nextString);
                      } else if (self.contentType === 'html') {
                          self.el.html(nextString);
                      } else {
                          self.el.text(nextString);
                      }
                  }

                  // Qdd characters one by one.
                  curStrPos++;
                  // Loop the function.
                  self.typewrite(curString, curStrPos);
              }
              // End of character pause.
          }, charPause);

          // Humanized value for typing.
      }, humanize);

    }

      ,
      backspace: function(curString, curStrPos) {
          // Exit when stopped.
          if (this.stop === true) {
              return;
          }

          // Varying values for setTimeout during typing.
          // Can't be global since number changes each time loop is executed.
          var humanize = Math.round(Math.random() * (100 - 30)) + this.backSpeed;
          var self = this;

          self.timeout = setTimeout(function() {

              if (self.contentType === 'html') {
                  // Skip over HTML tags while backspacing.
                  if (curString.substr(curStrPos).charAt(0) === '>') {
                      var tag = '';
                      while (curString.substr(curStrPos).charAt(0) !== '<') {
                          tag -= curString.substr(curStrPos).charAt(0);
                          curStrPos--;
                      }
                      curStrPos--;
                      tag += '<';
                  }
              }

              // Replace text with base text + typed characters.
              var nextString = curString.substr(0, curStrPos);
              if (self.attr) {
                  self.el.attr(self.attr, nextString);
              } else {
                  if (self.isInput) {
                      self.el.val(nextString);
                  } else if (self.contentType === 'html') {
                      self.el.html(nextString);
                  } else {
                      self.el.text(nextString);
                  }
              }

              // If the number (id of character in current string) is
              // less than the stop number, keep going.
              if (curStrPos > self.stopNum) {
                  // Subtract characters one by one.
                  curStrPos--;
                  // Loop the function.
                  self.backspace(curString, curStrPos);
              }
              // If the stop number has been reached, increase
              // array position to next string.
              else if (curStrPos <= self.stopNum) {
                  self.arrayPos++;

                  if (self.arrayPos === self.strings.length) {
                      self.arrayPos = 0;

                      // Shuffle sequence again.
                      if(self.shuffle) self.sequence = self.shuffleArray(self.sequence);

                      self.init();
                  } else
                      self.typewrite(self.strings[self.sequence[self.arrayPos]], curStrPos);
              }

              // Humanized value for typing.
          }, humanize);

      }
      /**
       * Shuffles the numbers in the given array.
       * @param {Array} array
       * @returns {Array}
       */
      ,shuffleArray: function(array) {
          var tmp, current, top = array.length;
          if(top) while(--top) {
              current = Math.floor(Math.random() * (top + 1));
              tmp = array[current];
              array[current] = array[top];
              array[top] = tmp;
          }
          return array;
      }

      // Reset and rebuild the element.
      ,
      reset: function() {
          var self = this;
          clearInterval(self.timeout);
          var id = this.el.attr('id');
          this.el.after('<span id="' + id + '"/>')
          this.el.remove();
          if (typeof this.cursor !== 'undefined') {
              this.cursor.remove();
          }
          // Send the callback.
          self.options.resetCallback();
      }

  };

  $.fn.typed = function(option) {
      return this.each(function() {
          var $this = $(this),
              data = $this.data('typed'),
              options = typeof option == 'object' && option;
          if (!data) $this.data('typed', (data = new Typed(this, options)));
          if (typeof option == 'string') data[option]();
      });
  };

  $.fn.typed.defaults = {
      stringsElement: null,
      // Typing speed.
      typeSpeed: 0,
      // Time before typing starts.
      startDelay: 0,
      // Backspacing speed.
      backSpeed: 0,
      // Shuffle the strings.
      shuffle: false,
      // Time before backspacing.
      backDelay: 500,
      // Loop.
      loop: false,
      // False = infinite.
      loopCount: false,
      // Show cursor.
      showCursor: true,
      // Character for cursor.
      cursorChar: "|",
      // Attribute to type (null == text).
      attr: null,
      // Either HTML or text.
      contentType: 'html',
      // Call when done callback function.
      callback: function() {},
      // Starting callback function before each string.
      preStringTyped: function() {},
      // Callback for every typed string.
      onStringTyped: function() {},
      // Callback for reset.
      resetCallback: function() {}
  };

}(window.jQuery);

$("document").ready(function() {
  handleTyping();
});

function handleTyping () {
  $(".element").typed({
    strings: ["Software Developer.", "cat lover.", "Website Designer."],
    typeSpeed: 50,
    starDelay: 200,
    backDelay: 1200,
    loop: true,
    showCursor: true,
    cursorChar: "|"
  });
}

/* Navigation Menu */

function showMenu() {
    navigationOverlay.fadeIn(500);
    navigationContainer.animate({
        left: "0",
        opacity: 1
    }, {
        queue: false,
        duration: 600,
        easing: "easeInOutExpo"
    });
    menuButton.addClass("closed-menu");
    setTimeout(function () {
        $(".navigation-title span").shuffleLetters({});
    }, 300);
}

function hideMenu() {
  navigationContainer.animate({
    left: "-1064px",
    opacity: 0
  }, {
    queue: false,
    duration: 600,
    easing: "easeInOutExpo"
  });
  menuButton.removeClass("closed-menu");
  navigationOverlay.fadeOut(500);
}

menuButton.on("click", function () {
  if (!menuButton.hasClass("closed-menu")) showMenu();
  else hideMenu();
  return false;
});

navigationOverlay.on("click", function () {
  hideMenu();
  return false;
});

var tooltips = document.querySelectorAll('#navigation-overlay .tooltip');
window.onmousemove = function (e) {
  var x = (e.clientX + 20) + 'px',
      y = (e.clientY + 20) + 'px';
  for (var i = 0; i < tooltips.length; i++) {
      tooltips[i].style.top = y;
      tooltips[i].style.left = x;
  }
}

// $(document).ready(function(){
//   $('.slick-slider').slick({
//     dots: true,
//     infinite: true,
//     speed: 600,
//     slidesToShow: 1,
//     centerMode: true,
//     arrows: true,
//     variableWidth: true,
//   });
// });

///

    //   slick  ------------------
    var previousArrow = $(".previous-arrow"),
        nextArrow = $(".next-arrow"),
        carouselContainer = $(".carousel-slider-container"),
        sliderCounter = $(".slider-counter"),
        sliderWrap = $(".slider-wrapper"),
        featuredProjects = $('.slick-slider');

    featuredProjects.slick({
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        dots: true,
        arrows: false,
        slickCurrentSlide: 2,
        centerPadding: "0",
        centerMode: true,
        responsive: [{
                breakpoint: 1224,
                settings: {
                    slidesToShow: 4,
                    centerMode: false,
                }
            },

            {
                breakpoint: 1084,
                settings: {
                    slidesToShow: 2,
                    centerMode: true,
                }
            },

            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    centerMode: true,
                }
            }
        ]

    });

    featuredProjects.on("afterChange", function (event, slick, currentSlide) {
        sliderCounter.text(Number(slick.currentSlide + 1) + ' / ' + slick.slideCount);
    });

    previousArrow.on("click", function () {
        $(this).closest(sliderWrap).find(carouselContainer).slick('slickPrev');
    });
    nextArrow.on("click", function () {
        $(this).closest(sliderWrap).find(carouselContainer).slick('slickNext');
    });
  featuredProjects.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
    var
      direction,
      slideCountZeroBased = slick.slideCount - 1;

    if (nextSlide == currentSlide) {
      direction = "same";

    } else if (Math.abs(nextSlide - currentSlide) == 1) {
      direction = (nextSlide - currentSlide > 0) ? "right" : "left";

    } else {
      direction = (nextSlide - currentSlide > 0) ? "left" : "right";
    }

    // Add a temp CSS class for the slide animation (.slick-current-clone-animate)
    if (direction == 'right') {
      $('.slick-cloned[data-slick-index="' + (nextSlide + slideCountZeroBased + 1) + '"]', featuredProjects).addClass('slick-current-clone-animate');
    }

    if (direction == 'left') {
      $('.slick-cloned[data-slick-index="' + (nextSlide - slideCountZeroBased - 1) + '"]', featuredProjects).addClass('slick-current-clone-animate');
    }
  });

  featuredProjects.on('afterChange', function (event, slick, currentSlide, nextSlide) {
    $('.slick-current-clone-animate', featuredProjects).removeClass('slick-current-clone-animate');
    $('.slick-current-clone-animate', featuredProjects).removeClass('slick-current-clone-animate');
  });

