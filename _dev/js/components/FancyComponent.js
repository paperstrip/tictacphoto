
import fancybox from '@fancyapps/fancybox';
export default class FancyComponent {
    constructor(target = '[data-fancybox]',options = {}) {
        // default callback
        this.defaultCallback = false;

        // default fancybox options
        this.options = {
            opts : {
                afterShow : (instance) => {
                    if(this.defaultCallback) {
                        this.defaultCallback(instance);
                        this.defaultCallback = false;
                    }
                }
            }
        };
        this.options = Object.assign(this.options, options);

        // init global
        this.initGlobal();

        // init view
        this.initView();

        // init [data-fancybox]
        this.init(target, this.options);
    }

    initGlobal() {
        // check onload
        let onload = $('body').data('fancy-onload');
        if(onload != null && onload != '')
        {
            console.log('onload', onload, onload.indexOf('--onscroll'));
            // check if it's scroll
            if(onload.indexOf('--onscroll') != -1)
            {
                onload = onload.replace('--onscroll', '');
                $('body').data('fancy-onload', onload);
                // it's scroll
                window.appEvent.listen('app:scroll', this.appScrollHandler);
            }
            else
            {
                // display directly
                this.open(onload);
            }
        }

        // data-fancy-close
        $('body').on('click', '[data-fancy-close]:not([data-fancy-open],[data-fancy-ajax],[data-fancy-html])', (e) => {
            console.log('datafancyclose');
            let all = $(e.currentTarget).data('fancy-close') == 'all';
            this.close(all);
        });

        // data-fancy-open
        $('body').on('click', '[data-fancy-open]', (e) => {
            e.preventDefault();
            let contentId = $(e.currentTarget).data('fancy-open');

            this.open(contentId);
        });

        // data-fancy-ajax
        $('body').on('click', '[data-fancy-ajax]', (e) => {
            e.preventDefault();
            e.stopPropagation();

            let command = $(e.currentTarget).data('fancy-ajax');

            if (typeof $(e.currentTarget).data('fancy-close') !== 'undefined') {
                this.close($(e.currentTarget).data('fancy-close'));
            }

            this.open($(e.currentTarget).attr('href'), 'ajax');
        });
    }

    initView() {
        // data-fancy-click
        $('section:last-child [data-fancy-click]').on('click', (e) => {
            e.preventDefault();
            let contentId = $(e.currentTarget).data('fancy-click');

            this.open(contentId);
        });
    }

    appScrollHandler(e, offset, limit) {
        if(offset >= $(window).height() * 1.5)
        {
            if("fancy" in window)
            {
                window.fancy.open($('body').data('fancy-onload'));
                // supprimer manuellement l'ecouteur
                $(document).off('app:scroll', window.fancy.appScrollHandler);
            }
        }
    }

    setOptions(options) {
        this.opts = Object.assign(this.opts, options);
    }

    init(target, options = {}) {
        // merge with default options
        options = Object.assign(this.options, options);
        $(target).fancybox(options);
        return this;
    }

    click(target, src, callback = false) {
        $(target).on('click',(e) => {
            e.preventDefault();
            e.stopPropagation();

            this.open(src, false, callback);
        });
    }

    live(target, src, callback = false) {
        $('body').on('click',target,(e) => {
            e.preventDefault();
            e.stopPropagation();

            this.open(src, false, callback);
        });
    }

    open(src, type = false, callback = false) {
        this.defaultCallback = callback;

        // type
        type = type || 'inline';

        // check data-fancy-content
        if($('[data-fancy-content="'+src+'"]').length > 0)
        {
            src = '[data-fancy-content="'+src+'"]';
        }

        let options = Object.assign(this.options, {
            src  : src,
            type : type
        });


        $.fancybox.open(options);
    }

    html(src, callback = false) {
        $.fancybox.open(src, 'html', callback);
    }

    close(all = false) {
        $.fancybox.close(all);
    }
}
