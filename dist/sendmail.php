<?php header("Content-type: text/html; charset=utf-8");
	print_r($_POST);
	if(isset($_POST)) {
		$from = htmlspecialchars("plitarest.ru");
		$to = htmlspecialchars("Plita.rest@ya.ru");
		$subject = htmlspecialchars("Заявка с сайта plitarest.ru");
		$message = htmlspecialchars(
			"ИМЯ: ".$_POST["name"].
			"\r\nТЕЛЕФОН: ".$_POST["tel"].
			"\r\nДАТА И ВРЕМЯ: ".$_POST["date"].
			"\r\nКОЛЛИЧЕСТВО ПЕРСОН: ".$_POST["count"].
			"\r\nПОЖЕЛАНИЯ ПО СТОЛУ: ".$_POST["wish"]);
		$subject = "=?utf-8?B?".base64_encode($subject)."?=";
		$headers = "From: $from\r\nReply-to: $from\r\nContent-type: text/plain; charset=utf-8\r\n";
		if (strlen($message) > 3) {
			mail($to, $subject, $message, $headers);
			echo('Заявка отправлена!');
		} else {
			echo('Ошибка отправки: сообщение пустое!');
		}
	}
?>