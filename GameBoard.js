class GameBoard{
    communityCardArea(communityCardCount){
        var cc = $('.card-container');
        if( communityCardCount ){
            for( var i= 0; i< communityCardCount; i++){
                var communityCards = "<div  class='card-container' id='comm_c"+i+"'>" +
                    "<div class='card front' >" +
                    "</div><div class='card back' ></div><div";
                $('#comm-board').append( communityCards);
            }
        }
    }

    scoringKey( scoringKey ){
        $('#key').html( scoring.scoringKey() );
    }


    playersCardArea( playerList, playerCount, playerCards, cardBack ){
        var g = $("#gameboard");
        g.html('');
        var players = [ "MY HAND" ];
        var possiblePlayerList = playerList;
        for( var i = 1; i < playerCount; i++){
            var playerIndex = Math.floor( Math.random() * 2000 );
            players.push( possiblePlayerList[ playerIndex ] );
        }
        var p = players.length;
        var playerBoardContents = [];
        $.each( players, function(i, p){
            var myClass = p == "MY HAND" ?
                " myclass' onclick='toggleClass(this.id, \"selected\");'" :
                '';
            var handContents ="<div class='hand'><div class='playerName'>" + p + "<div id=\"score" + i + "\"></div></div>";
            for( var c=0; c < playerCards; c++){
                handContents += "<div class='card-container" + myClass +"' id='p" + i + 'c' + c +
                    "'><div class='card front' ></div>\n<div class='card back' >\n</div>\n</div>";
            }
            playerBoardContents.push( "<div class='player-board'>" + handContents + "</div>");
        });
        playerBoardContents.forEach( player => {
            g.append( player );
        });

        // Set the background image based on base64 data
        $(".back").css("background-image","url(data:image/png;base64," + cardBack);
    };
}