/* global YT */
import 'html5shiv';
import 'jquery';
import './delayEvent.jquery';
import 'bootstrap/js/dist/carousel.js';
import 'bootstrap/js/dist/collapse.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/style.sass';

$(document).ready(function() {
	'use strict';

	$('.navbar a:not(.phone)').on('click', (e) => {
		e.preventDefault();
		let target = e.currentTarget.getAttribute('href');
		if (target.includes('#')) {
			let crtOffset = window.pageYOffset;
			let trgOffset = $(target).offset().top;
			let t = Math.abs(crtOffset - trgOffset)/5;
			$('html, body').animate({ scrollTop: trgOffset-(trgOffset/20) }, t, 'linear');
		}
	});

	$(document).onDelay('scroll', function() {
		if (window.pageYOffset > 5)
			$('header').css({ 'background-color': 'rgba(0, 0, 0, 0.5)' });
		else {
			$('header').css({ 'background-color': 'transparent' });
		}
	});

	$('.navbar-toggler').on('click', function() {
		$(this).hide().siblings().hide().siblings('.navbar-collapse').show();
		$('body').css( {overflow: 'hidden'} );
		$('header .close-menu').show().on('click', function() {
			$('body').css( {overflow: 'auto'} );
			$(this).parents('nav').children().hide()
				.siblings('*:not(.navbar-collapse)').show().siblings('.close-menu').hide();
		});
	});

	$('button.btn-order').on('click', function() {
		$('body').css( {overflow: 'hidden'} );
		$('#block-order').show(500).css({display: 'flex'});
		$('img.close-form').on('click', function() {
			$('body').css( {overflow: 'auto'} );
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
			.siblings('button').fadeIn(1500)
			.siblings('*:not(.stock-item-text__more)').animate({ opacity: 1});
	});

	window.setTimeout(function() {
		$('#stock-popup').addClass('showed');
		$('img.close-stock').on('click', function() {
			$('#stock-popup').removeClass('showed');
		});
	}, 15000);

/* YouTube */

	function checkLoadPlayer() {
		if ( window.innerWidth > 767 && 
			$('script').attr('src') !== "https://www.youtube.com/iframe_api") 
				loadPlayer();
	}

	checkLoadPlayer();
	$(window).on('resize', () => checkLoadPlayer());

	function loadPlayer() {
		let tag = document.createElement('script');
		tag.src = "https://www.youtube.com/iframe_api";
		let firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		window.onYouTubePlayerAPIReady = function() {
			onYouTubePlayer();
		};
	}

let player;

function onYouTubePlayer() {
	player = new YT.Player('player', {
		height: '810',
		width: '1440',
		videoId: 'zoDmuAsPxfE',
		playerVars: { 'showinfo': 0, 'rel': 0 },
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
}

	function onPlayerReady(event) {
		$(window).on('scroll', function() {
			if (window.pageYOffset > 1000 && window.pageYOffset < 2000) {
				event.target.playVideo();
				event.target.mute();
			}	else if (window.pageYOffset > 2000) {
				$(window).off('scroll');
			}
		});
	}

	function onPlayerStateChange(event) {
		if (event.data === YT.PlayerState.ENDED) {
			window.setTimeout(player.playVideo(), 36000);
		} else if (event.data === YT.PlayerState.PAUSED ||
			event.data === YT.PlayerState.PLAYING) {
				$(window).off('scroll');
		}
	}

	/* form sending */

	const inputsList = {
		name: {
			pattern: /^[ а-яё]{2,}$/gi,
			valid: false
		},
		tel: {
			pattern: /^((8|\+7)[- ]?)?(\(?\d{3}\)?[- ]?)?[\d- ]{7,10}$/,
			valid: false
		}
	};

	(function() {
		for (let elem in inputsList) {
			$('input[name="' + elem + '"]').on('input', () => runValidate([elem]));
		}
	})();

	function runValidate(inputName) {
		inputName.forEach((inputName) => {
			let pattern = inputsList[inputName].pattern;
			let $target = $('input[name="' + inputName + '"]');
			let value = $target.val().trim();
			inputsList[inputName].valid = pattern.test(value);
			let error = !inputsList[inputName].valid;
			showError($target, error);
		});
	}

	function showError($target, error) {
		if ( error ) {
			$target.addClass('error');
			$target.removeClass('valid');
			$('form p.message').css({ opacity: 1 });
		} else {
			$target.removeClass('error');
			$target.addClass('valid');
			$('form p.message').css({ opacity: 0 });
		}
	}

	$('form').submit((e) => {
		e.preventDefault();
		let inputCnt = 0, validCnt = 0;
		for ( let elem in inputsList) {
			inputCnt ++;
			validCnt += (inputsList[elem].valid ? 1 : 0);
		}
		if ( validCnt === inputCnt ) {
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
			runValidate(['name', 'tel']);
		}
	});

});