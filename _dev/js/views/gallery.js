import SwiperItem from '@js/views/swiperComponent';

window.gallery = new (function () {
    this.init = function () {

        const slideShowGallery = new SwiperItem(document.querySelector('[data-barba-namespace]:last-child .square-gallery'), {
            slidesPerView: "auto",
            loop: true,
            speed: 15000,
            slideToClickedSlide: true,
            autoplay: {
                delay: 0,
                disableOnInteraction: true
            },
            freeMode: {
                enabled: true,
                momentum: true,
                sticky: true,
            },



        })
        slideShowGallery.on('touchMove', () => {
            slideShowGallery.swiper.wrapperEl.classList.add('easing')
            slideShowGallery.swiper.params.speed = 400;
        })
        slideShowGallery.on('click', () => {
            slideShowGallery.swiper.wrapperEl.classList.add('easing')
            slideShowGallery.swiper.params.speed = 400;
        })
    }
})


