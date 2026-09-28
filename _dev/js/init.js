window.initGlobal = function () {
    if (window.navigator.userAgent.match(/MSIE|Trident/) !== null) {
        $('body').addClass('is-ie');
    }
    if (window.isTouchDevice === true) {
        $('body').addClass('is-touch').removeClass('is-desktop');
        try { // prevent exception on browsers not supporting DOM styleSheets properly
            for (var si in document.styleSheets) {
                var styleSheet = document.styleSheets[si];
                if (!styleSheet.rules) continue;

                for (var ri = styleSheet.rules.length - 1; ri >= 0; ri--) {
                    if (!styleSheet.rules[ri].selectorText) continue;

                    if (styleSheet.rules[ri].selectorText.match(':hover')) {
                        styleSheet.deleteRule(ri);
                    }
                }
            }
        } catch (ex) { }
    } else {
        $('body').addClass('is-desktop').removeClass('is-touch');
    }
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--dynamic-vh', `${vh}px`);

    let resizeTimout = false
    let windowWidth = window.innerWidth
    // array of MenuItem
    window.appEvent.resize(() => {
        let dynamicVh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--dynamic-vh', `${dynamicVh}px`);
        let header = document.querySelector('header');
        document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);

        //window.scrollAnimation.update();
        if (window.innerWidth != windowWidth) {
            windowWidth = window.innerWidth
            window.menuNav.menuResizeHandler()
        }

    }, true)

    appEvent.listen('app:launcEnterAnimation', () => {
        window.scrollAnimation.update()

    })

    appEvent.listen('app:threejsAnimation:start', () => {
        window.scrollAnimation.lazyload()
        window.scrollAnimation.initView()
        window.scrollAnimation.update()
        window.scrollAnimation.initEnterAnimation()

    });

};
window.aiLabelImages = function () {
    const label = (typeof data !== 'undefined' && data.aiDisclosure) ? data.aiDisclosure : '';
    if (!label) return;
    document.querySelectorAll('img:not([data-ai-labeled])').forEach(img => {
        img.setAttribute('title', label);
        img.setAttribute('data-ai-labeled', '1');
    });
};

window.initView = function () {
    window.menuNav.updateCurrentLink();
    let header = document.querySelector('header');
    document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
    let headerInner = document.querySelector('.main-nav');
    document.documentElement.style.setProperty('--header-nav-height', `${headerInner.offsetHeight}px`);
     $('[data-open-popup]').removeClass('active');
    $("body").removeClass('open-popup');
    $('.popup-creation').removeClass('active');
    window.aiLabelImages();
};



let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

let header = document.querySelector('header');
document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
let headerInner = document.querySelector('.main-nav');
document.documentElement.style.setProperty('--header-nav-height', `${headerInner.offsetHeight}px`);

// Promise pour charger Barba.js
const barbaJsPromise = new Promise((resolve) => {
    import(/*webpackMode:"lazy"*/ /*eagger*/ /* webpackChunkName: "barbaSysthem" */ "@js/_barba/barba").then(({ default: BarbaJs }) => {
        window.barba = new BarbaJs();
        window.barba.setDefaultTransition();
        resolve(true);
    });
});

// Promise pour charger ScrollAnimation


// Promise pour charger ScrollComponent
const ScrollComponentPromise = new Promise((resolve) => {
    import(/*webpackMode:"lazy"*/ /*eagger*/ /* webpackChunkName: "scrollComponentSysthem" */ "@js/_barba/components/ScrollComponent").then(({ default: ScrollComponent }) => {
        window.globalScroll = new ScrollComponent({
            smooth: true,
            offset: 'header'
        });
        resolve(true);
    });
});
const ScrollAnimationPromise = new Promise((resolve) => {
    import(/*webpackMode:"lazy"*/ /*eagger*/ /* webpackChunkName: "scrollAnimationSysthem" */ "@js/views/scrollAnimation").then(() => {
        resolve(true);
    });
});

// Promise pour charger MenuNav
const MenuNavPromise = new Promise((resolve) => {
    import(/*webpackMode:"lazy"*/ /*eagger*/ /* webpackChunkName: "menuNavSysthem" */ "@js/views/menuNav").then(({ default: ScrollComponent }) => {
        window.menuNav.init();
        resolve(true);
    });
});

// Vérification de la condition pour déterminer le mode de chargement

// Fonction pour initialiser l'application
const initializeApp = () => {
    Promise.all([barbaJsPromise, ScrollComponentPromise, ScrollAnimationPromise, MenuNavPromise]).then(() => {

        window.globalScroll.init().then(() => {
            window.scrollAnimation.init();
            window.scrollAnimation.initGlobal();
            window.scrollAnimation.lazyload();
            window.barba.init();
            window.landingLoader.init();

        });
    });
};
// Appel de la fonction d'initialisation de l'application
initializeApp();

// AI Act — label images on every AJAX inject
appEvent.listen('app:ajaxInjected', () => {
    window.aiLabelImages();
});



