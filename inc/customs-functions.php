<?php

function get_product_url_with_lang($post_id = null)
{
    static $cached_lang = null;

    if ($cached_lang === null) {
        $cached_lang = function_exists('pll_current_language') ? pll_current_language() : '';
    }

    $url = get_field('product_url', $post_id);

    if ($url && $cached_lang) {
        $url = add_query_arg(array('lang' => $cached_lang), $url);
    }

    return $url;
}

add_action('wp_head', 'theme_typekit_inline');
function theme_typekit()
{
    wp_enqueue_script('theme_typekit', '//use.typekit.net/yqv7wye.js', '', null);
}
add_action('wp_enqueue_scripts', 'theme_typekit');

function theme_typekit_inline()
{
?>
    <script>
        const fontKey = "fontLoaded";
        const stylesheet = "https://use.typekit.net/yqv7wye.css";

        // Once the font has loaded:
        // - Set the media type, thereby applying the CSS.
        // - Store a boolean indicating we've already loaded the font.
        function onFontLoad(link) {
            link.media = "all";
            sessionStorage.setItem(fontKey, "true");
        }

        // Create a new link element for the stylesheet
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = stylesheet;

        // Check if the font has been loaded before
        if (sessionStorage.getItem(fontKey)) {
            // If it has, apply the stylesheet immediately
            document.head.appendChild(link);
        } else {
            // If not, load the stylesheet asynchronously and handle the load event
            link.media = "print";
            link.onload = function() {
                onFontLoad(link);
            };
            document.head.appendChild(link);
        }
    </script>
<?php
}

add_action('admin_init', 'remove_comments');
function remove_comments()
{
    remove_menu_page('edit-comments.php');
}
add_filter('json_enabled', '__return_true');
add_filter('json_jsonp_enabled', '__return_true');


function remove_h1_from_editor($settings)
{
    $settings['block_formats'] = 'Paragraph=p;Heading 2=h2;Heading 3=h3;Heading 4=h4;Heading 5=h5;Heading 6=h6;Preformatted=pre;';
    return $settings;
}
add_filter('tiny_mce_before_init', 'remove_h1_from_editor');
function postpone_script($name)
{
    global $wp_scripts;
    // Get attributes from original script
    $thesrc = $wp_scripts->registered[$name]->src;
    $theversion = $wp_scripts->registered[$name]->ver;

    // Remove script from the header
    wp_dequeue_script($name);
    wp_deregister_script($name);
    // Add script to the bottom
    //wp_enqueue_script($name, $thesrc, false /* no deps */, $theversion, true /* bottom */);
}
/**
 * Move cookie law javascript to the bottom
 */
function postpone_cookie_law()
{
    if (!is_admin()) {
        //postpone_script('cookie-law-info');
    }
}

add_action('wp_print_scripts', 'postpone_cookie_law');
add_filter('clean_url', 'defer_parsing_of_js', 11, 1);
add_filter('style_loader_tag', 'ct_style_loader_tag', 10, 2);
add_filter('clean_url', 'defer_parsing_of_js', 11, 1);
function defer_parsing_of_js($url)
{
    if (! is_admin() && strpos($url, 'cookie-law-info-public.js')) {
        return "";
    } else {
        return $url;
    }
}
add_filter('style_loader_tag', 'ct_style_loader_tag', 10, 2);
function ct_style_loader_tag($html, $handle)
{
    $async_loading = array(
        'cookie-law-info-css',
        'cookie-law-info-table',
        'cookie-law-info-public',
        'cookie-law-info-public.css',
        'cookie-law-info',
        'cookie-law-info-gdpr',
    );


    if (in_array($handle, $async_loading)) {
        $async_html = str_replace('rel=\'stylesheet\'', 'rel="preload" as="style" onload="this.rel=\'stylesheet\'"', $html);
        return $async_html;
    }

    return $html;
}
function custom_login_stylesheet()
{
    wp_enqueue_style('custom-login', get_stylesheet_directory_uri() . '/css/admin.css');
}

//This loads the function above on the login page
//add_action( 'login_enqueue_scripts', 'custom_login_stylesheet' );
//add_action( 'admin_enqueue_scripts', 'custom_login_stylesheet' );

//add_editor_style('css/custom-editor.css');

function wps_deregister_styles()
{
    wp_dequeue_style('global-styles');
}
add_action('wp_enqueue_scripts', 'wps_deregister_styles', 100);
function smartwp_remove_wp_block_library_css()
{
    wp_dequeue_style('wp-block-library');
    wp_dequeue_style('wp-block-library-theme');
    wp_dequeue_style('wc-blocks-style'); // Remove WooCommerce block CSS
    wp_deregister_style('classic-theme-styles');
    wp_dequeue_style('classic-theme-styles');
}
add_action('wp_enqueue_scripts', 'smartwp_remove_wp_block_library_css', 100);
// preload css in wordpress
// add this code in child theme function.php
add_filter('style_loader_tag',  'preload_filter', 10, 2);
function preload_filter($html, $handle)
{
    if (strcmp($handle, 'preload-style') == 0) {
        $rel = 'onload=this.rel=' . '"' . 'stylesheet"';
        $html = str_replace("rel='stylesheet'", "rel='preload' as='style' " . $rel . "", $html);
    }

    return $html;
}
function remove_jquery_migrate($scripts)
{
    if (! is_admin() && isset($scripts->registered['jquery'])) {
        $script = $scripts->registered['jquery'];
        if ($script->deps) {
            // Check whether the script has any dependencies

            $script->deps = array_diff($script->deps, array('jquery-migrate'));
            $script->deps = array_diff($script->deps, array('jquery'));
        }
    }
}
add_action('wp_default_scripts', 'remove_jquery_migrate');
function get_critical_css($route)
{
    $path = 'templates/criticals/criticals-' . $route;
    return get_template_part($path);
}


function my_deregister_scripts()
{
    wp_deregister_script('wp-embed');
}
add_action('wp_footer', 'my_deregister_scripts');
// AUTHORIZE SVG IMPORT


// AUTHORIZE SVG IMPORT
add_filter('wp_check_filetype_and_ext', function ($data, $file, $filename, $mimes) {
    $filetype = wp_check_filetype($filename, $mimes);
    return [
        'ext'             => $filetype['ext'],
        'type'            => $filetype['type'],
        'proper_filename' => $data['proper_filename']
    ];
}, 10, 4);

function cc_mime_types($mimes)
{
    $mimes['svg'] = 'image/svg+xml';
    return $mimes;
}
add_filter('upload_mimes', 'cc_mime_types');

function fix_svg()
{
    echo '<style type="text/css">
          .attachment-266x266, .thumbnail img {
               width: 100% !important;
               height: auto !important;
          }
          </style>';
}
add_action('admin_head', 'fix_svg');
// CUSTOMIZE BREADCRUMBS
function tn_custom_excerpt_length($length)
{
    return 10;
}
add_filter('excerpt_length', 'tn_custom_excerpt_length', 999);

function modify_read_more_link()
{
    return '...';
}
add_filter('excerpt_more', 'modify_read_more_link');
function remove_menu()
{
    //remove_menu_page('edit.php');
    remove_menu_page('edit-comments.php');
}

add_action('admin_menu', 'remove_menu');
add_filter('use_block_editor_for_post', '__return_false');



// ── Membership SPA ────────────────────────────────────────────────────────────
// Le routing est 100% React (TanStack Router, basepath = BASE_PATH).
// Côté WP : une seule URL canonique /membership/... servie par la page racine FR,
// la langue passe en ?lng={lang} (lu en premier par i18next).
// Les pages membership des autres langues restent en place pour les menus
// Polylang, mais leur URL /{lang}/membership/... est redirigée vers ?lng={lang}.

function tictac_member_languages()
{
    return function_exists('pll_languages_list') ? pll_languages_list() : ['fr'];
}

function tictac_member_default_language()
{
    return function_exists('pll_default_language') ? pll_default_language() : 'fr';
}

// Page racine de l'espace membre dans la langue par défaut (template + sans parent).
function tictac_member_root_page()
{
    static $page = false;
    if ($page !== false) return $page;

    $pages = get_posts([
        'post_type'        => 'page',
        'posts_per_page'   => 1,
        'post_parent'      => 0,
        'meta_key'         => '_wp_page_template',
        'meta_value'       => 'template-members.php',
        'post_status'      => 'publish',
        'lang'             => tictac_member_default_language(),
        'suppress_filters' => false,
    ]);
    $page = !empty($pages) ? $pages[0] : null;
    return $page;
}

// Langue de l'espace membre : ?lng, puis le cookie Polylang (posé par la navigation
// sur le site public), puis la langue par défaut. Le cookie couvre le rechargement
// d'une page SPA dont l'URL a perdu le ?lng.
function tictac_member_current_lang()
{
    $languages = tictac_member_languages();
    $candidates = [
        isset($_GET['lng']) ? wp_unslash($_GET['lng']) : '',
        isset($_COOKIE['pll_language']) ? wp_unslash($_COOKIE['pll_language']) : '',
    ];
    foreach ($candidates as $candidate) {
        $candidate = strtolower(substr(sanitize_text_field($candidate), 0, 2));
        if (in_array($candidate, $languages, true)) return $candidate;
    }
    return tictac_member_default_language();
}

// Toutes les URLs /membership/... vers la page racine : React gère le reste,
// y compris les segments dynamiques (orders/<id>, checkout/payment/<id>/complete…).
add_action('init', function () {
    $root = tictac_member_root_page();
    if (!$root) return;

    add_rewrite_rule(
        '^' . preg_quote(get_page_uri($root->ID), '/') . '(/.*)?$',
        'index.php?page_id=' . $root->ID,
        'top'
    );
});

// /{lang}/membership/... → /membership/...?lng={lang}
// 302 le temps de valider la migration ; passer en 301 une fois stable.
add_action('init', function () {
    if (is_admin() || wp_doing_ajax() || (defined('REST_REQUEST') && REST_REQUEST)) return;

    $root = tictac_member_root_page();
    if (!$root) return;

    $home      = untrailingslashit(get_option('home'));
    $home_path = (string) parse_url($home, PHP_URL_PATH);
    $path      = (string) parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);

    if ($home_path !== '' && strpos($path, $home_path) === 0) {
        $path = substr($path, strlen($home_path));
    }
    $path = ltrim($path, '/');

    $languages = array_map(function ($l) {
        return preg_quote($l, '#');
    }, tictac_member_languages());
    $slug = preg_quote(get_page_uri($root->ID), '#');

    if (!preg_match('#^(' . implode('|', $languages) . ')/' . $slug . '(/.*)?$#', $path, $m)) return;

    $target = $home . '/' . get_page_uri($root->ID) . (isset($m[2]) && $m[2] !== '' ? $m[2] : '/');
    if (!empty($_SERVER['QUERY_STRING'])) {
        $target .= '?' . $_SERVER['QUERY_STRING'];
    }
    wp_safe_redirect(add_query_arg('lng', $m[1], $target), 302);
    exit;
}, 1);

// Flush automatique quand le thème change (une seule fois)
add_action('after_switch_theme', 'flush_rewrite_rules');

// CUSTOMIZE ECHO FUNCTION TO SHOW ECHO BY DEFAULT OR SHOW POLYLANG TRANSLATABLE STRING
function e__($string = '')
{
    if (function_exists('pll__')) {
        echo pll__($string);
    } else {
        echo $string;
    }
    return $string;
}

// ── EU AI Act — disclosure ────────────────────────────────────────────────────
// Machine-readable: meta in <head> (crawlers, automated tools)
add_action('wp_head', function () {
    $notice = function_exists('pll__') ? pll__('Les images de ce site peuvent avoir été modifiées ou générées par intelligence artificielle.') : 'Les images de ce site peuvent avoir été modifiées ou générées par intelligence artificielle.';
    echo '<meta name="ai-content-disclosure" content="' . esc_attr($notice) . '">' . "\n";
});


function getTplPageURL($TEMPLATE_NAME, $info = false)
{
    $url;

    //Code which i need
    $pages = query_posts(array(
        'post_type' => 'page',
        'meta_key'  => '_wp_page_template',
        'meta_value' => $TEMPLATE_NAME
    ));


    // cycle through $pages here and either grab the URL
    // from the results or do get_page_link($id) with
    // the id of the page you want
    $array = null;
    $url = null;
    wp_reset_query();
    if (isset($pages[0]) && $info == false) {
        $url = get_page_link($pages[0]->ID);
        return $url;
    }
    if (isset($pages[0]) && $info == true) {
        $array = $pages[0];
        return $array;
    }
}


function remove_editor()
{
    remove_post_type_support('post', 'editor');
    remove_post_type_support('post', 'comments');
    remove_post_type_support('page', 'comments');
    add_post_type_support('post', 'excerpt');
    if (isset($_GET['post'])) {
        $id = $_GET['post'];
        $template = get_post_meta($id, '_wp_page_template', true);
        switch ($template) {
            case 'template-about.php':
            case 'template-collections.php':
            case 'template-contact.php':
            case 'template-home.php':
            case 'template-news.php':
            case 'template-press.php':
            case 'template-services.php':
            case 'template-page.php':
            case 'template-faq.php':
            case 'template-sustainability.php':
            case 'template-iframe.php':
            case 'template-premium.php':



                remove_post_type_support('page', 'editor');
                break;
            default:
                // Don't remove any other template.
                break;
        }
    }
}


function remove_thumbnails()
{
    if (isset($_GET['post'])) {
        $id = $_GET['post'];
        $template = get_post_meta($id, '_wp_page_template', true);
        switch ($template) {
            case 'template-about.php':
            case 'template-collections.php':
            case 'template-contact.php':
            case 'template-home.php':
            case 'template-news.php':
            case 'template-press.php':
            case 'template-services.php':
                //case 'template-page.php':
            case 'template-faq.php':
            case 'template-sustainability.php':
            case 'template-iframe.php':
            case 'template-premium.php':


                //case 'template-contact.php':


                remove_post_type_support('page', 'thumbnail');
                break;
            default:
                // Don't remove any other template.
                break;
        }
    }
}
add_action('init', 'remove_editor');
add_action('init', 'remove_thumbnails');


/**
 * Disable the emoji's
 */
function disable_emojis()
{
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('admin_print_styles', 'print_emoji_styles');
    remove_filter('the_content_feed', 'wp_staticize_emoji');
    remove_filter('comment_text_rss', 'wp_staticize_emoji');
    remove_filter('wp_mail', 'wp_staticize_emoji_for_email');
    add_filter('tiny_mce_plugins', 'disable_emojis_tinymce');
    add_filter('wp_resource_hints', 'disable_emojis_remove_dns_prefetch', 10, 2);
}

/**
 * Filter function used to remove the tinymce emoji plugin.
 * 
 * @param array $plugins 
 * @return array Difference betwen the two arrays
 */
function disable_emojis_tinymce($plugins)
{
    if (is_array($plugins)) {
        return array_diff($plugins, array('wpemoji'));
    } else {
        return array();
    }
}

/**
 * Remove emoji CDN hostname from DNS prefetching hints.
 *
 * @param array $urls URLs to print for resource hints.
 * @param string $relation_type The relation type the URLs are printed for.
 * @return array Difference betwen the two arrays.
 */
function disable_emojis_remove_dns_prefetch($urls, $relation_type)
{
    if ('dns-prefetch' == $relation_type) {
        /** This filter is documented in wp-includes/formatting.php */
        $emoji_svg_url = apply_filters('emoji_svg_url', 'https://s.w.org/images/core/emoji/2/svg/');

        $urls = array_diff($urls, array($emoji_svg_url));
    }

    return $urls;
}


function disable_drag_metabox()
{
    if ('cases' === get_current_screen()->post_type) {
        wp_deregister_script('postbox');
    }
}
add_action('load-post.php', 'disable_drag_metabox');

function add_custom_class_to_menu_link($atts, $item, $args)
{
    // Vérifiez si le menu est celui que vous souhaitez cibler
    if ($args->theme_location == 'main_navigation_language') {
        // Ajoutez la classe souhaitée à l'élément <a>
        $atts['class'] = 'btn';
    }
    return $atts;
}
add_filter('nav_menu_link_attributes', 'add_custom_class_to_menu_link', 10, 3);

function add_taxonomy_terms_to_menu($items, $args)
{
    // Vérifie si c'est bien le menu 'main_navigation'
    if ('main_navigation' === $args->theme_location) {
        // Récupérer le lien d'archive pour le custom post type 'products'
        $archive_page_link = get_post_type_archive_link('products'); // 'products' est ton custom post type

        if ($archive_page_link) {
            // Chercher les termes parents de la taxonomie personnalisée
            $terms = get_terms(array(
                'taxonomy'   => 'categoryproducts', // Remplace par ta taxonomie
                'hide_empty' => true, // <-- MODIFIÉ ICI : Masque les catégories vides
                'meta_key'   => 'category_api_id',
                'orderby'    => 'meta_value_num',
                'order'      => 'ASC',
                'parent'     => 0, // Commencer par les termes parents
            ));

            if (! empty($terms) && ! is_wp_error($terms)) {
                // Construire les nouveaux items de menu pour les termes
                $new_items = '<li class="menu-item menu-item-has-children"><a href="' . esc_url($archive_page_link) . '">' . pll__('Nos autres produits') . '</a>';
                $new_items .= '<ul class="sub-menu">';

                // Ajouter les termes de la taxonomie sous 'Products'
                foreach ($terms as $term) {
                    $add_to_menu = get_field('add_to_menu', 'categoryproducts_' . $term->term_id);
                    // Si le champ ACF est défini à true, on l'exclut
                    if ($add_to_menu) {
                        continue; // On passe à la prochaine catégorie sans l'afficher
                    }
                    $new_items .= '<li class="menu-item"><a href="' . get_term_link($term) . '">' . $term->name . '<div class="link-more">' . pll__('Voir tout') . '</div></a>';

                    // Ajouter les sous-catégories
                    $new_items .= add_sub_menu_items($term->term_id);

                    $new_items .= '</li>';
                }

                $new_items .= '</ul></li>';

                // Convertir $items en tableau si c'est une chaîne
                if (! is_array($items)) {
                    $items = explode('</li>', $items); // Séparer les items en fonction de la balise </li>
                }

                // Diviser les items en deux parties, avant et après la 3ème position
                $menu_items_before = array_slice($items, 0, 2); // Les 2 premiers items
                $menu_items_after = array_slice($items, 2); // Les items restants

                // Réassembler le menu en insérant les nouveaux items à la 3ème position
                $items = array_merge($menu_items_before, array($new_items), $menu_items_after);

                // Reconvertir en chaîne si nécessaire
                $items = implode('</li>', $items);
            }
        }
    }

    return $items;
}
add_filter('wp_nav_menu_items', 'add_taxonomy_terms_to_menu', 10, 2);

function add_sub_menu_items($parent_id)
{
    // Récupérer les sous-catégories
    $child_terms = get_terms(array(
        'taxonomy'   => 'categoryproducts',
        'hide_empty' => true, // <-- MODIFIÉ ICI AUSSI : Masque les sous-catégories vides
        'meta_key'   => 'category_api_id',
        'orderby'    => 'meta_value_num',
        'order'      => 'ASC',
        'parent'     => $parent_id,
    ));

    $sub_menu = '';

    if (! empty($child_terms) && ! is_wp_error($child_terms)) {
        $sub_menu .= '<ul class="sub-menu">';
        foreach ($child_terms as $child) {
            $sub_menu .= '<li class="menu-item"><a href="' . get_term_link($child) . '">' . $child->name . '</a>';
            $sub_menu .= add_sub_menu_items($child->term_id); // Récursif pour les sous-sous-catégories
            $sub_menu .= '</li>';
        }
        $sub_menu .= '</ul>';
    }

    return $sub_menu;
}


add_filter('wpseo_replacements', function ($replacements) {
    if (isset($replacements['%%ct_categoryproducts%%']) && isset($replacements['%%sep%%'])) {

        // Récupérer le séparateur déjà préparé par Yoast
        $separator = $replacements['%%sep%%'];

        // Si le séparateur n'a pas d'espace, en ajouter pour une meilleure lisibilité
        if (strpos($separator, ' ') === false) {
            $separator = ' ' . $separator . ' ';
        }

        // Remplacer les virgules par le séparateur Yoast
        $replacements['%%ct_categoryproducts%%'] = str_replace(',', $separator, $replacements['%%ct_categoryproducts%%']);
    }
    return $replacements;
});


?>
