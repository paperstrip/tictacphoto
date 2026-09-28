window.iframe = new (function () {
    this.index = function () {
        var iframe = $('[data-barba-namespace]:last-child').find('.embed-website').last()[0];
        console.log(iframe);
        if (!iframe) return; 

        function handleIframeLoad() {
            iframe.classList.add('loaded');
            iframe.parentElement.classList.add('loaded');
        }

        iframe.onload = handleIframeLoad;
        // ⚡ Forcer le reload de l'iframe si besoin
        iframe.src = iframe.src;
    }
})


