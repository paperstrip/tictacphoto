<?php
use Roots\Sage\Config;
use Roots\Sage\Wrapper;
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<?php get_template_part('templates/layout/head'); ?>
<script>
data = {
    "ajaxify": {
        "routes": [
            ["/", "home", "index"],
            ["/", "about", "index"],
            ["/", "products", "index"],
            ["/", "products", "details"],
            ["/", "news", "index"],
            ["/", "news", "details"],
            ["/", "faq", "index"],
            ["/", "sustainability", "index"],
            ["/", "premium", "index"],
            ["/", "iframe", "index"],
            ["/", "default", "index"],
        ]
    },
    "recaptchaKey": "6LdYIkAqAAAAABeXDy4q-lYDwQ_nILM0pA4N71ap",
    'stripe_public_key': '',
    'base': "<?php echo get_template_directory_uri(); ?>",
    'plugins': "<?php echo get_site_url(); ?>",
    'ajaxUrl': "<?php echo admin_url('admin-ajax.php');?>",
    'aiDisclosure': "<?php echo esc_js(function_exists('pll__') ? pll__('Cette image a été modifiée ou générée par IA') : 'Cette image a été modifiée ou générée par IA'); ?>"
};
</script>
<body class="is-touch">
    <?php
    $args = array(
        'post_type' => 'services',
        'posts_per_page' => -1,
    );
    $queryServices = new WP_Query($args); 
    set_query_var('queryServices',$queryServices);
    ?>
    <?php get_template_part('templates/layout/header');?>
    <?php get_template_part('templates/layout/introduction'); ?>
    <script>
        let dynamicVh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--dynamic-vh', `${dynamicVh}px`);
        let header = document.querySelector('header');
        document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
        let headerInner = document.querySelector('.main-nav');
        document.documentElement.style.setProperty('--header-nav-height', `${headerInner.offsetHeight}px`);
    </script>
    <?php get_template_part('templates/layout/loader'); ?>
    <main data-barba="wrapper" data-scroll-container>
        <div data-barba="container">
            <?php include Wrapper\template_path();?>
        </div>
    </main>
    <?php get_template_part('templates/layout/footer'); ?>
    <?php do_action('get_footer');?>
</body>
<?php 
wp_footer();
?>
</html>
