window.faq = new (function () {
    this.index = function () {
        $('[data-barba-namespace]:last-child .accordion__button').click(function () {
            // Fermer tous les autres contenus ouverts
            $('[data-barba-namespace]:last-child .accordion__content').slideUp(300);

            // Vérifier si le contenu lié au bouton cliqué est déjà ouvert
            if ($(this).next('.accordion__content').is(':visible')) {
                // Si c'est déjà ouvert, on le ferme
                $(this).next('.accordion__content').slideUp(300);
                $(this).parent().removeClass('active');
            } else {
                // Sinon, on l'ouvre
                $(this).next('.accordion__content').slideDown(300);
                $(this).parent().addClass('active');

            }
        });
    }

});


