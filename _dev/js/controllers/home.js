import SwiperItem from '@js/views/swiperComponent';

window.home = new (function () {
  this.index = function () {
    const slideshowTestimonials = new SwiperItem('[data-barba-namespace]:last-child .home-testimonials .swiper-container', {
      slidesPerView: 'auto',
      speed: 400,
      navigation: {
        nextEl: "[data-barba-namespace]:last-child .home-testimonials .btn-swiper--next",
        prevEl: "[data-barba-namespace]:last-child .home-testimonials .btn-swiper--prev",
      },

    })


  }

});


