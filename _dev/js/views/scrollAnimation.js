
import { gsap } from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import Splitting from "splitting"
gsap.registerPlugin(ScrollToPlugin);

window.scrollAnimation = new (function () {
  this.scroller = false;
  this.init = function () {
    gsap.registerPlugin(ScrollTrigger)
    window.globalScroll.smooth.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => {
      window.globalScroll.smooth.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)
  }
  this.initGlobal = function () {
    let mm = gsap.matchMedia();

    let headerAnimation = gsap.timeline()


    headerAnimation.to('header', {
      "--dynamic-color": '#01683A',
      "--dynamic-opacity": 1,
    }, 'animationBg')
    ScrollTrigger.create({
      trigger: '[data-barba-namespace] .container:first-child',
      scrub: true,
      start: 'top top',
      end: "+=75%",
      animation: headerAnimation,


    });




  }


  this.trigger = []
  this.resetTrigger = function () {

    this.trigger.forEach(t => t.kill(true));
    let header = document.querySelector('header');
    document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
    let headerInner = document.querySelector('.main-nav');
    document.documentElement.style.setProperty('--header-nav-height', `${headerInner.offsetHeight}px`);

  }
  this.initView = function () {



    this.resetTrigger();
    let mm = gsap.matchMedia();


    mm.add("(min-width:768px)", () => {

      // HEADER ANIMATION HOME PAGE 


      const targetSplitting = document.querySelectorAll('[data-barba-namespace]:last-child [data-splitting]');

      targetSplitting.forEach((el) => {
        let splittingHead = el.clientHeight;
        document.documentElement.style.setProperty('--splitting-height', `${splittingHead}px`);
        Splitting({ target: $(el).find('h2'), by: 'chars' });
        const splittingText = gsap.timeline({ paused: true })
        splittingText.fromTo(
          $(el).find(".char"), {
          duration: .25,
          stagger: 0.01,
          opacity: 0.06,
          ease: "power2.out"
        }, {
          duration: .25,
          stagger: 0.01,
          opacity: 1,
          ease: "power2.out",
        });
        const scaleText = gsap.timeline({ paused: false });

        scaleText.fromTo($(el).find('h2'), {
          scale: 2.66,
          duration: 1,
          ease: "none",
        }, {
          scale: 1,
          duration: 1,
          ease: "none",
        }, 'scaleDown')
        this.trigger.push(ScrollTrigger.create({
          trigger: $(el).parent(),
          scrub: true,
          pin: el,
          pinSpacing: true,
          animation: scaleText,
          endTrigger: $(el).parent(),
          end: `top+=${window.innerHeight * 1} top`,
          invalidateOnRefresh: true,
          markers: false,
          onEnter: () => {
            splittingText.paused(false);
          },
          snap: false,

        }))


      })
    })

    const homeHighlight = document.querySelectorAll('[data-barba-namespace]:last-child .highlight-item');
    homeHighlight.forEach((el) => {
      const animationJewel = gsap.timeline({ paused: false });

      animationJewel.from($(el).find('.highlight-item__cover img'), {
        yPercent: -100,
        duration: 1,
        ease: 'none',
      }, 'showJewel')

      animationJewel.to($(el).find('.highlight-item__content'), {
        autoAlpha: .3,
        duration: 1,
        ease: 'power1.inOut',
      }, 'showJewel');

      ScrollTrigger.create({
        trigger: el,
        scrub: true,
        pin: true,
        pinSpacing: false, // Evite les décalages
        animation: animationJewel,
        end: "bottom top", // Ajustez le point de fin si nécessaire
      });
    });
    const animationMetamorphosis = gsap.timeline({
      paused: true,
    })
    animationMetamorphosis.fromTo('.before-image', {
      clipPath: 'polygon(0% 0%, 100% 0ù, 100% 100%, 0% 100%)',
      duration: 1,
      ease: 'power1.inOut',

    }, {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
      duration: 1,
      ease: 'power1.inOut',


    }, 'switch')
    animationMetamorphosis.fromTo('.after-image', {
      clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
      duration: 1,
      ease: 'power1.inOut',

    }, {
      clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)',
      duration: 1,
      ease: 'power1.inOut',

    }, 'switch')


    this.trigger.push(ScrollTrigger.create({
      trigger: '.home-metamorphosis__before-after',
      scrub: 1,
      start: "center center",
      endTrigger: '.home-metamorphosis__spacer',
      end: 'center center',
      pin: true,
      pinSpacing: false,
      animation: animationMetamorphosis,

    }))
    const revealNewsletter = gsap.timeline({
      paused: true,
    })
    revealNewsletter.to('.cover-animation-wrapper__inner', {
      yPercent: -100,
      duration: 1,
      ease: 'none',

    }, 'showNewsletter')



    this.trigger.push(ScrollTrigger.create({
      trigger: '.home-newsletter-form',
      scrub: 1,
      start: "center center",
      end: '+=50%',
      pin: true,
      pinSpacing: true,
      animation: revealNewsletter,

    }))




  }
  this.initEnterAnimation = function () {
    let mm = gsap.matchMedia();
    let serviceDetails = gsap.timeline({

    })
    serviceDetails.fromTo('[data-barba-namespace]:last-child .cover-animation', {
      duration: 1.6,
      ease: 'power2.inOut',
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",

    }, {
      duration: 1.6,
      ease: 'power2.inOut',
      clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
    }, 'enterAniamtion')

    mm.add("(min-width:768px)", () => {
      let homeEnter = gsap.timeline({
        onComplete: () => {
          $('.forground').css('z-index', '1');
        }
      })
      homeEnter.fromTo('.swiper-slide:nth-child(1) .forground', {
        duration: 2,
        ease: 'power2.inOut',
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",


      }, {
        duration: 2,
        ease: 'power2.inOut',
        clipPath: "polygon(20% 5%, 80% 5%, 80% 65%, 20% 65%)",
      }, 'enterAniamtion')
      homeEnter.from('.swiper-slide:nth-child(1) .counter', {
        autoAlpha: 0,
        xPercent: 50,
        duration: 2,
        delay: .2,
        ease: 'power2.inOut',


      }, 'enterAniamtion')
    });
    mm.add("(max-width:768px)", () => {
      let homeEnter = gsap.timeline({
        onComplete: () => {
          $('.forground').css('z-index', '1');
        }
      })
      homeEnter.fromTo('.swiper-slide:nth-child(1) .forground', {
        duration: 2,
        ease: 'power2.inOut',
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",


      }, {
        duration: 2,
        ease: 'power2.inOut',
        clipPath: "polygon(30% 15%, 70% 15%, 70% 55%, 30% 55%)",
      }, 'enterAniamtion')
      homeEnter.from('.swiper-slide:nth-child(1) .counter', {
        autoAlpha: 0,
        xPercent: 50,
        duration: 2,
        delay: .3,
        ease: 'power2.inOut',


      }, 'enterAniamtion')


    });

    let footerAnimation = gsap.timeline({
      paused: true,
    })
    footerAnimation.to('.animated-logo', {
      yPercent: 100,
      ease: 'none'

    }, 'animationBg')
    this.trigger.push(ScrollTrigger.create({
      trigger: '.footer-navigation',
      scrub: true,
      start: 'top bottom',
      endTrigger: 'footer',
      end: 'bottom bottom',
      animation: footerAnimation,
    }));



  }


  this.lazyload = function () {
    gsap.utils.toArray("[data-barba-namespace]:last-of-type .container").forEach((section, i) => {
      ScrollTrigger.create({
        trigger: section,
        start: "-50% bottom",
        once: true,
        onEnter: () => {
          window.imageLoader.lazy(section);
        },
        onEnterBack: () => {
          window.imageLoader.lazy(section);
        }
      });
    });
  }
  this.update = function () {
    console.log('Test');
    ScrollTrigger.refresh()
  }
});
