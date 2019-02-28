/* global YT */
import 'jquery';
import 'html5shiv';
import './delayEvent.jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/style.sass';

$(document).ready(function() {

	$('.navbar-nav a').on('click', (e) => {
		e.preventDefault();
		let target = e.target.getAttribute('href');
		$('html, body').animate({ scrollTop: $(target).offset().top - 200 });
		window.location = target;
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
			if (window.scrollY > 1000) {
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

	const validInputs = {
		name: {
			valid: true
		},
		tel: {
			valid: true 
		}
	};

	$('form').submit((e) => {
		e.preventDefault();
		let inputCnt = 0, validCnt = 0;
		for ( let elem in validInputs) {
			inputCnt += (validInputs[elem] ? 1 : 0);
			validCnt += (validInputs[elem].valid ? 1 : 0);
			console.log(elem, validInputs[elem].valid, validCnt, inputCnt);
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
			callValidate();
		}
	});

	(function callValidate() {
		$('input').on('input', (e) => {
			validate(e, /^.+$/gi);
		});
		$('input[name="name"]').on('input', (e) => {
			validInputs.name.valid = validate(e, /^[ а-яё]+$/gi);
			console.log(validInputs);
		});
		$('input[name="tel"]').on('input', (e) => {
			validInputs.tel.valid = validate(e, /^((8|\+7)[- ]?)?(\(?\d{3}\)?[- ]?)?[\d- ]{7,10}$/);
			console.log(validInputs);
		});
	})();

	function validate(e, pattern) {
		let error = true;
		if (!pattern.test(e.target.value.trim())) {
			$(e.target).addClass('error');
			$(e.target).removeClass('valid');
			if (!error) {
				error = true;
				$('form p.message').css({ opacity: 1 });
			}
		} else {
			$(e.target).removeClass('error');
			$(e.target).addClass('valid');
			if (error) {
				error = false;
				$('form p.message').css({ opacity: 0 });
			}
		}
		return !error;
	}

});