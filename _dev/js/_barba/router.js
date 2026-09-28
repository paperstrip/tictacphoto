import FetchContent from '@js/fetch';

export default function Router(instance, router) {
    window.views = [];
    window.routes = [];

    this.instance = instance
    this.router = router;
    let ajaxifyRoutes = data.ajaxify.routes;
    ajaxifyRoutes.forEach(function (elements) {
        let route = new Object;
        route.path = elements[0];
        route.name = elements[1] + elements[2].charAt(0).toUpperCase() + elements[2].slice(1);
        window.routes.push(route)

        window.views.push({
            namespace: route.name,
            beforeEnter(data) {
                var done = this.async();
                FetchContent(elements[1]).then(function (res) {
                    if (window[elements[1]]) {
                        window[elements[1]][elements[2]]();
                        window.controller = elements[1];
                    }
                    done();

                });
            }
        });
    })

}
