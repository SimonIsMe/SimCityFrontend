$(document).ready(function(){
    $('select').click(function() {
        Board.drawRoad = false;
        Board.drawArea = false;
        Board.drawPlaceForBuild = false;
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
        if ($(this).val() == "remove") {
            Board.areaType = 0;
        }
        if($(this).val() == "electricity") {
            Board.drawPlaceForBuild = true;
            Board.placeWeight = 2;
            Board.placeHeight = 2;
        }
    });
});