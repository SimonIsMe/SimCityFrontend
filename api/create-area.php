<?php

    require './map.php';
    
    $game = new Game();
    $game->buildArea(
            $_GET['x_from'], 
            $_GET['y_from'], 
            $_GET['x_to'], 
            $_GET['y_to'], 
            $_GET['type']);
    
    echo json_encode(array(
       'money' => $game->money,
       'future' => $game->future
    ));
