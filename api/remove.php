<?php

    require './map.php';
    
    $game = new Game();
    $game->remove($_GET['x'], $_GET['y']);
    