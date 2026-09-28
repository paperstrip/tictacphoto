export default class FormComponent {
    constructor() {
        this.recaptchaRenders = {};
        this.timout = false;
        this.loaded = false;
        this.recaptchaIsRenders = false;

    }
    initGlobal() {
        this._ajaxForm();
        this._ajaxFormMessage();
        this._goForm()

    }
    initView() {
        if ($().parsley) {
            console.log('formcomponent initialize parsley');
            $("[data-form],[data-form-message],[data-form-go]").parsley({
                //excluded: "input[type=button], input[type=submit], input[type=reset], input[type=hidden], [disabled], :hidden",
                errorsContainer: function (pEle) {

                    if (pEle.$element.is('select') && pEle.$element.next('.select2').length > 0) {
                        if (pEle.$element.next('select2errorsContainer').length == 0) {
                            pEle.$element.next('.select2').after('<div class="select2errorsContainer"></div>');
                        }
                        return pEle.$element.next().next();
                    }

                }
            });
        }

        // générer les recaptcha
        $('[data-form], [data-form-message]').find('[data-recaptcha]').each((i, element) => {
            let $this = $(element);
            if ($this.find('.grecaptcha-badge').length > 0) return true;
            let $form = $this.parents('form[data-form-message], form[data-form]');

            let command = $form.is('[data-form-message]') ? 'formMessage' : 'form';
            $this.attr('id', 'recaptcha-' + command + '-' + this._createUID());
            this._redendRecaptcha($form).then(() => {
                this._render($this, command, $form, this.recaptchaRenders)
            })
        });

    }
    _render($el, command, $form) {

        this.recaptchaRenders[$el.attr('id')] = grecaptcha.render($el.attr('id'), {
            "sitekey": data.recaptchaKey,
            "badge": "inline",
            "hl": 'fr',
            "type": "image",
            "size": "invisible",
            "callback": () => {
                this._formSubmit(command, $form[0]);
            }
        });
    }
    _redendRecaptcha($form) {
        return new Promise((resolve) => {

            // remove focus to avoid js error:
            if (this.recaptchaIsRenders == false) {
                $form.find('input,select,textarea').one('focus',
                    () => {
                        this._initCaptcha(this.timout).then(() => {
                            resolve(true);
                            this.recaptchaIsRenders = true

                        })
                    })
            } else {
                resolve(true);
            }

        });





    }
    _initCaptcha(timout = false) {

        return new Promise((resolve) => {
            if ($('#lazyReacptcha').length == 0) {

                let head = document.getElementsByTagName('head')[0]
                let script = document.createElement('script')
                script.id = 'lazyReacptcha';
                script.type = 'text/javascript';
                script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
                head.appendChild(script);

            }
            let captchaScript = document.getElementById('lazyReacptcha')
            captchaScript.onload = () => {
                grecaptcha.ready(() => {
                    if (typeof grecaptcha === 'undefined') {
                        // window.__grecaptcha_cfg is a global variable that stores reCAPTCHA's
                        // configuration. By default, any functions listed in its 'fns' property
                        // are automatically executed when reCAPTCHA loads.
                    } else {
                        resolve(true)
                    }
                });
            };
        });

    }
    _goForm() {
        $('body').on("submit", "form[data-form-go]", (e) => {
            e.preventDefault();
            let $form = $(e.currentTarget);

            window.barba.go($form.attr('action') + '?' + $form.serialize());
        });
    }


    _ajaxForm() {
        $('body').on("submit", "form[data-form]", (e) => {
            e.preventDefault();
            let $form = $(e.currentTarget);
            $form.addClass('is-processing')

            if ($form.find('[data-recaptcha]').length > 0) {

                grecaptcha.execute(this.recaptchaRenders[$form.find('[data-recaptcha]').attr('id')]);
            }
            else {
                this._formSubmit('form', e.currentTarget)
            }
        });
    };

    _ajaxFormMessage() {
        $('body').on("submit", "form[data-form-message]", (e) => {
            e.preventDefault();
            let $form = $(e.currentTarget);
            $form.addClass('is-processing')
            if ($form.find('[data-recaptcha]').length > 0) {
                console.log(this.recaptchaRenders, $form.find('[data-recaptcha]').attr('id'));
                console.log(this.recaptchaRenders, $form.find('[data-recaptcha]').attr('id'));
                grecaptcha.reset(this.recaptchaRenders, $form.find('[data-recaptcha]').attr('id'));
                grecaptcha.execute(this.recaptchaRenders[$form.find('[data-recaptcha]').attr('id')]);
            }
            else {
                this._formSubmit('formMessage', e.currentTarget)
            }
        });
    }

    _formSubmit(command, el) {
        let $form = $(el);
        let name = $form.data('form-message') ? $form.data('form-message') : $form.data('form');
        let method = $form.attr('method');
        let formData = new FormData(el);

        if (method == 'get') {
            formData = $form.serialize();
        }


        if ($form.find('[data-recaptcha]').length == 0 || true) {
            if (name != '') {
                window.appEvent.trigger(command + ':' + name + ':process', [$form]);
            }
            $form.addClass('is-processing')
            window.appEvent.trigger(command + ':ajax:process', [$form]);
        }
        const lang = document.documentElement.lang;
        let currentLanguage = 'fr'
        switch (lang) {
            case 'nl-BE':
                currentLanguage = 'nl'
                break;
            case 'en-US':
                currentLanguage = 'en'
                break;
            case 'en-GB':
                currentLanguage = 'en'
                break;
            case 'de-DE':
                currentLanguage = 'de'
                break;
            case 'es-ES':
                currentLanguage = 'es'
            break;
               
        }

        $.ajax({
            url: $form.attr('action') ? $form.attr('action') : $form.attr('data-action'),
            type: method,
            data: formData,
            success: (response) => {
                if ($form.find('[data-recaptcha]').length > 0) {
                    grecaptcha.reset(this.recaptchaRenders[$form.find('[data-recaptcha]').attr('id')]);
                }
                $form.removeClass('is-processing')

                if (name != '') {
                    window.appEvent.trigger(command + ':' + name + ':success', [
                        response,
                        $form
                    ]);
                }
                window.appEvent.trigger(command + ':ajax:success', [
                    response,
                    $form
                ]);
                if ($form.attr('data-redirect')) {
                    window.barba.instance.force($form.attr('data-redirect'))
                }
            },
            error: (xhr, status) => {

                $form.removeClass('is-processing')

                if (name != '') {
                    window.appEvent.trigger(command + ':' + name + ':error', [$form]);
                }
                window.appEvent.trigger(command + ':ajax:error', [$form]);

            },
            contentType: false,
            processData: false
        });
    }

    _createUID() {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }
}
