import { gsap } from 'gsap';

window.menuNav = new (function () {
    this.init = function () {
        $('.footer-nav h3').on('click', function (e) {
            $(this).toggleClass('hide');
            $(this).next().toggleClass('hide');
        })
        $('[data-open-popup]').on('click', function (e) {
            $('[data-open-popup]').toggleClass('active');
            $("body").toggleClass('open-popup');
            $('.popup-creation').toggleClass('active');
        })
        $('.popup-creation').on('click', () => { $('[data-open-popup]').trigger('click'); })





        $('body').on('change', '.language-switcher select', function (e) {
            console.log($(this).val());
            e.preventDefault()
            e.stopPropagation()
            window.barba.instance.force($(this).val());
        })

        $('.btn-menu').on('click', function (e) {

            e.preventDefault();
            if ($(this).hasClass('open')) {
                window.menuNav.hide();

            } else {
                window.menuNav.show();
                $(".main-header").addClass('open');

                $("body").addClass('open-menu');


            }
        })
        $('header nav').find('a.current').on('click', function () {
            $('.btn-menu').trigger('click');
        })

    }
    this.menuResizeHandler = function () {
        console.log('ici');
        $('.main-header .btn-menu').removeClass('open')
        $("body").removeClass('open-menu');

        gsap.set($('.main-nav-center'), { clearProps: "all" });
        gsap.set($('.menu-item a'), { clearProps: "all" });

        //this.hide();


    }
    this.timeline = gsap.timeline({ paused: true });

    this.timeline.to('.main-nav__center', {
        autoAlpha: 1,
        duration: .3,
        ease: 'power1.inOut'
    }, 'toggleMenu')





    this.show = function () {
        this.timeline.paused(false)
        this.timeline.reversed(false)
        $('.main-header .btn-menu').addClass('open')


    }
    this.hide = function () {


        return new Promise((resolve) => {
            if ($('.main-header .btn-menu').hasClass('open') != true) {
                resolve(true);
                return;
            }
            else {
                this.timeline.paused(false)
                this.timeline.reversed(true)
                this.timeline.eventCallback('onReverseComplete', () => {
                    resolve()
                })
                $('.main-header,.btn-menu').removeClass('open')
                $("body").removeClass('open-menu');




            }




        });





    }
    this.end = function () {
        this.timeline.seek(1)
        this.timeline.paused(true)
        $(".main-header").addClass('open');
        $("body").addClass('open-menu');

        $(".btn-menu").addClass('open');
    }
    this.reset = function () {



        $('.main-header,.btn-menu').removeClass('open')
        $("body").removeClass('open-menu');

        gsap.set('.nav-wrapper', { backgroundColor: 'rgba(0,0,0,0)' })
        gsap.to('.nav-footer', { autoAlpha: 0, })
        gsap.set('header .menu-item a,header .social-list a .wrapper', { yPercent: 110 });
        gsap.set('.main-nav-wrapper', { xPercent: -100 })

    }
    this.updateCurrentLink = function () {

        $('header nav a').removeClass('current');
        $('header nav a').removeClass('current');
        $('header nav a').each(function (index) {
            let elHref = $(this).prop("href")

            if (elHref == document.location.href) {
                $(this).addClass('current');
            }

        })
    }
    this.initView = function () {

    }

})
