<?php

require './map.php';

$game = new Game();
$game->taxC = $_GET['taxC'];
$game->taxR = $_GET['taxR'];
$game->taxI = $_GET['taxI'];

$game->save();