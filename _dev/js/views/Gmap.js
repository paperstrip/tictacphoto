import GmapComponent from "@js/components/GmapComponent";

export default class Gmap {
	constructor(options = {}) {
		// options
		this.options = {
			icon: false,
			zoom: false
		};
		this.options = Object.assign(this.options, options);

		// init
		this._init();
	}

	reset() {

	}

	initView() {
		$('[data-gmap]').each((i, el) => {
			let $el = $(el);

			if ($el.data('gmap') == '') {
				let gmap = new GmapComponent($el);
				if (this.options.icon) {
					gmap.setMarkerIcon(this.options.icon);
				}

				if ($el.data('marker-image')) gmap.setMarkerIcon($el.data('marker-image'));

				if ($el.data('markers')) {
					let markers = $el.data('markers');
					console.log(markers);
					if (markers.length > 0) {
						let firstMarker = markers[0];

						if ("localization_lat" in firstMarker) {
							gmap.addMarkers(markers, (item) => {
								return {
									lat: item.localization_lat,
									lng: item.localization_lng,
								};
							});
							markers = null;
							firstMarker = null;

							gmap.setMarkerCluster();
						}
					}
				}
				else if ($el.data('lat') && $el.data('lng')) {
					let marker = {
						lat: $el.data('lat'),
						lng: $el.data('lng'),
						url: $el.data('url') ? $el.data('url') : false,
						icon: this.options.icon,
					};
					gmap.addMarker(marker);

					if (this.options.zoom) gmap.setZoom(this.options.zoom);
				}

				$el.data('gmap', gmap);
				gmap.setTheme(this._getDefaultTheme());
				return gmap;
			}

		});

	}

	_init() {
		this.initView()
	}

	_getDefaultTheme() {
		return [
			{
				"featureType": "all",
				"elementType": "geometry",
				"stylers": [
					{
						"visibility": "off"
					}
				]
			},
			{
				"featureType": "all",
				"elementType": "labels",
				"stylers": [
					{
						"visibility": "off"
					}
				]
			},
			{
				"featureType": "administrative",
				"elementType": "geometry",
				"stylers": [
					{
						"visibility": "off"
					}
				]
			},
			{
				"featureType": "administrative.country",
				"elementType": "geometry",
				"stylers": [
					{
						"visibility": "off"
					}
				]
			},
			{
				"featureType": "administrative.country",
				"elementType": "geometry.stroke",
				"stylers": [
					{
						"visibility": "on"
					},
					{
						"color": "#FFFFFF"
					}
				]
			},
			{
				"featureType": "administrative.province",
				"elementType": "geometry",
				"stylers": [
					{
						"visibility": "off"
					}
				]
			},
			{
				"featureType": "administrative.locality",
				"elementType": "geometry",
				"stylers": [
					{
						"visibility": "off"
					}
				]
			},
			{
				"featureType": "administrative.neighborhood",
				"elementType": "geometry",
				"stylers": [
					{
						"visibility": "off"
					}
				]
			},
			{
				"featureType": "administrative.land_parcel",
				"elementType": "geometry",
				"stylers": [
					{
						"visibility": "off"
					}
				]
			},
			{
				"featureType": "landscape",
				"elementType": "all",
				"stylers": [
					{
						"visibility": "on"
					}
				]
			},
			{
				"featureType": "landscape",
				"elementType": "geometry",
				"stylers": [
					{
						"visibility": "off"
					},
					{
						"hue": "#000000"
					}
				]
			},
			{
				"featureType": "landscape",
				"elementType": "labels",
				"stylers": [
					{
						"visibility": "off"
					}
				]
			},
			{
				"featureType": "landscape.man_made",
				"elementType": "geometry",
				"stylers": [
					{
						"visibility": "on"
					},
					{
						"weight": "6.90"
					},
					{
						"color": "#000000"
					}
				]
			},
			{
				"featureType": "landscape.man_made",
				"elementType": "geometry.fill",
				"stylers": [
					{
						"color": "#ffffff"
					}
				]
			},
			{
				"featureType": "landscape.natural",
				"elementType": "geometry",
				"stylers": [
					{
						"visibility": "on"
					},
					{
						"color": "#ffffff"
					}
				]
			},
			{
				"featureType": "landscape.natural.landcover",
				"elementType": "geometry",
				"stylers": [
					{
						"visibility": "off"
					}
				]
			},
			{
				"featureType": "landscape.natural.terrain",
				"elementType": "geometry",
				"stylers": [
					{
						"visibility": "off"
					},
					{
						"saturation": "-1"
					}
				]
			},
			{
				"featureType": "poi",
				"elementType": "all",
				"stylers": [
					{
						"visibility": "off"
					}
				]
			},
			{
				"featureType": "poi",
				"elementType": "geometry",
				"stylers": [
					{
						"visibility": "off"
					}
				]
			},
			{
				"featureType": "poi.attraction",
				"elementType": "geometry",
				"stylers": [
					{
						"visibility": "off"
					}
				]
			},
			{
				"featureType": "road",
				"elementType": "geometry.stroke",
				"stylers": [
					{
						"visibility": "off"
					}
				]
			},
			{
				"featureType": "road.highway",
				"elementType": "geometry",
				"stylers": [
					{
						"visibility": "off"
					}
				]
			},
			{
				"featureType": "road.highway",
				"elementType": "geometry.fill",
				"stylers": [
					{
						"color": "#000000"
					},
					{
						"visibility": "off"
					}
				]
			},
			{
				"featureType": "road.highway",
				"elementType": "geometry.stroke",
				"stylers": [
					{
						"visibility": "off"
					},
					{
						"color": "#000000"
					},
					{
						"saturation": "-85"
					}
				]
			},
			{
				"featureType": "road.arterial",
				"elementType": "geometry.fill",
				"stylers": [
					{
						"color": "#000000"
					},
					{
						"visibility": "off"
					}
				]
			},
			{
				"featureType": "road.local",
				"elementType": "geometry",
				"stylers": [
					{
						"visibility": "off"
					}
				]
			},
			{
				"featureType": "road.local",
				"elementType": "geometry.fill",
				"stylers": [
					{
						"color": "#000000"
					}
				]
			},
			{
				"featureType": "transit",
				"elementType": "all",
				"stylers": [
					{
						"visibility": "off"
					}
				]
			},
			{
				"featureType": "transit",
				"elementType": "geometry",
				"stylers": [
					{
						"visibility": "off"
					}
				]
			},
			{
				"featureType": "transit.line",
				"elementType": "geometry",
				"stylers": [
					{
						"visibility": "off"
					}
				]
			},
			{
				"featureType": "transit.line",
				"elementType": "geometry.fill",
				"stylers": [
					{
						"visibility": "off"
					}
				]
			},
			{
				"featureType": "transit.station",
				"elementType": "geometry",
				"stylers": [
					{
						"visibility": "off"
					}
				]
			},
			{
				"featureType": "transit.station.airport",
				"elementType": "geometry",
				"stylers": [
					{
						"visibility": "off"
					}
				]
			},
			{
				"featureType": "transit.station.bus",
				"elementType": "geometry",
				"stylers": [
					{
						"visibility": "off"
					}
				]
			},
			{
				"featureType": "transit.station.rail",
				"elementType": "geometry",
				"stylers": [
					{
						"visibility": "off"
					}
				]
			},
			{
				"featureType": "water",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#FFFFFF"
					},
					{
						"visibility": "on"
					}
				]
			},
			{
				"featureType": "water",
				"elementType": "geometry.fill",
				"stylers": [
					{
						"color": "#FFFFFF"
					}
				]
			},
			{
				"featureType": "water",
				"elementType": "geometry.stroke",
				"stylers": [
					{
						"visibility": "off"
					}
				]
			}
		];
	}
}
