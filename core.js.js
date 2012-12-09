Core = {
    apiAddress: 'http://localhost/simcity/api/',
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
            switch (data.type) {
                case 1: 
                    Board.buildRoad(data)
                    break;
                case 2:
                case 3:
                case 4:
                    Board.buildArea(data, data.type)
                    break;
            }
            
            console.log(data);
        });
    },
    send: function(uri, data) {
        $.ajax({
            url: Core.apiAddress + uri,
            data: data,
            success: function(data) {
//                console.log(data);
            },
            error: function(data) {
                Core.onErrorConnection();
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
    
    money = new Money();
    money.pending();
});