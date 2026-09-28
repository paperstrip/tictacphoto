import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollToPlugin);

export default class ScrollComponent {
    constructor(options = {}) {
        // options
        this.opts = {
            target: '',
            duration: 400,
            smooth: false,
            offset: false
        };
        this.opts = Object.assign(this.opts, options);

        this.y = 0;
        this.limit = 0;
        this.scroll = this.opts.target ? document.querySelectorAll(this.opts.target)[0] : document;

        // smoothScroll
        this.smoothScroll = false;

        // init
    }
    

    _touchDetector() {
        return new Promise((resolve, reject) => {
            const smoothScroll = new Lenis({
                syncTouch: false,
                virtualScroll: false,
            })
            this.smooth = smoothScroll
            //get scroll value
            this.smooth.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
                this.y = scroll
                this.limit = limit
                window.appEvent.trigger('app:scroll', [this.y, this.limit]);

            })


            this._scrollEvent();
            resolve(true)


        })


    }

    _clickEvents() {
        $('body').on('click', '[data-scrollto]', (e) => {
            e.preventDefault();
            e.stopPropagation();
            let $target = $(e.currentTarget);
            let data = $target.data('scrollto');

            if (data === '') {
                data = $target.attr('href');
            }
            console.log('DATA', data)
            this.smooth.scrollTo(document.querySelector(data),{ offset: -75, duration: 1 });
            //this.scrollTo(data);
        })
    }

    _scrollEvent() {
        this.scroll.addEventListener("scroll", (event) => {
            this.y = this.scroll.scrollTop;
            this.limit = this.scroll.scrollHeight - window.innerHeight;
            window.appEvent.trigger('app:scroll', [this.y, this.limit]);
        })
    }

    _scrollToPosition(pos, time) {
        console.log('_scrollToPosition', pos, time);

        if (this.opts.smooth) {
            if (time === 0) {

                this.smooth.scrollTo(pos, { offset: 0, immediate: true })

            } else {
                this.smooth.scrollTo(pos, { offset: this.opts.offset, duration: time })

            }
        }
        else {
            if (time == 0) {
                gsap.set(this.scroll, {
                    scrollTo: pos
                });
            }
            else {
                gsap.to(this.scroll, {
                    duration: time / 1000,
                    ease: "power3.out",
                    scrollTo: pos
                });
            }
        }
    }

    scrollTo(target, time = false, offset = false) {
        // check duration
        if (time === false) time = this.opts.duration;

        // check target
        if (typeof target === 'string') {
            target = $(target).offset().top + $(this.scroll).scrollTop();
        }
        if (typeof target === 'object') {
            this.smooth.scrollTo(target, { offset:offset, duration: time });
            return;

        }
        // check offset
        if (offset === false) {
            offset = this.opts.offset;
        }

        let newOffset = 0;

        if (offset) {
            if (typeof offset === 'string') {
                $(offset).each(function () {
                    newOffset += $(this).outerHeight(true);
                    console.log('newOffset', newOffset);
                });
            }
            else if (typeof offset == 'number') {
                newOffset = this.opts.offset;
            }
            else if (typeof offset === 'function') {
                newOffset = this.opts.offset();
            }
        }

        if (newOffset > 0) {
            target -= newOffset;
        }

        this._scrollToPosition(target, time);
    }

    updateView() {

    }

    initView() {
        this.scrollTo(0, 0);
        if (window.location.hash) {
            if ($(window.location.hash).length > 0) {
                this.scrollTo(window.location.hash, 0);
            }
        }
    }

    init() {
        return new Promise((resolve, reject) => {
            // touch detector
            this._touchDetector();

            // click events
            this._clickEvents();
            resolve(true)
        })


    }
}
