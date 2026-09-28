export default function imageReplace($container){
    let timeout = false;
    $container = $container || $('body');
    $container.find('.js-replace-image:not(.jsImageReplaced)').each(function(index){
        let image = $(this).find('img')[0];
        if (image != undefined){
            let $this = $(this);
            let src = "currentSrc" in image ? image.currentSrc : image.src;
            if(src == undefined || src == '' || src == null)
            {
                if(timeout) window.clearTimeout(timeout);
                timeout = window.setTimeout(function () {
                    imageReplace($('[data-barba="container"]:last-of-type'));
                }, 100);
            }
            else
            {
                
                $this.css('background-image', 'url(' + src + ')');
                $this.addClass('jsImageReplaced');
            }
        }
    });
}
