<?php

    require './map.php';
    
    $game = new Game();
    $canBuild = $game->buildRoad(
            $_GET['x_from'], 
            $_GET['y_from'], 
            $_GET['x_to'], 
            $_GET['y_to']);
   
   echo json_encode(array(
       'ok' => $canBuild,
       'money' => $game->money,
       'future' => $game->future
   ));

    
//    $pusher->trigger(
//        'test_channel', 
//        'buildEvent', 
//            array(
//                'type' => 6,
//                'current' => 123,
//                'forecast' => 1234
//            )
//         );