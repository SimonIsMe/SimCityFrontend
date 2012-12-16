<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>SimCity OnLine</title>
        <script src="http://js.pusher.com/1.12/pusher.min.js" type="text/javascript"></script>
        <script src="jquery-1.8.0.js"></script>
        <script src="ui/jquery.ui.core.js"></script>
	<script src="ui/jquery.ui.widget.js"></script>
	<script src="ui/jquery.ui.mouse.js"></script>
	<script src="ui/jquery.ui.draggable.js"></script>
        <script src="api.js"></script>
        <script src="core.js"></script>
        <script src="board.js"></script>
        <script src="gui.js"></script>
        <script src="money.js"></script>
        <link rel="Stylesheet" type="text/css" href="style.css" />
    </head>
    <body>
        <div id="lockStatement"></div>
        <div id="lock"></div>
        <div id="board">
            <div id="inBoard" style="width:<?php echo 20*20 ?>px">
                <?php
                    for($k = 0; $k < 20; $k++) {
                        for($w=0; $w < 20; $w++){
                            echo '<div id="' . $k . '-' . $w . '"></div>';
                        }
                    }
                ?>
            </div>
        </div>
        <sidebar>
            <button id="plus">+</button>
            <button id="minus">-</button>
            <select>
                <option value="road">Droga</option>
                <option value="area2">Strefa mieszkalna</option>
                <option value="area3">Strefa komercyjna</option>
                <option value="area4">Strefa przemysłowa</option>
                <option value="remove">Buldożer</option>
                <option value="electricity">Elektrownia</option>
            </select>
            <div id="money">
                Obecnie: <span id="money_current">100$</span><br />
                Prognoza: <span id="forecast">100$</span>
            </div>
        </sidebar>
    </body>
</html>
    