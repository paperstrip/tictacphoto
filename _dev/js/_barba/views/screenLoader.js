import { gsap } from 'gsap';
export default function screenLoader(timingIn, timingOut) {
  gsap.set($('*[data-barba-loadingscreen]'), { autoAlpha: 0 });
  this.show = function () {
    return new Promise(function (resolve) {
      let tl = gsap.timeline({
        repeat: 0,
        paused: true,
        onComplete: function () {
          resolve(true)


        }
      });
      $('*[data-barba-loadingscreen]').addClass('active')
      tl.fromTo('*[data-barba-loadingscreen]',
        {
          autoAlpha: 0,

          duration: timingIn,
          ease: "power2.in",

        },
        {
          autoAlpha: 1,

          duration: timingIn,
          ease: "power2.in",

        });


      tl.play();
    }, 'hide');
  }
  this.hide = function () {
    return new Promise(function (resolve) {

      let tl = gsap.timeline({
        repeat: 0,
        paused: true,
        onStart: function () {
          appEvent.trigger('app:threejsAnimation:start');



        },
        onComplete: function () {
          resolve(true);



          $('*[data-barba-loadingscreen]').removeClass('active')
        }
      });
      tl.fromTo('*[data-barba-loadingscreen]',
        {
          autoAlpha: 1,

          duration: timingOut,
          ease: "power2.in",

        },
        {
          autoAlpha: 0,

          duration: timingOut,
          ease: "power2.in",

        });
      tl.play();
      appEvent.trigger('app:threejsAnimation:start');
      return;




    }, 'show');

  }
}
