let vars = {};
export let lastPageYOffset = null;

vars.$document = document;
vars.$window = window;
vars.$body = document.body;
vars.$html = document.documentElement;
vars.isMobile = () => innerWidth <= 1024;
vars.isIE = () => vars.$html.classList.contains('is-browser-ie');
vars.winWidth = window.innerWidth;

const debounced = [];
const cancelFunc = (timeout) => () => {
	clearTimeout(timeout);
};

vars.loadImage = (src) => {
	return new Promise((resolve, reject) => {
		const $img = new Image();

		$img.onload = () => {
			resolve($img);
		};

		$img.onerror = () => {
			reject();
		};

		$img.src = src;
	});
}

vars.debounce = (fn, wait, ...args) => {
	let d = debounced.find(({funcString}) => funcString === fn.toString());

	if (d) {
		d.cancel();
	} else {
		d = {};
		debounced.push(d);
	}

	d.func = fn;
	d.funcString = fn.toString();
	d.timeout = setTimeout(fn, wait, ...args);
	d.cancel = cancelFunc(d.timeout);
};

vars.saveScrollPosition = () => {
	vars.$html.style.scrollBehavior = 'initial';
	lastPageYOffset = window.pageYOffset || document.documentElement.scrollTop;
};

vars.restoreScrollPosition = () => {
	if (lastPageYOffset !== null) {
		window.scrollTo(window.pageXOffset, lastPageYOffset);
		lastPageYOffset = null;
		vars.$html.style.scrollBehavior = '';
	}
};

// smooth scrolling
vars.scrollTo = (scrollTo, time = 500, offset = 0) => {
	vars.$html.style.scrollBehavior = 'initial';

	if (typeof scrollTo === 'string') {
		let scrollToObj = document.querySelector(scrollTo);

		if (scrollToObj && typeof scrollToObj.getBoundingClientRect === 'function') {
			scrollTo = window.pageYOffset + scrollToObj.getBoundingClientRect().top;
		}
	} else if (typeof scrollTo !== 'number') {
		scrollTo = 0 + offset;
	}

	let anchorHeightAdjust = 30;
	if (scrollTo > anchorHeightAdjust) {
		scrollTo -= anchorHeightAdjust + offset;
	}

	if (typeof time !== 'number' || time < 0) {
		time = 500;
	}

	let cosParameter = (window.pageYOffset - scrollTo) / 2;
	let scrollCount = 0;
	let oldTimestamp = window.performance.now();

	function step(newTimestamp) {
		let tsDiff = newTimestamp - oldTimestamp;

		if (tsDiff > 100) {
			tsDiff = 30;
		}

		scrollCount += Math.PI / (time / tsDiff);

		if (scrollCount >= Math.PI) {
			return;
		}

		let moveStep = Math.round(scrollTo + cosParameter + cosParameter * Math.cos(scrollCount));

		window.scrollTo(0, moveStep);
		oldTimestamp = newTimestamp;
		window.requestAnimationFrame(step);
	}

	window.requestAnimationFrame(step);

	setTimeout(() => {
		vars.$html.style.scrollBehavior = '';
	}, time + 100);
};

let scrollDiv;

vars.getScrollbarWidth = () => {
	const width = window.innerWidth - vars.$html.clientWidth;

	if (width) {
		return width;
	}

	// Document doesn't have a scrollbar, possibly because there is not enough content so browser doesn't show it
	if (!scrollDiv) {
		scrollDiv = document.createElement('div');
		scrollDiv.style.cssText = 'width:100px;height:100px;overflow:scroll !important;position:absolute;top:-9999px';
		document.body.appendChild(scrollDiv);
	}

	return scrollDiv.offsetWidth - scrollDiv.clientWidth;
};

vars.supportsPassive = false;

if (typeof window !== 'undefined') {
	const passiveTestOptions = {
		get passive() {
			vars.supportsPassive = true;

			return undefined;
		},
	};

	window.addEventListener('testPassive', null, passiveTestOptions);
	window.removeEventListener('testPassive', null, passiveTestOptions);
}

// Trigger (el.dispatchEvent(event);)
if (window.CustomEvent) {
	// eslint-disable-next-line no-unused-vars
	const event = new CustomEvent('custom-event', {detail: {key1: 'data'}});
} else {
	const event = document.createEvent('CustomEvent');
	event.initCustomEvent('custom-event', true, true, {key1: 'data'});
}

// matches(el, '.my-class'); = $(el).is('.my-class');
vars.matches = (el, selector) => {
	return (el.matches ||
		el.matchesSelector ||
		el.msMatchesSelector ||
		el.mozMatchesSelector ||
		el.webkitMatchesSelector ||
		el.oMatchesSelector).call(el, selector);
};

function hasHoverSupport() {
	let hoverSupport;

	if (vars.isIE && vars.getScrollbarWidth()) {
		// On touch devices scrollbar width is usually 0
		hoverSupport = true;
	} else if (vars.isMobile()) {
		hoverSupport = false;
	} else if (window.matchMedia('(any-hover: hover)').matches || window.matchMedia('(hover: hover)').matches) {
		hoverSupport = true;
	} else if (window.matchMedia('(hover: none)').matches) {
		hoverSupport = false;
	} else {
		hoverSupport = typeof vars.$html.ontouchstart === 'undefined';
	}

	return hoverSupport;
}

function hasHover() {
	if (!hasHoverSupport()) {
		if (vars.$html.classList.contains('has-hover')) {
			vars.$html.classList.remove('has-hover');
		}

		vars.$html.classList.add('no-hover');
	} else {
		if (vars.$html.classList.contains('no-hover')) {
			vars.$html.classList.remove('no-hover');
		}

		vars.$html.classList.add('has-hover');
	}
}

hasHover();

function resize() {
	vars.debounce(() => {
		if (vars.winWidth !== window.innerWidth) {
			hasHover();

			vars.winWidth = window.innerWidth;
		}
	}, 300);
}

vars.closest = (el, selector) => {
	const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

	while (el) {
		if (matchesSelector.call(el, selector)) {
			return el;
		}

		el = el.parentElement;
	}

	return null;
};

vars.$window.addEventListener('resize', resize);

export default vars;
