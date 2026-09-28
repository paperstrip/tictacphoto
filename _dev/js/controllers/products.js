
import SwiperItem from '@js/views/swiperComponent';
import '@js/views/filters';
window.products = new (function () {
    this.index = function () {
        const slideShowGallery = new SwiperItem('[data-barba-namespace]:last-child .product-hightlight .swiper-container', {
            slidesPerView: "auto",
            loop: true,
            speed: 600,
            slideToClickedSlide: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: true
            },
            pagination: {
                el: '[data-barba-namespace]:last-child .product-hightlight .swiper-container .swiper-pagination',
                type: 'bullets',
            },
            navigation: {
                nextEl: '[data-barba-namespace]:last-child .product-hightlight .swiper-container .swiper-btn--next',
                prevEl: '[data-barba-namespace]:last-child .product-hightlight .swiper-container .swiper-btn--prev',
            },



        })
        window.filters.ajax()
        appEvent.listen('app:ajaxInjected', () => {
            //window.products.initAccordion();
            window.globalScroll.scrollTo($('[data-ajax-content]').get(0),0.3,-$(header).outerHeight())
        })
        
        window.products.initAccordion();
        $('[data-barba-namespace]').find('[data-toggle-filters]').on('click',function(){
            $(this).toggleClass('open');
            $('[data-barba-namespace]:last-child').find('[data-ajax-filter] .field-group-mobile').slideToggle()
        })

    }

    this.details = function () {
        const thumbs = new SwiperItem($("[data-barba-namespace='productsDetails']:last-child").last().find(".product-intro__left .slideshow-thumb")[0], {
            loop: false,
            spaceBetween: 10,
            slidesPerView: 4,
            freeMode: true,
            watchSlidesProgress: true,
          });
          console.log('condition', thumbs.swiper[thumbs.swiper.length - 1])
          const swiperMain = new SwiperItem($("[data-barba-namespace='productsDetails']:last-child").last().find(".product-intro__left .slideshow-full")[0], {
            loop: false,
            spaceBetween: 10,
            adaptiveHeight: true,
          
            thumbs: {
              swiper:  thumbs.swiper[thumbs.swiper.length - 1] != undefined ?  thumbs.swiper[thumbs.swiper.length - 1] : thumbs.swiper,
            },
          });
          $("[data-barba-namespace]:last-child").find('[data-tab]').on('click', function () {
            var $tabs = $("[data-barba-namespace]:last-child").find('[data-tab]');
            var $panels = $("[data-barba-namespace]:last-child").find('[data-panel]');
            var targetPanel = $("[data-barba-namespace]:last-child").find('[data-panel=' + $(this).attr('data-tab') + ']');
        
            // Retirer la classe active des autres onglets
            $tabs.removeClass('active');
            $(this).addClass('active');
        
            // Si le panneau cliqué est déjà ouvert, ne rien faire
            if (targetPanel.is(':visible')) {
                return;
            }
        
            // Fermer tous les panneaux d'abord, puis ouvrir le panneau cible une fois les autres fermés
            $panels.stop().slideUp(function () {
                // Vérifier si tous les autres panneaux sont bien fermés avant d'ouvrir le nouveau
                if ($panels.filter(':visible').length === 0) {
                    targetPanel.stop().slideDown();
                }
            });
        });
          $("[data-barba-namespace]:last-child").find('[data-tab]').eq(0).addClass('active')
          $("[data-barba-namespace]:last-child").find('[data-panel]').eq(0).show()
    }
    this.initAccordion = function () {
        let $button = $('[data-barba-namespace]:last-child').find('.filter-accordion');

        $button.on('click', function () {
            $(this).toggleClass('open')
            $(this).next('fieldset').slideToggle()
        })

    }
    

});



