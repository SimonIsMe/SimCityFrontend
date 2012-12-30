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
            <div id="inBoard" class="inBoard" style="width:<?php echo 20*20 ?>px">
                <?php
                    for($k = 0; $k < 20; $k++) {
                        for($w=0; $w < 20; $w++){
                            echo '<div id="' . $k . '-' . $w . '"></div>';
                        }
                    }
                ?>
            </div>
            <div id="demand" class="inBoard" style="width:<?php echo 20*20 ?>px; margin-left:-400px;">
                <?php
                    for($k = 0; $k < 20; $k++) {
                        for($w=0; $w < 20; $w++){
                            echo '<div id="' . $k . '-' . $w . '" class="demand_0"></div>';
                        }
                    }
                ?>
            </div>
            <div id="pollution" class="inBoard" style="width:<?php echo 20*20 ?>px; margin-left:-400px;">
                <?php
                    for($k = 0; $k < 20; $k++) {
                        for($w=0; $w < 20; $w++){
                            echo '<div id="' . $k . '-' . $w . '"  class="pollution_0"></div>';
                        }
                    }
                ?>
            </div>
        </div>
        <sidebar>
            <button id="plus">+</button>
            <button id="minus">-</button>
            <select name="action">
                <option value="road">Droga</option>
                <option value="area2">Strefa mieszkalna</option>
                <option value="area3">Strefa komercyjna</option>
                <option value="area4">Strefa przemysłowa</option>
                <option value="remove">Buldożer</option>
                <option value="electricity">Elektrownia</option>
            </select>
            <select name="filtres">
                <option value=""> - filtry - </option>
                <option value="pollution">Zanieczyszczenie</option>
                <option value="demand">Popyt</option>
            </select>
            <div id="money">
                Obecnie: <span id="money_current">100$</span><br />
                Prognoza: <span id="forecast">100$</span>
            </div>
            
            <div id="demand-graph">
                <hr />
                <div id="industry" class="graph"></div>
                <div id="commercial" class="graph"></div>
                <div id="residental" class="graph"></div>
            </div>
            
            <ul id="taxes">
                <li>Str. mieszkalna <input type="number" name="taxR" min="0" step="0.1"></li>
                <li>Str. komercjna <input type="number" name="taxC" min="0" step="0.1"></li>
                <li>Str. przemysłowa <input type="number" name="taxI" min="0" step="0.1"></li>
            </ul>
        </sidebar>
    </body>
</html>
    