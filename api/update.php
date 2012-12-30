<?php

require './map.php';

$game = new Game();
$game->update();

echo json_encode(array(
    'map' => $game->map, 
    'pollution' => $game->pollution,
    'demand' => $game->demand,
    'money' => $game->money,
    'future' => $game->future,
    'demandI' => $game->demandI,
    'demandC' => $game->demandC,
    'demandR' => $game->demandR,
    'population' => $game->population,
));