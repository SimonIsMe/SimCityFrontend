Core = {
//    apiAddress: 'http://localhost/simcity/api/',
    apiAddress: 'http://localhost:3000/',
    imgAddress: 'http://localhost/simcity/img/',
    map: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    mapWidth: 20,
    mapHeight: 20,
    init: function() {
        Core.pusher();
        Core.map = new Array(Core.mapHeight * Core.mapWidth);
        for(i = 0; i < Core.mapHeight * Core.mapWidth; i++) {
            Core.map[i] = 0;
        }
    },
    pusher: function() {
        Pusher.log = function(message) {
            if (window.console && window.console.log) window.console.log(message);
        };

        // Flash fallback logging - don't include this in production
        WEB_SOCKET_DEBUG = true;

        var pusher = new Pusher('a11a902c4f5c239e34bd');
        var channel = pusher.subscribe('test_channel');
        channel.bind('buildEvent', function(data) {
            console.log(data);
            switch (data.type) {
                case 0:
                    Board.remove(data.x, data.y)
                    break;
                case 1:
                    Board.buildRoad(data);
                    break;
                case 2:
                case 3:
                case 4:
                    Board.buildArea(data, data.type)
                    break;
                case 5:
                    //  budynek
                    Board.buildBuilding(data.x, data.y, data.type);
                case 6:
                    //  pieniążki
                    Money.current = data.current;
                    Money.forecast = data.forecast;
                    Money.onUpdate();
                    break;
            }
            
//            console.log(data);
        });
    },
    send: function(uri, data, callbackSuccess) {
        
        if (callbackSuccess == undefined) {
            callbackSuccess = function(data) {}
        }
        
        $.ajax({
            url: Core.apiAddress + uri,
            data: data,
            dataType: 'text',
            success: callbackSuccess,
            error: function(data) {
//                Core.onErrorConnection();
            }
        });
    },
    onErrorConnection: function() {
        console.log("Błąd połączenia z serwerem");
        $('#lock').show();
        $('#lockStatement').text("Błąd połączenia z serwerem");
        $('#lockStatement').show();
    },
    unlockScreen: function() {
        $('#lock').hide();
        $('#lockStatement').hide();
    }
}


$(document).ready(function(){
    Core.init();
    Board.init();
    Money.init();
});