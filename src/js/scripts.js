/* global YT */
import 'jquery';
import 'html5shiv';
import './delayEvent.jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/style.sass';

$(document).ready(function() {
	
	let blockHeights = {
		heightTopPart: 0,
		heightAboutBlock: 0,
		heightMiddlePart: 0,
		heightBottomPart: 0,
		offset: 0,
		calcBlockHeight() {
			this.heightTopPart = parseInt($('#header-carousel').css('height'), 10) -
											this.offset;
			this.heightAboutBlock = parseInt($('#block-about').css('height'), 10) +
											parseInt($('#gallery-carousel').css('height'), 10) -
											this.offset;
			this.heightMiddlePart = parseInt($('#block-menu').css('height'), 10) +
											parseInt($('#block-video').css('height'), 10) -
											this.offset + 200;
			this.heightBottomPart = parseInt($('#block-stock').css('height'), 10) +
											parseInt($('#block-photoes').css('height'), 10) -
											this.offset;
		}
	};

	window.setTimeout(() => {
		blockHeights.calcBlockHeight();
		$(window).resize(() => blockHeights.calcBlockHeight());
	}, 500);


	$('.navbar-nav a').on('click', (e) => {
		e.preventDefault();
		switch (e.target.id) {
			case 'menu-about':
				$('html').animate({ scrollTop: blockHeights.heightTopPart });
				window.location = '#block-about';
			break;
			case 'menu-menu':
				$('html').animate({ scrollTop: blockHeights.heightTopPart +
																				blockHeights.heightAboutBlock });
				window.location = '#block-menu';
			break;
			case 'menu-stock':
				$('html').animate({ scrollTop: blockHeights.heightTopPart +
																				blockHeights.heightAboutBlock +
																				blockHeights.heightMiddlePart });
				window.location = '#block-stock';
			break;
			case 'menu-contacts':
				$('html').animate({ scrollTop: blockHeights.heightTopPart +
																				blockHeights.heightAboutBlock +
																				blockHeights.heightMiddlePart +
																				blockHeights.heightBottomPart });
				window.location = '#block-contacts';
			break;
		}
	});

	$(document).onDelay('scroll', function() {
		if (window.scrollY > 5) 
			$('header').css({ 'background-color': 'rgba(0, 0, 0, 0.5)' });
		else {
			$('header').css({ 'background-color': 'transparent' });
		}
	}, 100);

	$('.navbar-toggler').on('click', function() {
		$(this).hide().siblings().hide().siblings('.navbar-collapse').show();
		$('header .close-menu').show().on('click', function() {
			$(this).parents('nav').children().hide()
				.siblings('*:not(.navbar-collapse)').show().siblings('.close-menu').hide();

		});
	});

	$('button.btn-order').on('click', function() {
		$('#block-order').show(500).css({display: 'flex'});
		$('img.close-form').on('click', function() {
			$('#block-order').hide(500);
		});
	});

	$('button.btn-more').on('click', function() {
		$(this).fadeOut().siblings('*:not(img.close-more)').animate({ opacity: 0})
			.siblings('.stock-item-text__more').animate({ opacity: 1})
			.siblings('img.close-more').fadeIn();
	});
	$('img.close-more').on('click', function() {
		$(this).fadeOut().siblings('*:not(button)').animate({ opacity: 0})
			.siblings('button').fadeIn(1500).siblings('*:not(.stock-item-text__more)').animate({ opacity: 1});
	});

	window.setTimeout(function() {
		$('#stock-popup').addClass('showed');
		$('img.close-stock').on('click', function() {
			$('#stock-popup').removeClass('showed');
		});
	}, 15000);

/* YouTube */

	(function loadPlayer() {
		let tag = document.createElement('script');
		tag.src = "https://www.youtube.com/iframe_api";
		let firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		window.onYouTubePlayerAPIReady = function() {
			onYouTubePlayer();
		};
	})();

let player;

function onYouTubePlayer() {
	player = new YT.Player('player', {
		height: '810',
		width: '1440',
		videoId: 'k2XGBQkAz-E',
		playerVars: { 'showinfo': 0, 'rel': 0 },
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
}

	function onPlayerReady(event) {
		$(document).onDelay('scroll', function() {
			if (window.scrollY > blockHeights.heightTopPart) {
				event.target.playVideo();
				event.target.mute();
			}
		});
	}

	let done = false;
	function onPlayerStateChange(event) {
		if (event.data == YT.PlayerState.ENDED && !done) {
			window.setTimeout(player.playVideo(), 6000);
			done = true;
		}
	}

	/* form sending */

	$('form').submit((e) => {
		e.preventDefault();
		if (!error) {
			$.ajax({
				url: 'sendmail.php',
				type: 'POST',
				data: $('form').serialize(),
				success: function () {
					console.log('Запрос отправлен');
				},
				error: function () {
					console.log('Возникла ошибка при отправке');
				}
			});
			$('form input').hide();
			$('form h3').hide();
			$('form h2').text('СООБЩЕНИЕ ОТПРАВЛЕНО');
			$('form p.orCall').text('Мы свяжемся с вами для подтверждения бронирования');
		} else {
			$('input[name="name"]').addClass('error');
			$('input[name="tel"]').addClass('error');
			$('form p.message').css({ opacity: 1 });
		}
	});

	$('input').on('input', (e) => {
		validate(e, /^.+$/gi);
	});
	$('input[name="name"]').on('input', (e) => {
		validate(e, /^[ а-яё]+$/gi);
	});
	$('input[name="tel"]').on('input', (e) => {
		validate(e, /^((8|\+7)[- ]?)?(\(?\d{3}\)?[- ]?)?[\d- ]{7,10}$/);
	});

	let error = true;
	function validate(e, regExp) {
		if (!regExp.test(e.target.value.trim())) {
			$(e.target).addClass('error');
			$(e.target).removeClass('valid');
			if (!error) {
				error = true;
				$('form p.message').css({ opacity: 1 });
			}
		} else {
			if (error) {
				error = false;
				$('form p.message').css({ opacity: 0 });
			}
			$(e.target).removeClass('error');
			$(e.target).addClass('valid');
		}
	}

});