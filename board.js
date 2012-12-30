Board = {
    elemId: 'inBoard',
    pollutionId: 'pollution',
    demandId: 'demand',
    pollution: null, 
    demand: null,
    elem: null,
    cursorIsAboveTheBoard: false,
    drawRoad: true,
    drawArea: false,
    areaType: 2,
    drawPlaceForBuild: false,
    placeWidth: 2,
    placeHeight: 3,
    init: function () {
        $("body").keypress(function(key){
            switch(key.charCode){
                case 119:Board.moveTop();
                        break;
                case 115:Board.moveDown();
                        break;
                case 100:Board.moveRight();
                        break;
                case 97:Board.moveLeft();
                        break;
            }
        })
        Board.elem = $('#' + Board.elemId);
        Board.pollution = $('#' + Board.pollutionId);
        Board.demand = $('#' + Board.demandId);
        
        Board.elem.hover(function() {
            Board.cursorIsAboveTheBoard = true;
        }, function() {
            Board.cursorIsAboveTheBoard = false;
            Board.elem.children('.hover').removeClass('hover');
            Board.elem.children('.hoverError').removeClass('hoverError');
        });
        
        Board.generateMap();
        Board.hover();
        Board.selectFromTo();
    },
    remove: function(x, y) {
        console.log('buldożer');
        console.log(x, y);
        key = x + Core.mapWidth * y;
        console.log(key)
        Core.map[key] = 0;
        Board.generateMap();
        Core.send('remove', {
            'x': x,
            'y': y
        }, function(){
            
        });
    },
    generateMap: function() {
        i = 0;
        for (y = 0; y < Core.mapHeight; y++) {
            for (x = 0; x < Core.mapWidth; x++) {
                if (Core.length <= i) {
                    break;
                }
                switch(Core.map[i]) {
                    case 0:
                        Board.elem.children('div#' + y + '-' + x).attr('class', '');
                        Board.elem.children('div#' + y + '-' + x).css('backgroundImage', 'none');
                        Board.elem.children('div#' + y + '-' + x).attr('backgroundColor', '#99CB7E');
                        break;
                    case 1:
                        Board.generateRoad(x, y);
                        break;
                    case 2:Board.elem.children('div#' + y + '-' + x).addClass('residentalArea');
                        Board.elem.children('div#' + y + '-' + x).addClass('r' + Core.population[i]);
                        break;
                    case 3:Board.elem.children('div#' + y + '-' + x).addClass('commercialArea');
                        Board.elem.children('div#' + y + '-' + x).addClass('c' + Core.population[i]);
                        break;
                    case 4:Board.elem.children('div#' + y + '-' + x).addClass('industrialArea');
                        Board.elem.children('div#' + y + '-' + x).addClass('i' + Core.population[i]);
                        break;
                }
                i++;
            }
        }
    },
    generatePollutionMap: function () {
        i = 0;
        for (y = 0; y < Core.mapHeight; y++) {
            for (x = 0; x < Core.mapWidth; x++) {
               Board.pollution.children('div#' + y + '-' + x).attr('class', 'pollution_' + Core.pollution[i++]);
            }
        }
    },
    generateDemandMap: function () {
        i = 0;
        for (y = 0; y < Core.mapHeight; y++) {
            for (x = 0; x < Core.mapWidth; x++) {
               Board.demand.children('div#' + y + '-' + x).attr('class', 'demand_' + Core.demand[i++]);
            }
        }
    },
    generateRoad: function(x, y) {
        x++;
        y++;
        position = x + Core.mapWidth * (y - 1) - 1;
        neighbor = new Array(4);
        neighbor[0] = x - 1 + Core.mapWidth * (y - 2);
        neighbor[1] = position - 1;
        neighbor[2] = position + 1;
        neighbor[3] = x + 1 + Core.mapWidth * y - 2;
        
        name = '';
        a = '';
        for (q = 0; q < 4; q++) {
            if(neighbor[q] >= 0 && 
                neighbor[q] < Core.mapHeight * Core.mapWidth) {
                a = a + neighbor[q] + '-';
                if (Core.map[neighbor[q]] == 1) {
                    name += '1';
                } else {
                    name += '0';
                }
                
            } else {
                name += '0';
            }
        }
        
        Board.elem.children('div#' + (y-1) + '-' + (x-1)).css('backgroundImage', "url('" + Core.imgAddress + name + ".png')");
    },
    moveTop: function() {
        marginTop = eval($('#inBoard').css('top').replace('px', ''));
        
        if(marginTop < 0) {
            $('#inBoard').css('top', (marginTop + 3) + "px");
        }
    },
    moveDown: function() {
        marginTop = eval($('#inBoard').css('top').replace('px', ''));
        tableHeight = eval($('#inBoard').css('height').replace('px', ''));
        boardHeight = eval($('#board').css('height').replace('px', ''));

        if (tableHeight + marginTop > boardHeight) {
            //  można przesuwać
            $('#inBoard').css('top', (marginTop - 3) + "px")
        }
    },
    moveLeft: function() {
        marginLeft = eval($('#inBoard').css('left').replace('px', ''));
        console.log(marginLeft);
        if(marginLeft < 0) {
            $('#inBoard').css('left', (marginLeft + 3) + "px");
        }
    },
    moveRight: function() {
        marginLeft = eval($('#inBoard').css('left').replace('px', ''));
        tableWidth = eval($('#inBoard').css('width').replace('px', ''));
        boardWidth = eval($('#board').css('width').replace('px', ''));

        if (tableWidth + marginLeft > boardWidth) {
            //  można przesuwać
            $('#inBoard').css('left', (marginLeft - 3) + "px")
        }
    },
    hover: function () {
        Board.elem.children('div').bind('hover', function() {
            id = $(this).attr('id');
            params = id.split('-');
            x = parseInt(params[1]);
            y = parseInt(params[0]);
            
            Board.elem.children('div').removeClass('hover');
            Board.elem.children('div').removeClass('hoverError');
            $(this).addClass('hover');
            
            if (Board.drawPlaceForBuild) {
                canBuildHere = Board.canBuildHere(x, y);
                
                //  robię hover
                for (i = 0; i < place.length; i++) {
                    if (canBuildHere) {
                        Board.elem.children(place[i]).addClass('hover');
                    } else {
                        Board.elem.children(place[i]).addClass('hoverError');
                    }
                }
            }
        });
    }, 
    canBuildHere: function (x, y) {
        place = new Array(Board.placeWidth * Board.placeHeight);
        mapIds = new Array(Board.placeWidth * Board.placeHeight);
        i = 0;

        console.log('canBuildHere()');
        console.log(x, y);
        console.log(parseInt(Board.placeWidth), parseInt(Board.placeHeight))
        
        mapIds[0] = x + Core.mapWidth * y;
        mapIds[1] = x + Core.mapWidth * (y + 1);
        mapIds[2] = (x + 1) + Core.mapWidth * y;
        mapIds[3] = (x + 1) + Core.mapWidth * (y + 1);
        console.log(mapIds);

        // obliczam współrzędne do zanzaczenia na mapie
        for (k = x; k < x + parseInt(Board.placeWidth); k++) {
            for (w = y; w < y + parseInt(Board.placeHeight); w++) {
                place[i] = 'div#' + w + '-' + k;
                if (k + Core.mapWidth * w < Core.mapWidth * Core.mapHeight) {
//                    mapIds[i] = k + Core.mapWidth * w;
                }
                i++;
            }
        }
        console.log(mapIds);
        
        //  sprawdzam, czy można postawić budynek
        for (i = 0; i < mapIds.length; i++) {
            if (Core.map[mapIds[i]] != 0) {
                return false;
            }
        }
        return true;
    },
    selectFromTo: function () {
        x_from = 0;
        y_from = 0;
        x_to = 0;
        y_to = 0;
        isDrawing = false;
        
        Board.elem.children('div').bind('mousedown', function() {
            id = $(this).attr('id');
            params = id.split('-');
            x_from = params[1];
            y_from = params[0];
            isDrawing = true;
        });
        
        $('div').bind('mouseup', function() {
            if (Board.cursorIsAboveTheBoard == false) {
                isDrawing = false;
            }
        });
        
        Board.elem.children('div').bind('hover', function() {
            if (isDrawing) {
                id = $(this).attr('id');
                params = id.split('-');
                x_to = params[1];
                y_to = params[0];
                
                console.log('from-to');
                
                if (Board.drawRoad) {
                    Board.drawBetaRoad(x_from, y_from, x_to, y_to);
                } else if (Board.drawArea) {
                    Board.drawBetaArea(x_from, y_from, x_to, y_to);
                }
            }
        });
        
        Board.elem.children('div').bind('mouseup', function() {
            if (isDrawing) {
                id = $(this).attr('id');
                params = id.split('-');
                x_to = parseInt(params[1]);
                y_to = parseInt(params[0]);
                isDrawing = false;
                
                if (Board.drawRoad) {
                    Board.elem.children('div.betaRoad').removeClass('betaRoad');
                    Board.createRoad(x_from, y_from, x_to, y_to);
                } else if (Board.drawArea) {
                    Board.elem.children('div.betaRoad').removeClass('betaArea');
                    Board.createArea(x_from, y_from, x_to, y_to, Board.areaType);
                } else if (Board.areaType == 0) {
                    Board.remove(x_to, y_to);
                } else {
                    canBuildHere = Board.canBuildHere(x_to, y_to);
//                    console.log(x_from, y_from);
//                    console.log(x_to, y_to);
//                    console.log(canBuildHere);
                }
            }
        });
    },
    drawBetaArea: function (x_from, y_from, x_to, y_to) {
        data = Board.drawAreaHelper(x_from, y_from, x_to, y_to);
        
        Board.elem.children('div.betaArea').removeClass('betaArea');
        
        for (y = data.y_from; y <= data.y_to; y++) {
            for (x = data.x_from; x <= data.x_to; x++) {
                Board.elem.children('div#' + y + '-' + x + '').addClass('betaArea');
            }
        }
    },
    drawAreaHelper: function(x_from, y_from, x_to, y_to) {
        
        x_from = parseInt(x_from);
        y_from = parseInt(y_from);
        x_to = parseInt(x_to);
        y_to = parseInt(y_to);
        
        width = Math.abs(x_from - x_to);
        height = Math.abs(y_from - y_to);
        
        if (x_from > x_to) {
            buffor = x_from;
            x_from = x_to;
            x_to = buffor;
        }
        if (y_from > y_to) {
            buffor = y_from;
            y_from = y_to;
            y_to = buffor;
        }  
        
        return {
            'x_from': x_from,
            'y_from': y_from,
            'x_to': x_to,
            'y_to': y_to,
            'width': width,
            'height': height
        };
    },
    drawRoadHelper: function(x_from, y_from, x_to, y_to) {
        
        width = Math.abs(x_from - x_to);
        height = Math.abs(y_from - y_to);

        if (x_from < x_to) {
            x_tmp_from = parseInt(x_from);
            x_tmp_to = parseInt(x_to);
            x2 = parseInt(x_from);
        } else {
            x_tmp_from = parseInt(x_to);
            x_tmp_to = parseInt(x_from);
            x2 = parseInt(x_to);
        }

        if (y_from <= y_to) {
            y_tmp_from = y_from;
            y_tmp_to = y_to;
        } else {
            y_tmp_from = y_to;
            y_tmp_to = y_from;
        }

        position_x = new Array();
        position_y = new Array();
        i = 0;

        if (width > height) {
            //  leży
            for (x = x_tmp_from; x <= x_tmp_to; x++) {
                position_x[i] = parseInt(x);
                position_y[i] = parseInt(y_from);
                i++;
            }
            for (y = y_tmp_from; y <= y_tmp_to; y++) {
                position_x[i] = parseInt(x_to);
                position_y[i] = parseInt(y);
                i++;
            }
        } else if (width <= height) {
            //  stoi lub kwadrat
            for (x = x_tmp_to; x >= x_tmp_from; x--) {
                position_x[i] = parseInt(x);
                position_y[i] = parseInt(y_to);
                i++;
            }
            for (y = y_tmp_to; y >= y_tmp_from; y--) {
                position_x[i] = parseInt(x_from);
                position_y[i] = parseInt(y);
                i++;
            }
        }

        console.log(x_from, y_from, x_to, y_to);
        console.log(position_x);
        console.log(position_y);

        return {
            'position_x': position_x,
            'position_y': position_y,
            'width': width,
            'height': height
        };
    },
    drawBetaRoad: function (x_from, y_from, x_to, y_to) {
        Board.elem.children('div.betaRoad').removeClass('betaRoad');

        helper = Board.drawRoadHelper(x_from, y_from, x_to, y_to);
        
        for (i = 0; i < helper.position_x.length; i++) {
            Board.elem.children('div#' + helper.position_y[i] + '-' + helper.position_x[i]).addClass('betaRoad');
        }
        
    },
    buildRoad: function (x_from, y_from, x_to, y_to) {
        //  oznaczamy w strukturze
        helper = Board.drawRoadHelper(x_from, y_from, x_to, y_to);
        console.log(helper);
        
        for (i = 0; i < helper.position_x.length; i++) {
            key = eval(helper.position_x[i]) + 1 + Core.mapWidth * (eval(helper.position_y[i])) - 1;
            Core.map[key] = 1;
        }
        
        Board.generateMap();
        
    },
    buildArea: function (x_from, y_from, x_to, y_to, type) {
        data = Board.drawAreaHelper(x_from, y_from, x_to, y_to);
        
        for (y = data.y_from; y <= data.y_to; y++) {
            for (x = data.x_from; x <= data.x_to; x++) {
                key = x + 1 + Core.mapWidth * (y) - 1;
                if (Core.map[key] != 1) {
                    Core.map[key] = type;
                }
            }
        }
        Board.generateMap();
        
    },
    drawBuildingHelper: function (x, y, type) {
        switch (type) {
            case 'electricity':
                Board.elem.children('#div' + y + '-' + x).css('backgroundColor', 'purple');
                Board.elem.children('#div' + y + '-' + (x+1)).css('backgroundColor', 'purple');
                Board.elem.children('#div' + (y+1) + '-' + x).css('backgroundColor', 'purple');
                Board.elem.children('#div' + (y+1) + '-' + (x+1)).css('backgroundColor', 'purple');
                break;
        }
    },
    buildBuilding: function (x, y, type) {
        console.log('beta');
        switch (type) {
            case 'electricity':
                Board.elem.children('#div' + y + '-' + x).css('backgroundColor', 'purple');
                Board.elem.children('#div' + y + '-' + (x+1)).css('backgroundColor', 'purple');
                Board.elem.children('#div' + (y+1) + '-' + x).css('backgroundColor', 'purple');
                Board.elem.children('#div' + (y+1) + '-' + (x+1)).css('backgroundColor', 'purple');
                break;
        }
    },
    createBuilding: function (x, y, type) {
        
    },
    createRoad: function (x_from, y_from, x_to, y_to) {
        this.buildRoad(x_from, y_from, x_to, y_to);
        Core.send('create-road', {
            'x_from': x_from, 
            'y_from': y_from, 
            'x_to': x_to, 
            'y_to': y_to
        }, function(data) {
            if (data.ok) {
                Money.current = data.money;
                Money.forecast = data.future;
                Money.update();
            }
        });
    }, 
    createArea: function(x_from, y_from, x_to, y_to, type) {
        this.buildArea(x_from, y_from, x_to, y_to, type);
        Core.send('create-area', {
            'x_from': x_from, 
            'y_from': y_from, 
            'x_to': x_to, 
            'y_to': y_to,
            'type': type
        }, function(data) {
            Money.current = data.money;
            Money.forecast = data.future;
            Money.update();
        });
    }
}