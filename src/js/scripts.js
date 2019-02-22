import 'jquery';
import './delayEvent.jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/style.sass';

$(document).ready(function() {
	
	var blockHeights = {
		heightTopPart: 0,
		heightAboutBlock: 0,
		heightMiddlePart: 0,
		heightBottomPart: 0,
		offset: 100,
		calcBlockHeight() {
			this.heightTopPart = parseInt($('header').css('height'), 10) +
											parseInt($('#header-carousel').css('height'), 10) -
											this.offset;
			this.heightAboutBlock = parseInt($('#block-about').css('height'), 10) -
											this.offset;
			this.heightMiddlePart = parseInt($('#block-menu').css('height'), 10) +
											parseInt($('#block-video').css('height'), 10) -
											this.offset;
			this.heightBottomPart = parseInt($('#block-stock').css('height'), 10) +
											parseInt($('#block-photoes').css('height'), 10) -
											this.offset;
		}
	};

	blockHeights.calcBlockHeight();

	$(window).resize(() => blockHeights.calcBlockHeight());

	$('.navbar-nav a').on('click', (e) => {
		e.preventDefault();
		switch (e.target.id) {
			case 'menu-about':
				$('html').animate({ scrollTop: blockHeights.heightTopPart });
				window.location = '#block-about';
			break;
			case 'menu-menu':
				$('html').animate({ scrollTop: blockHeights.heightTopPart +
																				blockHeights.heightAboutBlock +
																				200});
				window.location = '#block-menu';
			break;
			case 'menu-stock':
				$('html').animate({ scrollTop: blockHeights.heightTopPart +
																				blockHeights.heightAboutBlock +
																				blockHeights.heightMiddlePart +
																				200});
				window.location = '#block-stock';
			break;
			case 'menu-contacts':
				$('html').animate({ scrollTop: blockHeights.heightTopPart +
																				blockHeights.heightAboutBlock +
																				blockHeights.heightMiddlePart +
																				blockHeights.heightBottomPart +
																				200});
				window.location = '#block-contacts';
			break;
		}
	});

	$(document).onDelay('scroll', () => {
		if (window.scrollY > 5) 
			$('header').css({ 'background-color': 'rgba(0, 0, 0, 0.3)' });
		else {
			$('header').css({ 'background-color': 'transparent' });
		}
	}, 100);

	$('button.btn-order').on('click', () => {
		$('form').animate({top: 100});
		$('form img').on('click', () => {
			$('form').animate({top: -700});
		});
	});

	$('form').submit((e) => {
		e.preventDefault();
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
		$('form').fadeOut();
		window.setTimeout(() => {
			$('form').html('<h2>Отправлено!</h2><p>Я с Вами обязательно свяжусь</p>');
			$('form').fadeIn();
		}, 500);
	});

	$('input[name="name"]').on('input', (e) => {
		validate(e, /^[ а-яё]+$/gi);
	});
	$('input[name="tel"]').on('input', (e) => {
		validate(e, /^((8|\+7)[- ]?)?(\(?\d{3}\)?[- ]?)?[\d- ]{7,10}$/);
	});
	$('input[name="email"]').on('input', (e) => {
		validate(e, /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/);
	});

	function validate(e, regExp) {
		if (!regExp.test(e.target.value.trim())) {
			$(e.target).addClass('error');
		} else {
			$(e.target).removeClass('error');
		}
	}

});