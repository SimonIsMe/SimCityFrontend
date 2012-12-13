<?php

    require '../Pusher.php';

    $key = 'a11a902c4f5c239e34bd';
    $secret = '924769f3f9d2e9e23bb3';
    $app_id = '33265';
    
    print_r($_GET);
        
    $pusher = new Pusher($key, $secret, $app_id);
    $pusher->trigger(
        'test_channel', 
        'buildEvent', 
            array(
                'type' => 0,
                'x' => (int) $_GET['x'],
                'y' => (int) $_GET['y'],
            )
         );