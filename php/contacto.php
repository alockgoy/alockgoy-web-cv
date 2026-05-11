<?php
header('Content-Type: application/json; charset=UTF-8');
require '../vendor/autoload.php';
require 'config.php';
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
    exit;
}

$name    = isset($_POST['name'])    ? mb_convert_encoding(trim($_POST['name']),    'UTF-8', 'UTF-8') : '';
$email   = isset($_POST['email'])   ? trim($_POST['email'])                                          : '';
$subject = isset($_POST['subject']) ? mb_convert_encoding(trim($_POST['subject']), 'UTF-8', 'UTF-8') : '';
$message = isset($_POST['message']) ? mb_convert_encoding(trim($_POST['message']), 'UTF-8', 'UTF-8') : '';

if ($name === '' || $email === '' || $subject === '' || $message === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Completa todos los campos del formulario.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'El email no es válido.']);
    exit;
}

$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host       = MAIL_HOST;
    $mail->SMTPAuth   = true;
    $mail->Username   = MAIL_USERNAME;
    $mail->Password   = MAIL_PASSWORD;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = MAIL_PORT;
    $mail->CharSet    = 'UTF-8';
    $mail->Encoding   = 'base64'; 
    $mail->setFrom(MAIL_USERNAME, 'Web CV');
    $mail->addAddress(MAIL_TO);
    $mail->addReplyTo($email, $name);
    $mail->isHTML(false);
    $mail->Subject = 'Contacto CV: ' . $subject;
    $mail->Body    = "Nombre: $name\nEmail: $email\n\nMensaje:\n$message";
    $mail->send();
    echo json_encode(['success' => true, 'message' => 'Correo enviado correctamente.']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al enviar el correo: ' . $mail->ErrorInfo]);
}