import 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/style.sass';

$(document).ready(function() {
	
	var blockHeights = {
		heightTopPart: 0,
		heightMiddlePart: 0,
		heightPortfolioBlock: 0,
		calcBlockHeight() {
			this.heightTopPart = parseInt($('header').css('height'), 10) +
											parseInt($('#main').css('height'), 10);
			this.heightMiddlePart = parseInt($('#about').css('height'), 10) +
											parseInt($('#skills').css('height'), 10);
			this.heightPortfolioBlock = parseInt($('#portfolio').css('height'), 10);
		}
	};

	blockHeights.calcBlockHeight();

	$(window).resize(() => blockHeights.calcBlockHeight());

	$('.navbar-nav a').on('click', (e) => {
		e.preventDefault();
		switch (e.target.id) {
			case 'menu-about':
				$('html').animate({ scrollTop: blockHeights.heightTopPart });
				window.location = '#about';
			break;
			case 'menu-portfolio':
				$('html').animate({ scrollTop: blockHeights.heightTopPart +
																				blockHeights.heightMiddlePart +
																				200});
				window.location = '#portfolio';
			break;
			case 'menu-contacts':
				$('html').animate({ scrollTop: blockHeights.heightTopPart +
																				blockHeights.heightMiddlePart +
																				blockHeights.heightPortfolioBlock +
																				200});
				window.location = '#order';
			break;
		}
	});

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