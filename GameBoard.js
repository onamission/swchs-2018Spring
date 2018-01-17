class GameBoard{
    communityCardArea(communityCardCount, playerCardCount){
        if( communityCardCount ){
            $("#gameboard").append( "<div id=\"comm-board\"><div class='communityName'>Community Cards</div></div>" );
            for( var i= ( playerCardCount ); i < ( communityCardCount + playerCardCount ); i++){
                var communityCards = "<div  class='card-container' id='comm_c"+i+"'>" +
                    "<div class='card front' >" +
                    "</div><div class='card back' ></div><div";
                $('#comm-board').append( communityCards);
            }
        }
    }

    scoringKey( ){
        var key = window.open( "", "key", "width=250,height=580,menubar=no,resizable=no,scrollbars=no,toolbar=no,location=no");
        key.document.write( scoring.scoringKey() );
    }


    playersCardArea( playerList, playerCount, playerCards ){
        var g = $("#gameboard");
        var players = [ "MY HAND" ];
        var possiblePlayerList = playerList;
        for( var i = 1; i < playerCount; i++){
            var playerIndex = Math.floor( Math.random() * 2000 );
            players.push( possiblePlayerList[ playerIndex ] );
        }
        var p = players.length;
        var playerContents = [];
        var playerBoardContents = "";
        $.each( players, function(i, p){
            var myClass = p == "MY HAND" ?
                " myclass' onclick='toggleClass(this.id, \"selected\");'" :
                '';
            var handContents ="<div class='hand'><div class=player><div class='playerName'>" + p + "</div><div class=\"score\" id=\"score" + i + "\"></div></div>";
            for( var c=0; c < playerCards; c++){
                handContents += "<div class='card-container" + myClass +"' id='p" + i + 'c' + c +
                    "'><div class='card front' ></div>\n<div class='card back' >\n</div>\n</div>";
            }
            playerContents.push( handContents);
        });
        playerContents.forEach( player => {
            playerBoardContents += player + "</div>" ;
        });
        g.append(  "<div class='player-board'>" + playerBoardContents + "</div>" );
    };
}