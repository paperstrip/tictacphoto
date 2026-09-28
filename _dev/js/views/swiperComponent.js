import Swiper, { Navigation, Pagination, Parallax, Controller, EffectCreative, Thumbs, Autoplay, Scrollbar, FreeMode } from 'swiper';
import 'swiper/css';
//import 'swiper/swiper-bundle.css';

export default class SwiperItem {
	constructor(target, options = {}) {
		// options
		this.swiper = '';
		this.target = target;
		this.options = {
			modules: [Navigation, Pagination, Controller, Parallax, EffectCreative, Thumbs, Autoplay, Scrollbar, FreeMode],
			threshold: 10,
			longSwipesRatio: .2,
		};
		this.options = Object.assign(this.options, options);

		// init
		this._init();
	}
	on(events, handler) {
		this.swiper.on(events, function (e) {
			handler(e);
		});
	}

	_init() {
		this.swiper = "";
		this.swiper = new Swiper(this.target, this.options);
		console.log(this.swiper)

		return this;
	}

}
