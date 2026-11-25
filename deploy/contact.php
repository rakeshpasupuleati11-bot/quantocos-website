<?php
// Contact endpoint for quantocos.com. Drop in /public_html/api/contact.php on Hostinger,
// then point the form's action at /api/contact.php and delete the formsubmit.co attributes.
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['ok'=>false]); exit; }
$get = fn($k) => trim((string)($_POST[$k] ?? ''));
if (!empty($_POST['website'])) { echo json_encode(['ok'=>true]); exit; }        // honeypot
$name = $get('Full name'); $org = $get('Organization'); $email = filter_var($get('Work email'), FILTER_VALIDATE_EMAIL);
$msg  = $get('Message'); $country = $get('Country');
if (!$name || !$org || !$email || empty($_POST['Consent'])) { http_response_code(422); echo json_encode(['ok'=>false,'error'=>'missing']); exit; }
$body = "Name: $name\nCompany: $org\nEmail: $email\nCountry: $country\n\n$msg\n";
$headers = "From: website@quantocos.com\r\nReply-To: $email\r\nContent-Type: text/plain; charset=UTF-8\r\n";
$ok = mail('hello@quantocos.com', 'Pod briefing enquiry - quantocos.com', $body, $headers);
http_response_code($ok ? 200 : 500);
echo json_encode(['ok' => (bool)$ok]);
