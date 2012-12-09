$(document).ready(function(){
    $('select').click(function() {
        Board.drawRoad = false;
        Board.drawArea = false;
        Board.areaType = 2;
        if ($(this).val() == "road") {
            Board.drawRoad = true;
        }
        if ($(this).val() == "area2") {
            Board.drawArea = true;
            Board.areaType = 2;
        }
        if ($(this).val() == "area3") {
            Board.drawArea = true;
            Board.areaType = 3;
        }
        if ($(this).val() == "area4") {
            Board.drawArea = true;
            Board.areaType = 4;
        }
    });
});