import {gsap} from 'gsap';
import imageReplace from "@js/_barba/views/imageReplace";
export default class ImageLoader {
    constructor(){

    }

    load(html, callback){
        let $images = $(html).find('img:not([data-lazy])');
        let counter = $images.length;

        if(counter == 0)
        {
            callback();
        }
        else
        {
            let loaded = 0;
            $images.each(function (index) {
                let src = ("currentSrc" in this) ? this.currentSrc : this.src;

                let $img = $('<img />');

                let onComplete = function(){
                    loaded++;
                    if(loaded >= counter)
                    {
                        callback();
                    }
                };

                $img.attr('src', src).on('load', onComplete).on('error', onComplete);
            });
        }
    }

    lazy(el){
        return new Promise(function(resolve){
            $(el).find('[data-lazy-src]:not(.loaded)').each(function(){
                let $this = $(this);
                
                if($this.parent('video').length > 0)
                {
                    $this.attr('src', $this.data('lazy-src')).addClass('loaded');
                    $this.parent('video')[0].load();
                    
                    $this.parent('video')[0].addEventListener('canplay', () => {
                          $this.parents().find('[data-lazy-placeholder]').addClass('loaded')
                          $this.parent('video').addClass('loaded')
                          window.appEvent.trigger('resize');

                    }, false);

                }else{
                    gsap.set($this,{opacity: 0})
                    if ($this.parent('.js-replace-image').length){
                        gsap.set($this.parent('.js-replace-image'),{opacity: 0})
                    }
                    if ($this.attr('loading') == 'lazy'){
                        $this.attr('loading',"eager")
                    }
                    $this.attr('src', $this.data('lazy-src')).addClass('loaded');
                    $this[0].onload = function () {
                        console.log($(this).attr('src') + ' loaded');
                        gsap.to($this,.3,{
                            opacity: 1,
                            onComplete: function(){

                            }
                        })
                        if ($this.parent('.js-replace-image').length){
                            imageReplace($this.parent('.js-replace-image').parent());
                            gsap.to($this.parent('.js-replace-image'),.3,{
                                opacity: 1,
                                onComplete:function(){

                                }
                            })
                        }

                        resolve(true);
                    };

                }

            })

        })


    }
}
