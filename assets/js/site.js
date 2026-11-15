// Site-wide behavior. Loaded at the end of every page, after jQuery and the
// jQuery plugins on the pages that use them (index and portfolio).
(function () {
	'use strict';

	// Formspree redirect: "~/thankyou.html" -> "<this origin>/thankyou.html",
	// so the redirect also works when testing locally.
	document.querySelectorAll('input[name="_next"]').forEach(function (input) {
		input.value = input.value.replace('~', window.location.origin);
	});

	// ---- Phone menu ------------------------------------------------------
	// The nav's data-open attribute drives the Tailwind group-data-[open]: classes.
	var nav = document.getElementById('site-nav');
	var hamburger = nav && nav.querySelector('.hamburger');

	if (hamburger) {
		var setMenuOpen = function (open) {
			nav.toggleAttribute('data-open', open);
			hamburger.setAttribute('aria-expanded', String(open));
		};

		hamburger.addEventListener('click', function (event) {
			event.stopPropagation();
			setMenuOpen(!nav.hasAttribute('data-open'));
		});

		document.addEventListener('click', function (event) {
			if (nav.hasAttribute('data-open') && !nav.contains(event.target)) setMenuOpen(false);
		});

		document.addEventListener('keydown', function (event) {
			if (event.key === 'Escape' && nav.hasAttribute('data-open')) {
				setMenuOpen(false);
				hamburger.focus();
			}
		});

		// Home page only (data-attention): shake the button and float music notes for 5 seconds.
		var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (hamburger.hasAttribute('data-attention') && !reduceMotion && hamburger.offsetParent !== null) {
			var notes = ['♪', '♫', '♬'];
			var pulse = setInterval(function () {
				hamburger.classList.remove('animate-shake');
				void hamburger.offsetWidth; // restart the animation
				hamburger.classList.add('animate-shake');

				for (var i = 0; i < 2; i++) {
					var note = document.createElement('span');
					note.className = 'pointer-events-none absolute top-0 left-1/2 text-base text-white animate-float-up';
					note.setAttribute('aria-hidden', 'true');
					note.textContent = notes[Math.floor(Math.random() * notes.length)];
					note.style.setProperty('--x', (Math.random() * 20 - 10) + 'px');
					note.addEventListener('animationend', function () { this.remove(); });
					hamburger.appendChild(note);
				}
			}, 500);

			setTimeout(function () {
				clearInterval(pulse);
				hamburger.classList.remove('animate-shake');
			}, 5000);
		}
	}

	// ---- Service inquiry modal (services page) ---------------------------
	// Each .tile customizes the modal through data attributes:
	//   data-service       text after "Thank you for considering me for your "
	//   data-tileloc       placeholder for the location field
	//   data-removefields  comma-separated ids; "<id>-container" is hidden and its inputs disabled
	// .tile-header becomes the email subject and .tile-subtitle the modal description.
	var modal = document.getElementById('contact-modal');

	if (modal) {
		var form = modal.querySelector('form');
		var heading = document.getElementById('modal-heading');
		var description = document.getElementById('modal-description');
		var subject = document.getElementById('modal-subject');
		var locationInput = document.getElementById('modal-location');
		var lastTile = null;

		var setContainerEnabled = function (container, enabled) {
			container.hidden = !enabled;
			container.querySelectorAll('input, textarea, select').forEach(function (field) {
				field.disabled = !enabled;
			});
		};

		var openModal = function (tile) {
			form.reset();
			modal.querySelectorAll('[id$="-container"]').forEach(function (container) {
				setContainerEnabled(container, true);
			});

			(tile.dataset.removefields || '').split(',').forEach(function (id) {
				var container = id.trim() && document.getElementById(id.trim() + '-container');
				if (container) setContainerEnabled(container, false);
			});

			var tileName = tile.querySelector('.tile-header').textContent.trim();
			locationInput.placeholder = tile.dataset.tileloc || '';
			heading.textContent = 'Thank you for considering me for your ' + tile.dataset.service;
			description.textContent = tile.querySelector('.tile-subtitle').textContent.trim();
			subject.value = 'Submission from website - Inquiry about ' + tileName + ' - ' + new Date().toLocaleString();

			lastTile = tile;
			modal.hidden = false;
			form.querySelector('input:not([type="hidden"]):not(:disabled)').focus();
		};

		var closeModal = function () {
			modal.hidden = true;
			if (lastTile) lastTile.focus();
		};

		document.querySelectorAll('.tile').forEach(function (tile) {
			tile.addEventListener('click', function () { openModal(tile); });
			tile.addEventListener('keydown', function (event) {
				if (event.key === 'Enter' || event.key === ' ') {
					event.preventDefault();
					openModal(tile);
				}
			});
		});

		modal.addEventListener('click', function (event) {
			if (event.target === modal || event.target.closest('[data-modal-close]')) closeModal();
		});

		document.addEventListener('keydown', function (event) {
			if (event.key === 'Escape' && !modal.hidden) closeModal();
		});
	}

	// ---- Carousels and lightboxes (index and portfolio) ------------------
	var $ = window.jQuery;
	if (!$) return;

	$(function () {
		if ($.fn.magnificPopup) {
			$('.popup-youtube').magnificPopup({
				type: 'iframe',
				iframe: {
					patterns: {
						youtube: {
							index: 'youtube.com/',
							id: 'v=',
							src: 'https://www.youtube.com/embed/%id%?autoplay=1'
						}
					}
				}
			});

			// Photo gallery. Built at click time from the real slides only, so the
			// copies Slick adds for infinite scrolling don't show up twice.
			$('.media-grid').on('click', 'a.media-popup', function (event) {
				event.preventDefault();
				var $grid = $(event.delegateTarget);
				var links = $grid.find('.slick-slide:not(.slick-cloned) a.media-popup').get();
				if (!links.length) links = $grid.find('a.media-popup').get();

				var clicked = this.href;
				var items = links.map(function (link) { return { src: link.href }; });
				var index = Math.max(0, links.findIndex(function (link) { return link.href === clicked; }));

				$.magnificPopup.open({ items: items, type: 'image', gallery: { enabled: true } }, index);
			});
		}

		if ($.fn.slick) {
			// Home page: one video at a time.
			$('.slider').slick({
				slidesToShow: 1,
				slidesToScroll: 1,
				autoplay: true,
				dots: true,
				arrows: false
			});

			// Portfolio: two at a time on desktop, one on phones.
			$('.media-grid').slick({
				slidesToShow: 2,
				slidesToScroll: 1,
				infinite: true,
				autoplay: true,
				dots: true,
				arrows: false,
				responsive: [
					{ breakpoint: 768, settings: { slidesToShow: 1 } }
				]
			});
		}
	});
})();
