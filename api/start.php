<?php

$_SESSION['id'] = 1;

require './map.php';
$game = new Game();

echo json_encode(array(
    'width' => $game->width, 
    'height' => $game->height,
    'map' => $game->map, 
    'pollution' => $game->pollution,
    'demand' => $game->demand,
    'money' => $game->money,
    'future' => $game->future,
    'demandI' => $game->demandI,
    'demandC' => $game->demandC,
    'demandR' => $game->demandR,
    'taxI' => $game->taxI,
    'taxC' => $game->taxC,
    'taxR' => $game->taxR,
    'population' => $game->population
));