import { gsap } from 'gsap';

export default function landingLoader(timing) {
  let target = $('*[data-barba-introductionscreen]');

  if (target) {
    //gsap.set(target, {autoAlpha: 1});

  }
  this.init = function () {



    if (target) {
      let fade = gsap.timeline({
        onStart: () => {
          window.scrollAnimation.update()
        },
        onComplete: () => {
          $(target).remove();
          $('body').addClass('loaded')
        },
        onUpdate: function () {
          //borderTimeline.progress(this.progress())
        },
        //repeat: -1,
      });


      fade.to('#introduction-screen', {
        autoAlpha: 0,
        duration: .8,
        ease: "power2.inOut",
        onStart: () => {
          appEvent.trigger('app:threejsAnimation:start');


        }
      }, 'hideLoader')







    }
    else {
      return false;
    }
  }


}
