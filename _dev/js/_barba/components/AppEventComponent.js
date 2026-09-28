export default class AppEventComponent {
    constructor() {
        // handlers
        this.handlers = {};
        this.resizeHandlers = {};

        // init
        this._init();
    }

    reset() {

    }

    add(handler, handlers = false) {
        if(!handlers) handlers = this.handlers;
        let handlerStr = handler.toString();
        if(handlerStr in handlers)
        {
            return handlers[handlerStr];
        }
        else
        {
            handlers[handlerStr] = handler;
            return handler;
        }
    }

    remove(handler) {
        let handlerStr = handler.toString();
        if(handlerStr in this.handlers)
        {
            delete this.handlers.handlerStr;
        }
    }

    listen(command, handler, newGlobal = null) {
        handler = this.add(handler);
        $(document).off(command, handler).on(command, handler);

        return this;
    }

    resize(handler, newGlobal = null) {
        this.add(handler, this.resizeHandlers);
        return this;
    }

    trigger(events, args = null) {
        if(events == 'resize')
        {
            //this._resizeHandler();
        }
        else if(events.indexOf(':') !== -1)
        {
            args = args || [];
            $(document).trigger(events, args);
        }
        return this;
    }

    _resizeHandler() {
        // load all scripts
        let i;
        for(i in this.resizeHandlers)
        {
            this.resizeHandlers[i]();
        }
    }

    _init() {

        // resize
        let cachedWidth = window.innerWidth;
        let cachedHeight = window.innerHeight;
        $(window).on('resize orientationchange', () => {
            let newWidth = window.innerWidth;
            let newHeight = window.innerHeight;
            if(newWidth !== cachedWidth || newHeight !== cachedHeight){
                // new width
                cachedWidth = newWidth;
                cachedHeight = newHeight;

                this._resizeHandler();
            }
        });
    }

    _isFunction(functionToCheck) {
        return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
    }
}
