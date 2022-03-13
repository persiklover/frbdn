
;$(function() {

  function scrollTo(selector, cb) {
    $("html").animate({
      scrollTop: $(selector).offset().top + 5 + "px"
    }, 500, cb);
  }

  $('a[href^="#"]').click(function (e) {
    e.preventDefault();
    scrollTo( $(this).attr('href') );
  });

  // Modal

  const $modal = $(".modal");
  const openModal = () => {
    $modal.addClass("visible");
    $(document.body).addClass("scroll-disabled");
  };

  const closeModal = () => {
    $modal.removeClass("visible");
    $(document.body).removeClass("scroll-disabled");
  };

  $(".js-close-modal").click(closeModal);

  // Parallax

  const $parallaxElements = $(".js-parallax");
  $(document).on("scroll", function(e) {
    let scrollTop = $(document).scrollTop();
    if (innerWidth <= 768) {
      scrollTop = 0;
    }

    $parallaxElements.each((index, item) => {
      const multiplier = +$(item).attr("data-m") || 2;
      $(item).css("transform", `translateY(${scrollTop / multiplier}px)`);
    })
  });

  // Слайдер

  const $portfolioSlider = $(".portfolio-slider");
  const $portfolioFilters = $(".portfolio-filters");
  const $portfolioControls = $(".portfolio-controls");
  const $portfolioControlsCurrent = $(".portfolio-controls__current");
  const $portfolioControlsTotal = $(".portfolio-controls__total");

  const onPortfolioSliderUpdate = event => {
      var items     = event.item.count;     // Number of items
      var item      = event.item.index;     // Position of the current item
      item = item - Math.round(items / 2) + 1;
      if (item == 0) {
        item = items;
      }

      $portfolioControlsCurrent.text(item);
      $portfolioControlsTotal.text(items);
  };

  $portfolioSlider
    .addClass("owl-carousel")
    .owlCarousel({
      loop:   true,
      dots:   false,
      items:  1,
      margin: 2,
      autoHeight: true,
      mouseDrag: false,
      touchDrag: false,
      onInitialized: onPortfolioSliderUpdate,
      responsive: {
        0: {
          mouseDrag: true,
          touchDrag: true,
        },
        768: {
          mouseDrag: false,
          touchDrag: false,
        }
      }
    })
    .on('changed.owl.carousel', onPortfolioSliderUpdate);
  
  $portfolioControls.find("button").click(function(e) {
    const prev = $(this).hasClass("prev");
    if (prev) {
      $portfolioSlider.trigger("prev.owl.carousel");
    }
    else {
      $portfolioSlider.trigger("next.owl.carousel");
    }
  });

  $portfolioFilters.find("button").click(function(e) {
    const $self = $(this);
    const selfContent = $self.html();
    const category = $self.attr("data-category");
    
    $self.parents("li")
      .attr("hidden", "")
      .siblings()
        .removeAttr("hidden");
    const $filtersHeading = $portfolioFilters.find("b");
    $filtersHeading.html( selfContent );
    $portfolioFilters.attr("data-category", category);

    $portfolioSlider.owlcarousel2_filter( `[data-category*="${category}"]` );
    $portfolioSlider.find(".owl-stage-outer").css("height", "initial");
  });

  // Сотрудничество

  const $cooperation = $(".cooperation");
  $cooperation.addClass("js-enabled");
  $cooperation.find(".cooperation-content").removeClass("expanded");

  $(".js-expand-cooperation").click(function(e) {
    const $button = $(this);
    const pressed = $button.attr("aria-pressed") == "true";
    $button.attr("aria-pressed", !pressed);
    $button.find("span").text(pressed ? "Развернуть" : "Свернуть");
    $button.toggleClass("expanded");
    $button.parents(".cooperation").find(".cooperation-content").toggleClass("expanded");
  });

  // Form

  const $form = $(".form");
  const $formCarousel = $form.find("ul");
  $form.addClass("js-enabled");

  $(".js-form-next").click(function(e) {
    e.preventDefault();
    $formCarousel.trigger("next.owl.carousel");
  });

  $form.submit(function(e) {
    e.preventDefault();

    let valid = true;

    const showError = (htmlElement, error) => {

      valid = false;

      $(htmlElement).parents("label")
        .addClass("invalid")
        .attr("data-error", error);
    };
      
    const removeError = htmlElement => {
      $(htmlElement).parents("label")
        .removeClass("invalid")
        .attr("data-error", "");
    };

    const $tel = $form.find(`input[name="tel"]`);
    const telValue = $tel.val().trim();
    const telRegExp = /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/;
    if (telValue == "") {
      showError($tel, "Пожалуйста, заполните это поле");
    }
    else if (!telRegExp.test(telValue)) {
      showError($tel, "Неверный формат телефона");
    }
    else {
      removeError($tel);
    }
    
    const $email = $form.find(`input[name="email"]`);
    const emailValue = $email.val().trim();

    const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (emailValue == "") {
      showError($email, "Пожалуйста, заполните это поле");
    }
    else if (!emailRegExp.test(String(emailValue).toLowerCase())) {
      showError($email, "Неверный формат email!");
    }
    else {
      removeError($email);
    }

    const $name = $form.find(`input[name="name"]`);
    const nameValue = $name.val().trim();
    if (nameValue == "") {
      showError($name, "Пожалуйста, заполните это поле");
    }
    else {
      removeError($name);
    }

    if (valid) {
      const propsArr = 
        decodeURIComponent($form.serialize())
          .split("&")
          .map(pair => {
            pair = pair.split("=");
            return {
              key: pair[0],
              val: pair[1]
            }
          });
      
      const data = {};
      for (let token of propsArr) {
        if (data[token.key] != null) {

          if ( Object.prototype.toString.call(data[token.key]).toLowerCase().slice(8, -1) == "array" ) {
            data[token.key].push(token.val);
          }
          else {
            data[token.key] = [ data[token.key], token.val ];
          }
          
        }
        else {
          let val = token.val;
          if (token.key == "budget") {
            val = "₽" + val;
          }
          data[token.key] = val;
        }
      }

      if (true) {
        $.ajax({
          type: "GET",
          url: "google-sheets.php",
          data,
          success: function(msg) {
            // TODO:
          },
          error: function(err) {
            console.error(err);
          }
        });
  
        $.ajax({
          type: "GET",
          url: "mail.php",
          data,
          success: function(msg) {
            // TODO:
          },
          error: function(err) {
            console.error(err);
          }
        });

        openModal();

      }

    }
    else {

      if (innerWidth <= 768) {
        $formCarousel.trigger('to.owl.carousel', [1, 500, true]);
      }

    }

  });

  const onResize = e => {
    if (innerWidth <= 768) {
      $formCarousel
        .addClass("owl-carousel")
        .owlCarousel({
          loop:   false,
          dots:   false,
          items:  1,
          margin: 2,
          autoHeight: true,
          mouseDrag: false,
          touchDrag: false,
        });
    }
    else {
      $formCarousel.trigger('destroy.owl.carousel');
    }
  };

  onResize();
  window.addEventListener("resize", onResize);

});
