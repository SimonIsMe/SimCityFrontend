Core = {
    apiAddress: Address.api,
    imgAddress: Address.img,
    map: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    pollution: [],
    demand: [],
    population: [],
    demandI: 0,
    demandC: 0,
    demandR: 0,
    taxI: 0,
    taxC: 0,
    taxR: 0,
    mapWidth: 20,
    mapHeight: 20,
    init: function() {
        Core.pusher();
        Core.map = new Array(Core.mapHeight * Core.mapWidth);
        for(i = 0; i < Core.mapHeight * Core.mapWidth; i++) {
            Core.map[i] = 0;
        }
        Core.start();
        setInterval("Core.update()", 30000);
    },
    start: function() {
        Core.send('start', {}, function (data) {
            Core.mapWidth = data.width;
            Core.mapHeight = data.height;
            
            Core.map = data.map;
            Core.pollution = data.pollution;
            Core.demand = data.demand;
            Core.population = data.population;
            Board.generateMap();
            Board.generatePollutionMap();
            Board.generateDemandMap();
            
            Core.demandI = data.demandI;
            Core.demandC = data.demandC;
            Core.demandR = data.demandR;
            
            Core.taxI = data.taxI;
            Core.taxC = data.taxC;
            Core.taxR = data.taxR;
            
            Core.updateDemandGraph();
            Core.updateTaxes();
            
            Money.forecast = data.future;
            Money.current = data.money;
            Money.update();
        })
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
                    //  usuwanie
                    Board.remove(data.x, data.y)
                    break;
                case 1:
                    //  droga
                    Board.buildRoad(data);
                    break;
                case 2:
                case 3:
                case 4:
                    //  obszary
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
        });
    },
    updateTaxes: function() {
        $('input[name="taxI"]').val(Core.taxI);
        $('input[name="taxR"]').val(Core.taxR);
        $('input[name="taxC"]').val(Core.taxC);
    },
    changeTax: function() {
        Core.taxI = $('input[name="taxI"]').val();
        Core.taxR = $('input[name="taxR"]').val();
        Core.taxC = $('input[name="taxC"]').val();
        Core.send('tax', {
            'taxI': Core.taxI,
            'taxC': Core.taxC,
            'taxR': Core.taxR
        }, function () {
            
        })
    },
    update: function() {
        Core.send('update', {}, function(data){
            Core.pollution = data.pollution;
            Board.generatePollutionMap();

            Core.demand = data.demand;
            Board.generateDemandMap();
            
            Core.population = data.population;
            Core.demandI = data.demandI;
            Core.demandC = data.demandC;
            Core.demandR = data.demandR;
            Board.generateMap();
            Core.updateDemandGraph();
            
            Money.current = data.money;
            Money.forecast = data.future;
            Money.update();
        });
    },
    updateDemandGraph: function() {
        $('#industry').css('height', (Core.demandI + 10) * 5);
        $('#industry').css('marginTop', 100 - (Core.demandI + 10) * 5);
        
        $('#commercial').css('height', (Core.demandC + 10) * 5);
        $('#commercial').css('marginTop', 100 - (Core.demandC + 10) * 5);
        
        $('#residental').css('height', (Core.demandR + 10) * 5);
        $('#residental').css('marginTop', 100 - (Core.demandR + 10) * 5);
    },
    send: function(uri, data, callbackSuccess) {
        
        if (callbackSuccess == undefined) {
            callbackSuccess = function(data) {}
        }
        
        $.ajax({
            url: Core.apiAddress + uri,
            data: data,
            dataType: 'json',
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