<?php

$_SESSION['id'] = 1;
define('ID', $_SESSION['id']);

$f = fopen('./status/' . ID . '.txt', 'w');

$width = 20;
$height = 20;

fwrite($f, $width . chr(10),  3);
fwrite($f, $height . chr(10),  3);

$count = 20 * 20;

//  mapa
$map = '';
for ($i = 0; $i < $count; $i++) {
    $map .= '0';
}
fwrite($f, $map . chr(10), $count + 1);

//  zanieczyszczenie
$pollution = '';
for ($i = 0; $i < $count; $i++) {
    $pollution .= '0';
}
fwrite($f, $pollution . chr(10), $count + 1);

//  popyt
$demand = '';
for ($i = 0; $i < $count; $i++) {
    $demand .= '0';
}
fwrite($f, $demand . chr(10), $count + 1);

//  budżet
$money = 100000;
fwrite($f, $money . chr(10), strlen($money) + 1);

//  budżet w przyszłości
$future = 100000;
fwrite($f, $future . chr(10), strlen($future) + 1);

//  popyt na strefę przemysłową
fwrite($f, '8' . chr(10), 2);

//  popyt na strefę komercyjną
fwrite($f, '8' . chr(10), 2);

//  popyt na strefę mieszkalną
fwrite($f, '8' . chr(10), 2);

//  podatki
fwrite($f, '9' . chr(10), 2);
fwrite($f, '9' . chr(10), 2);
fwrite($f, '9' . chr(10), 2);

//  liczba ludzi (mieszkańców lub miejsc pracy) w danym obszarze
for($i = 0; $i < $count; $i++) {
    fwrite($f, '0' . chr(10), 2);
}

fclose($f);



echo json_encode(array(
    'width' => $width, 
    'height' => $height,
    'map' => $map, 
    'pollution' => $pollution,
    'demand' => $demand,
    'money' => $money,
    'future' => $future,
    'demandI' => 8,
    'demandC' => 8,
    'demandR' => 8
));