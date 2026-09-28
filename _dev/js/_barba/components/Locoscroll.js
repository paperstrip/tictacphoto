import LocomotiveScroll from 'locomotive-scroll';
class Locoscroll {
    constructor(options = {}) {
        // options
        this.loco = false;
        this.opts = options
        this.init()
    }
    init(){
        this.loco = new LocomotiveScroll(
            this.opts
        );
       
        
        return this.loco;
    }
}
export { Locoscroll }
 