<?php

    require '../Pusher.php';

    $key = 'a11a902c4f5c239e34bd';
    $secret = '924769f3f9d2e9e23bb3';
    $app_id = '33265';
    
    print_r($_GET);
    
    $width = abs($_GET['x_from'] - $_GET['x_to']);
    $height = abs($_GET['y_from'] - $_GET['y_to']);
    
    $x_from = (int) $_GET['x_from'];
    $y_from = (int) $_GET['y_from'];
    $x_to = (int) $_GET['x_to'];
    $y_to = (int) $_GET['y_to'];
    
    if ($x_from > $x_to) {
        $buffor = $x_from;
        $x_from = $x_to;
        $x_to = $buffor;
    }
    if ($y_from > $y_to) {
        $buffor = $y_from;
        $y_from = $y_to;
        $y_to = $buffor;
    }
    
    $position_x = array();
    $position_y = array();
    
    for ($y = $y_from; $y <= $y_to; $y++) {
        for ($x = $x_from; $x <= $x_to; $x++) {
            $position_x[] = $x;
            $position_y[] = $y;
//            Board.elem.children('div#' + y + '-' + x + '').addClass('betaArea');
        }
    }
//
//    if ($width > $height) {
//        //  leży
//        for ($x = $x_tmp_from; $x <= $x_tmp_to; $x++) {
////                Board.elem.children('div#' + $y_from + '-' + $x).addClass('betaRoad');
//            $position_x[] = $x;
//            $position_y[] = $y_from;
//        }
//        for ($y = $y_tmp_from; $y <= $y_tmp_to; $y++) {
////                Board.elem.children('div#' + y + '-' + x_to).addClass('betaRoad');
//            $position_x[] = $x_to;
//            $position_y[] = $y;
//        }
//    } else if ($width <= $height) {
//        //  stoi lub kwadrat
//        for ($x = $x_tmp_to; $x >= $x_tmp_from; $x--) {
////                Board.elem.children('div#' + y_to + '-' + x).addClass('betaRoad');
//            $position_x[] = $x;
//            $position_y[] = $y_to;
//        }
//        for ($y = $y_tmp_to; $y >= $y_tmp_from; $y--) {
////                Board.elem.children('div#' + y + '-' + x_from).addClass('betaRoad');
//            $position_x[] = $x_from;
//            $position_y[] = $y;
//        }
//    }
    
    var_dump($position_x);
    var_dump($position_y);
    
        
    $pusher = new Pusher($key, $secret, $app_id);
    $pusher->trigger(
        'test_channel', 
        'buildEvent', 
            array(
                'type' => (int) $_GET['type'],
                'position_x' => $position_x,
                'position_y' => $position_y
            )
         );