Core = {
    apiAddress: 'http://localhost/',
    map: [0, 0, 0, 0, 1, 0, 0, 0, 0],
    mapWidth: 20,
    mapHeight: 20,
    send: function(uri, data) {
        $.ajax({
            url: Core.apiAddress + uri,
            data: data,
            success: function(data) {
                conosle.log(data);
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

Board = {
    elemId: 'inBoard',
    elem: null,
    cursorIsAboveTheBoard: false,
    drawRoad: true,
    drawArea: false,
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
                if (Core.map[i] == 1) {
                    Board.elem.children('div#' + y + '-' + x).css('backgroundColor', 'gray');
                }
                i++;
            }
        }
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
                    //drawRoad(x_from, y_from, x_to, y_to);
                } else if (Board.drawArea) {
                    
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
    selectRoad: function(x_from, y_from, x_to, y_to) {
        Core.send('/create/road', {
            'x_from': x_from, 
            'y_from': y_from, 
            'x_to': x_to, 
            'y_to': y_to
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

$(document).ready(function(){
    Board.init();
    
    money = new Money();
    money.pending();
});