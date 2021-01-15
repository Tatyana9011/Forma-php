<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exportion;

require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';  // подключаем папки со скаченного РНРфайла

$mail=new PHPMailer(true); //обьявляем PHPMailer
$mail->CharSet = 'UTF-8'; //настройка кодировки  указывается обязательно иначе будут каракули
$mail->setLanguage('ru','phpmailer/language/'); //подключаем языковой файл
$mail->IsHTML(true); //включается возможность включения использования тегов в письме обязательно

// от кого письмо
$mail->setFrom('tanya.kamyshnikova@gmail.com','Фрилансер по жизни')
//кому направить
$mail->addAddress('tanya.kamyshnikova@gmail.com') //можно указать несколько адриссатов
//тема письма
$mail->Subject='Привет это тест отправки формы'

//начинаем - обработчик формы
$hand="Правая";
if($_POST['hand']=="left"){
    $hand = 'Левая';
}

//тело письма
$body='<h1>Встречаем письмо!</h1>';

if(trim(!empty($_POST['name']))){  //простейшие проверки несмотря на скрипт если поле непустое что бы было точно все ок
    $body='<p><strong>Имя:</strong>'.$_POST['name'].'</p>';
}
if(trim(!empty($_POST['email']))){
    $body='<p><strong>E-mail:</strong>'.$_POST['email'].'</p>';
}
if(trim(!empty($_POST['hand']))){
    $body='<p><strong>Рука:</strong>'.$hand['hand'].'</p>'; //я это уже получила выше
}
if(trim(!empty($_POST['age']))){
    $body='<p><strong>Возраст:</strong>'.$_POST['age'].'</p>'; //я это уже получила выше
}
if(trim(!empty($_POST['message']))){
    $body='<p><strong>Сообщения:</strong>'.$_POST['message'].'</p>'; //я это уже получила выше
}

//прикрепляем файл
if(!empty($_FILES['image']['tmp-name'])){
    $filePath = __DIR__."/files/".$_FILES['image']['name'];  //гдето нужно собирать копируем файл кудато себе на сервер
    if(copy($_FILES['image']['tmp-name'],$filePath)){
        $fileAttach=$filePath;
        $body='<p><strong>Фото в приложении:</strong>'; // если все удалось то в тело письма добавляем текст
        $mail->addAttachment($fileAttach);  //потом в плагин добавляю файл
    }
}

$mail->Body = $body;
//обработчик отправки
if(!$mail->send()){  //если форма не отправилась по какойто причине то выводим ошибку
    $message = 'Ошибка';
}else{
    $message = 'Данные отправлены';    // если отправилось то сообщение об отправке
}

$response = ['message'=>$message];   // формируем из этого джейсон

header('content-type:application/json');   //и заголовком джейсон возвращаем наш джаваскрипт
echo json_encode($response);
?>







