import fancybox from '@fancyapps/fancybox';
import "@fancyapps/fancybox/dist/jquery.fancybox.css";
import SwiperItem from '@js/views/swiperComponent';

window.premium = new (function () {
    this.index = function () {
        const slideshowTestimonials = new SwiperItem('[data-barba-namespace]:last-child .premium-testimonials .swiper-container', {
            slidesPerView: 'auto',
            speed: 400,
            navigation: {
                nextEl: "[data-barba-namespace]:last-child .premium-testimonials .btn-swiper--next",
                prevEl: "[data-barba-namespace]:last-child .premium-testimonials .btn-swiper--prev",
            },

        })
        $('[data-barba-namespace]:last-child .accordion__button').click(function () {
            // Fermer tous les autres contenus ouverts
            $('[data-barba-namespace]:last-child .accordion__content').slideUp(300);

            // Vérifier si le contenu lié au bouton cliqué est déjà ouvert
            if ($(this).next('.accordion__content').is(':visible')) {
                // Si c'est déjà ouvert, on le ferme
                $(this).next('.accordion__content').slideUp(300);
                $(this).parent().removeClass('active');
            } else {
                // Sinon, on l'ouvre
                $(this).next('.accordion__content').slideDown(300);
                $(this).parent().addClass('active');

            }
        });

    }

});






