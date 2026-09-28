<?php
function register_shortcode_link($atts, $content = null, $tag = '')
{
    // Définition des attributs par défaut
    $atts = shortcode_atts(array(
        'type' => '',
        'class' => '',
    ), $atts, $tag);

    // Récupération du champ ACF correspondant en fonction du type de lien
    switch ($atts['type']) {
        case 'mail':
            $option_field = 'option_email_general';
            $link_prefix = 'mailto:';
            break;
        case 'phone':
            $option_field = 'option_phone_general';
            $link_prefix = 'tel:';
            break;
        case 'address':
            $option_field = 'option_adresse';
            $link_prefix = 'http://maps.google.com/maps?z=12&t=m&q=loc:';
            break;
        case 'whatsapp':
            $option_field = 'option_whatsapp';
            $link_prefix = 'https://wa.me/';
            break;
        case 'facebook':
            $option_field = 'option_facebook';
            $link_prefix = '';
            break;
        case 'youtube':
            $option_field = 'option_youtube';
            $link_prefix = '';
            break;
        case 'instagram':
            $option_field = 'option_instagram';
            $link_prefix = '';
            break;
        case 'linkedin':
            $option_field = 'option_linkedin';
            $link_prefix = '';
            break;
        case 'twitter':
            $option_field = 'option_twitter';
            $link_prefix = '';
            break;
        default:
            // Retourner une chaîne vide si le type n'est pas valide
            return '';
    }

    // Récupération de la valeur du champ ACF correspondant
    $link = get_field($option_field, 'option');

    // Vérification de la présence du lien
    if ($link) {
        // Création de la balise <a> avec les attributs
        $output = '<a data-barba-prevent="self" rel="noreferrer" target="_blank" href="' . esc_url($link_prefix . $link) . '"';

        // Ajout de la classe CSS si elle est fournie
        if (!empty($atts['class'])) {
            $output .= ' class="' . esc_attr($atts['class']) . '"';
        }

        // Ajout du contenu du shortcode si présent
        if ($content) {
            $output .= '>' . $content . '</a>';
        } else {
            $output .= '>' . $link . '</a>';
        }

        return $output;
    } else {
        return ''; // Retourner une chaîne vide si le champ ACF est vide
    }
}

// Enregistrement du shortcode avec le même nom pour tous les types de liens
add_shortcode('wibi_link', 'register_shortcode_link');
/*
[wibi_link type="mail"]
[wibi_link type="phone"]
[wibi_link type="address"]
[wibi_link type="whatsapp"]
[wibi_link type="facebook"]
[wibi_link type="instagram"]
[wibi_link type="linkedin"]
[wibi_link type="twitter"]

    ||

[wibi_link type="mail"]Cliquez ici pour nous contacter[/wibi_link]
[wibi_link type="phone"]Appelez-nous maintenant[/wibi_link]
[wibi_link type="address"]Trouvez-nous sur Google Maps[/wibi_link]
[wibi_link type="whatsapp"]Envoyez-nous un message WhatsApp[/wibi_link]
[wibi_link type="facebook"]Suivez-nous sur Facebook[/wibi_link]
[wibi_link type="instagram"]Suivez-nous sur Instagram[/wibi_link]
[wibi_link type="linkedin"]Connectez-vous avec nous sur LinkedIn[/wibi_link]
[wibi_link type="twitter"]Suivez-nous sur Twitter[/wibi_link]

    ||

[wibi_link type="mail" class="custom-class"]
[wibi_link type="phone" class="custom-class"]
[wibi_link type="address" class="custom-class"]
[wibi_link type="whatsapp" class="custom-class"]
[wibi_link type="facebook" class="custom-class"]
[wibi_link type="instagram" class="custom-class"]
[wibi_link type="linkedin" class="custom-class"]
[wibi_link type="twitter" class="custom-class"]

*/