export default class Whatsapp {
	constructor(target,options = {}) {
		// options
        this.openButton = document.querySelector('[data-open-whatsapp]')
        this.box = document.querySelector('[data-chat]');
		this.textarea = document.querySelector('[data-dynamic-message]')
        this.close = document.querySelector('[data-close]');
        this.message='';
        this.timeOut = false;
		this.buttonSend = document.querySelector('[data-send]');
		// init
		this._init();
	}
	addNotification(){
        this.box.classList.add('notification-active')

    }
    _removeNotification(){
        this.box.classList.remove('notification-active')

    }
    _openPannel(){
        this.box.classList.add('open')
        this._removeNotification();
        this.textarea.focus();

        if (this.timeOu){
            window.clearTimeout(this.timeOu)
            return;
        }
        this.timeOut = window.setTimeout(()=>{
            this.box.classList.add('message-loaded')

        },1500);

    }
    _closePannel(){
        this.box.classList.remove('open')
    }
    _updateMessageContent(){
        this.textarea.addEventListener('keypress',(e)=>{
            this.message = this.textarea.value;
            let href = new URL(this.buttonSend.href);
            href.searchParams.set('text', this.message);
            this.buttonSend.setAttribute("href", href);
            if(e.which === 13){
                this.textarea.value='';
                this.box.classList.add('open-whatsapp')
                simulateClick(this.buttonSend);
                e.preventDefault();

            }

        })
        let simulateClick = function (elem) {
            // Create our event (with options)
            let evt = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            // If cancelled, don't dispatch our event
            let canceled = !elem.dispatchEvent(evt);
        };

    }
 
	
	_init() {
        this._updateMessageContent();
        //this.addNotification();
        this.close.addEventListener('click',()=>{
            this._closePannel()
           
        })
        this.buttonSend.addEventListener('click',()=>{
            this.textarea.value='';
            this.box.classList.add('open-whatsapp')

            //this._closePannel();
           
        })
        this.openButton.addEventListener('click',()=>{
            if (this.box.classList.contains('open')){
                this._closePannel()
            }else{
                this._openPannel()
            }
        })

        
        
	}
	
}