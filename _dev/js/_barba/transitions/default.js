import { gsap } from 'gsap';

import screenLoader from '@js/_barba/views/screenLoader';
window.loadingScreen = new screenLoader (.25,.25);


window.barbaDefaultTransition = {
  name: 'loadingScreen',
  sync: false,
  before: function(data) {
    var  done = this.async();
    window.menuNav.hide().then(function(res){

      window.loadingScreen.show().then(function(res){
        done();
         window.appEvent.trigger('app:barba:beforeDone');
         window.appEvent.trigger('app:barba:beforeEnter');
  
  
      });
    });
   
  },
  beforeLeave: function(data){
    //var  done = this.async();
   
  },
  afterLeave: function(data){
  },
  beforeEnter: function(data) {
    var  done = this.async();
    window.imageLoader.load(data.next.container, function(){
      done();
    });
  },
  enter: function(data){
    appEvent.trigger('app:launcEnterAnimation');

    gsap.set(data.next.container, {autoAlpha: 1});
     window.appEvent.trigger('app:transition:isEnter');
     window.appEvent.trigger('app:transition:after');

    

  },
  after: function(data){
    var  done = this.async();
     window.appEvent.trigger('app:transition:after');
    window.loadingScreen.hide().then(function(){
      done()
    });

  }

};
