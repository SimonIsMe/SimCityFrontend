Board = {
    elemId: 'inBoard',
    elem: null,
    cursorIsAboveTheBoard: false,
    drawRoad: true,
    drawArea: false,
    areaType: 2,
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
        
        Board.elem.hover(function() {
            Board.cursorIsAboveTheBoard = true;
        }, function() {
            Board.cursorIsAboveTheBoard = false;
        });
        
        Board.generateMap();
        Board.hover();
        Board.selectFromTo();
    },
    generateMap: function() {
        i = 0;
        for (y = 0; y < Core.mapHeight; y++) {
            for (x = 0; x < Core.mapWidth; x++) {
                if (Core.length <= i) {
                    break;
                }
                switch(Core.map[i]) {
                    case 1: 
                        Board.generateRoad(x, y);
                        Board.elem.children('div#' + y + '-' + x).css('backgroundColor', 'gray');
                        break;
                    case 2: Board.elem.children('div#' + y + '-' + x).addClass('residentalArea');
                        break;
                    case 3: Board.elem.children('div#' + y + '-' + x).addClass('commercialArea');
                        break;
                    case 4: Board.elem.children('div#' + y + '-' + x).addClass('industrialArea');
                        break;
                }
                i++;
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
        
        console.log(Core.map[neighbor[0]]);
        
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
        
        console.log(x, y, name, a, position, neighbor);
        
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
            x = params[1];
            y = params[0];
        });
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
        
        Board.elem.children('div').bind('mousepress', function() {
            
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
                x_to = params[1];
                y_to = params[0];
                isDrawing = false;
                
                
                if (Board.drawRoad) {
                    Board.elem.children('div.betaRoad').removeClass('betaRoad');
                    Board.createRoad(x_from, y_from, x_to, y_to);
                } else if (Board.drawArea) {
                    Board.elem.children('div.betaRoad').removeClass('betaArea');
                    Board.createArea(x_from, y_from, x_to, y_to);
                }
            }
        });
        
        
    },
    drawBetaArea: function (x_from, y_from, x_to, y_to) {
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
        
        Board.elem.children('div.betaArea').removeClass('betaArea');
        
        for (y = y_from; y <= y_to; y++) {
            for (x = x_from; x <= x_to; x++) {
                Board.elem.children('div#' + y + '-' + x + '').addClass('betaArea');
            }
        }
    },
    drawBetaRoad: function (x_from, y_from, x_to, y_to) {
        width = Math.abs(x_from - x_to);
        height = Math.abs(y_from - y_to);

        console.log('Board.drawBetaRoad('+x_from+','+y_from+','+x_to+','+y_to+')');

        Board.elem.children('div.betaRoad').removeClass('betaRoad');

        if (x_from < x_to) {
            x_tmp_from = x_from;
            x_tmp_to = x_to;
            x2 = x_from;
        } else {
            x_tmp_from = x_to;
            x_tmp_to = x_from;
            x2 = x_to;
        }

        if (y_from <= y_to) {
            y_tmp_from = y_from;
            y_tmp_to = y_to;
        } else {
            y_tmp_from = y_to;
            y_tmp_to = y_from;
        }

        if (width > height) {
            //  leży
            for (x = x_tmp_from; x <= x_tmp_to; x++) {
                Board.elem.children('div#' + y_from + '-' + x).addClass('betaRoad');
            }
            for (y = y_tmp_from; y <= y_tmp_to; y++) {
                Board.elem.children('div#' + y + '-' + x_to).addClass('betaRoad');
            }
        } else if (width <= height) {
            //  stoi lub kwadrat
            for (x = x_tmp_to; x >= x_tmp_from; x--) {
                Board.elem.children('div#' + y_to + '-' + x).addClass('betaRoad');
            }
            for (y = y_tmp_to; y >= y_tmp_from; y--) {
                Board.elem.children('div#' + y + '-' + x_from).addClass('betaRoad');
            }
        }
    },
    buildRoad: function (data) {
        //  oznaczamy w strukturze
        for(i = 0; i < data.position_x.length; i++) {
            key = data.position_x[i] + 1 + Core.mapWidth * (data.position_y[i]) - 1;
            Core.map[key] = 1;
        }
        
        Board.generateMap();
        
    },
    buildArea: function (data, type) {
        //  oznaczamy w strukturze
        for(i = 0; i < data.position_x.length; i++) {
            key = data.position_x[i] + 1 + Core.mapWidth * (data.position_y[i]) - 1;
            if (Core.map[key] != 1) {
                Core.map[key] = type;
            }
        }
        
        Board.generateMap();
        
    },
    createRoad: function(x_from, y_from, x_to, y_to) {
        Core.send('create-road', {
            'x_from': x_from, 
            'y_from': y_from, 
            'x_to': x_to, 
            'y_to': y_to
        });
    }, 
    createArea: function(x_from, y_from, x_to, y_to) {
        Core.send('create-area', {
            'x_from': x_from, 
            'y_from': y_from, 
            'x_to': x_to, 
            'y_to': y_to, 
            'type': Board.areaType
        });
    }
}

function Money() {
    this.current = 100;
    this.forecast = 100;
    this.pending = function () {
        self = this;
        $.ajax({
            url: 'http://tt.local',
            dataType: 'html',
            success: function(data) {
                self.current = 120;
                self.onUpdate();
            },
            error: function(data) {
//                Core.onErrorConnection();
            }
        })
    };
    this.onUpdate = function () {
        $('#money_current').text(this.current + "$");
        $('#forecast').text(this.forecast + "$");
    }
}