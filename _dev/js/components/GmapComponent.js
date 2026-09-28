export default class GmapComponent {
	constructor(target, options = {}) {

		// prototypes
		this._prototypes();

		// unique id
		this.uniqId = Math.random().toString(36).substr(2, 9)

		// target
		this.target = target;

		// markerCluster
		this.markerCluster = false;

		// onClick handler
		this.onClickHandler = false;

		// infowindow
		this.gInfowindow = false;
		this.infowindowHandler = false;

		// options
		this.options = {
			zoomControl: false,
			mapTypeControl: false,
			scaleControl: false,
			streetViewControl: false,
			rotateControl: false,
			fullscreenControl: false,
			gestureHandling: 'cooperative',
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			center: options.center || {
				lat: 50.850346,
				lng: 4.351721
			},
			zoom: options.zoom || 10
		};
		this.options = Object.assign(this.options, options);

		// map object
		this.map = false;

		// default icon
		this.defaultIcon = false;

		// markers
		this.markers = [];

		// geocoder
		this.geocoder = false;

		// autocomplete
		this.autocomplete = false;

		// init
		this._init();
	}

	setAutocomplete(target, callbackSuccess, callbackError = false){
		let id = 'autocomplete_'+this.uniqId;
		$(target).attr('id', id);

		this.autocomplete = new google.maps.places.Autocomplete(document.getElementById(id));
		this.autocomplete.bindTo('bounds', this.map);
		this.autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);

		//
		google.maps.event.addDomListener(document.getElementById(id), 'keydown', (e) => {
			// If enter key, or tab key
			if (e.keyCode === 13 || e.keyCode === 9) {

				// If user isn't navigating using arrows and this hasn't ran yet
				if (!e.hasRanOnce) {
					let evtKeyPress = new Event('keydown');
					evtKeyPress.code = "ArrowDown";
					evtKeyPress.key = "ArrowDown";
					evtKeyPress.keyCode = 40;
					evtKeyPress.hasRanOnce= true;
					google.maps.event.trigger(e.target, 'keydown', evtKeyPress);
				}

				e.preventDefault();

				return false;
			}
		});

		// place_changed GoogleMaps listener when we do submit
		google.maps.event.addListener(this.autocomplete, 'place_changed', function() {

			// Get the place info from the autocomplete Api
			let place = this.getPlace();
			let lat, lng = null;
			if(place.geometry)
			{
				lat = place.geometry.location.lat();
				lng = place.geometry.location.lng();
			}
			if(lat && lng)
			{
				let address = {
					street_number: {
						long_name:'',
						short_name:''
					},
					route: {
						long_name:'',
						short_name:''
					},
					locality: {
						long_name:'',
						short_name:''
					},
					country: {
						long_name:'',
						short_name:''
					},
					postal_code: {
						long_name:'',
						short_name:''
					}
				};
				$(place.address_components).each(function (index, element) {
					address[element.types[0]] = element;
				});

				let out = {
					name: place.name,
					street: address.route.long_name+" "+address.street_number.long_name,
					postalcode: address.postal_code.long_name,
					city: address.locality.long_name,
					code_city:address.locality.short_name,
					country: address.country.long_name,
					code_country:address.country.short_name
				}

				callbackSuccess(lat,lng, out);
			}
			else
			{
				if (callbackError){
					callbackError()
				}
				else{
					alert('No placesfounded')
				}
			}

		});
	}

	setCenter(latlng){
		this.map.setCenter(latlng);
	}

	setZoom(value){
		this.map.setOptions({
			zoom:value
		});
	}

	setOptions(options){
		this.map.setOptions(options)
		return this;
	}

	setTheme(styles){
		this.setOptions({styles:styles});
		return this;
	}

	setMarkerIcon(icon){
		this.defaultIcon = window.data.base + icon;

		let i;
		for(i = 0; i < this.markers.length; i++) {
			this.markers[i].setIcon(this.defaultIcon);
		}
		return this;
	}

	setZoomButtons(zoomIn = '[data-map-zoom="zoomIn"]', zoomOut = '[data-map-zoom="zoomOut"]'){
		let $zoomInBtn = $(zoomIn);
		let $zoomOutBtn = $(zoomOut);
		if ($zoomInBtn.length > 0){
			$zoomInBtn[0].addEventListener('click',(e) => {
				e.preventDefault();
				let currentZoom = this.map.getZoom();
				currentZoom = currentZoom + 1;
				this.map.setZoom(currentZoom);
			});
		}
		if ($zoomOutBtn.length > 0){
			$zoomOutBtn[0].addEventListener('click',(e) => {
				e.preventDefault();
				let currentZoom = this.map.getZoom();
				currentZoom = currentZoom - 1;
				this.map.setZoom(currentZoom);
			});
		}
	}

	setMarkerCluster(icon = false) {
		if(this.markers.length > 1 && typeof MarkerClusterer === 'function')
		{
			let markerClusterIcon = {
				width: 50,
				height: 50,
				textColor: '#ffffff',
				textSize: 14
			};
			if(icon === false)
			{
				markerClusterIcon.url = window.data.base + '/assets/images/marker-cluster.png';
			}
			else if(typeof icon === 'string')
			{
				markerClusterIcon.url = window.data.base + icon;
			}
			else
			{
				markerClusterIcon = Object.assign(markerClusterIcon, icon);
			}

			let minClusterZoom = 18;
			let markerClusterOptions = {
				styles:[markerClusterIcon],
				gridSize:40,
				ignoreHidden:true
			};

			this.markerCluster = new MarkerClusterer(this.map, this.markers, markerClusterOptions,{ignoreHidden: true});
			this.markerCluster.setMaxZoom(minClusterZoom);

		}
	}

	createMarker(latlng = false){
		let markerOptions = {
			map: this.map,
			anchorPoint: new google.maps.Point(0, -29)
		};
		if(this.defaultIcon)
		{
			markerOptions.icon = this.defaultIcon;
		}
		let marker = new google.maps.Marker(markerOptions);

		if(latlng)
		{
			marker.setPosition(latlng);
			marker.setVisible(true);
		}

		return marker;
	}

	addMarker(data, center = true) {
		let marker = false;

		let latlng = false;
		if("lat" in data && "lng" in data)
		{
			latlng = {
				lat: parseFloat(data.lat),
				lng: parseFloat(data.lng)
			};
		}
		else if("latitude" in data && "longitude" in data)
		{
			latlng = {
				lat: parseFloat(data.latitude),
				lng: parseFloat(data.longitude)
			};
		}

		if(latlng)
		{
			let i;
			for (i = 0; i < this.markers.length; i++)
			{
				let existingMarker = this.markers[i];
				let pos = existingMarker.getPosition();

				//if a marker already exists in the same position as this marker
				if (pos.lat() == latlng.lat && pos.lng() == latlng.lng) {
					//update the position of the coincident marker by applying a small multipler to its coordinates
					var newLat = latlng.lat + (Math.random() -.5) / 1500;// * (Math.random() * (max - min) + min);
					var newLng = latlng.lng + (Math.random() -.5) / 1500;// * (Math.random() * (max - min) + min);
					latlng = {
						lat:newLat,
						lng:newLng
					};
				}
			}

			marker = this.createMarker(latlng);

			if("icon" in data)
			{
				marker.setIcon(window.data.base + data.icon);
			}

			google.maps.event.addListener(marker, 'click', () => {
				if(this.onClickHandler)
				{
					this.onClickHandler(marker);
				}
				else if(data.url)
				{
					let win = window.open(data.url, '_blank');
					win.focus();
				}

				if(this.infowindowHandler)
				{
					if(this.gInfowindow) this.gInfowindow.close();

					// check infowindow
					if(this.gInfowindow == false)
					{
						this.gInfowindow = new google.maps.InfoWindow({
							content: this.infowindowHandler(marker)
						});
					}
					else
					{
						this.gInfowindow.setContent(this.infowindowHandler(marker));
					}
					this.gInfowindow.open(this.map, marker);
				}
			});

			google.maps.event.addListener(this.map, "dragend", () => {
				if(this.gInfowindow) this.gInfowindow.close();
			});

			marker.data = data;

			this.markers.push(marker);

			if(center)
			{
				this.setCenter(latlng);
			}
		}

		return marker;
	}

	addMarkers(markersData, callback = false)
	{
		let i;
		for(i = 0; i < markersData.length; i++) {
			let markerData = markersData[i];
			if(callback)
			{
				markerData = Object.assign(markerData, callback(markerData));
			}

			this.addMarker(markerData, false);
		}

		this.bounds();
	}

	getClosest(limit = this.markers.length, callback) {

		function _getClosest(el)
		{
			let visibleMarkers = [];
			let i;
			for (i = 0; i < el.markers.length; i++) {
				if (el.markers[i].getVisible() == true){
					visibleMarkers.push(el.markers[i]);
				}
			}
			for (i = 0; i < visibleMarkers.length; i++) {
				visibleMarkers[i].distance = google.maps.geometry.spherical.computeDistanceBetween(visibleMarkers[i].position, el.map.getCenter());
			}
			visibleMarkers.sort(function(a, b) {
				if (a.distance < b.distance)
					return -1
				if (a.distance > b.distance)
					return 1;
				return 0;
			});

			let closestMarkers = visibleMarkers.slice(0, limit);
			callback(closestMarkers);
		}

		google.maps.event.addListener(this.map, "idle", () => {
			window.clearTimeout(this.idleTimeout)
			this.idleTimeout = setTimeout( ()  => {
				_getClosest(this)
			}, 2);
		});

		_getClosest(this);
	}

	onClick(handler) {
		this.onClickHandler = handler;
	}

	infowindow(handler) {
		this.infowindowHandler = handler;
	}

	getInfowindow() {
		return this.gInfowindow;
	}

	filter(callback, bounds = true) {
		let oneVisible = false;
		let visibleMarkerCLuster = [];
		let i;
		for (i = 0; i < this.markers.length; i++) {
			if(callback(this.markers[i]))
			{
				this.markers[i].setVisible(true);
				oneVisible = true;
				visibleMarkerCLuster.push(this.markers[i]);
			}
			else
			{
				this.markers[i].setVisible(false);
			}
		}

		if(this.markerCluster)
		{
			this.markerCluster.clearMarkers();
			this.markerCluster.addMarkers(visibleMarkerCLuster);
		}

		if(bounds)
		{
			this.bounds();
		}
	};

	bounds(markers = false) {
		if(markers === false) markers = this.markers;

		let latLng;
		let bounds = new google.maps.LatLngBounds();
		let i;
		for (i = 0; i < markers.length; i++) {
			let marker = markers[i];

			if(marker.getVisible())
			{
				latLng = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
				bounds.extend(latLng);
			}
		}
		this.map.setCenter(bounds.getCenter());
		this.map.panToBounds(bounds);

		this.map.fitBounds(bounds);
	}

	_init(){
		let id = 'gmaps_'+this.uniqId;
		$(this.target).attr('id', id);
		this.map = new google.maps.Map(document.getElementById(id), this.options);
	}

	_prototypes(){
		// setCenterWithOffset
		google.maps.Map.prototype.setCenterWithOffset = function(latlng, offsetX, offsetY) {
			let map = this;
			let ov = new google.maps.OverlayView();
			ov.onAdd = function() {
				let proj = this.getProjection();
				let aPoint = proj.fromLatLngToContainerPixel(latlng);
				aPoint.x = aPoint.x+offsetX;
				aPoint.y = aPoint.y+offsetY;
				map.setCenter(proj.fromContainerPixelToLatLng(aPoint));
			};
			ov.draw = function() {};
			ov.setMap(this);
		};
	}
}
