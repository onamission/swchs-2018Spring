class GamePlay{
    /**
     * Start the game
     */
    startTheGame( ){
        var allGameData = pokerData.getData().gameData;
        var cardBack = pokerData.getData().blue_deck_hor;
        var shuffledDeck = deck.shuffleTheDeck(deckCount);
        var gameSelector = $("#g")[0];
        var gameName = gameSelector.options[ gameSelector.selectedIndex ].value;
        var gameData = allGameData.find( g => g.name == gameName );
        var deckCount = $("input[name=d]:checked").val();
        var playerSelector = $("#p")[0];
        var playerCount =  playerSelector.options[ playerSelector.selectedIndex ].value;
        var round = 1;

        // put some of the data on the page for easy access
        $("#gData").text( JSON.stringify( gameData ) );
        $("#deck").text( JSON.stringify( shuffledDeck ) );

        // clear the board
        $("#gameboard").html('');

        //set up player card section
        gameBoard.playersCardArea(pokerData.getData().playerName, playerCount, gameData.playerCards, cardBack);

        // set up community cards section
        if( gameData.communityCards ){
            gameBoard.communityCardArea( gameData.communityCards, gameData.playerCards);
        }

        // set up next round button
        var cardCount = {player : 0, community: 0, cards_already_dealt : 0};
        var parameters = round + ',' + JSON.stringify( cardCount )
        if( $("#dealDiv #play_button") && $("#dealDiv #play_button").length ){
            $("#play_button").attr(  "onclick", 'gamePlay.dealACard( ' + parameters + ' );' ).val( "Deal Round " + ( round ) );
        }else{
            $("#dealDiv").append( "<input id=\"play_button\" type=\"button\" onClick='gamePlay.dealACard( " + parameters + " )' value=\"Deal Round " + round + "\">");
        }

        // Set the background image based on base64 data
            $(".back").css("background-image","url(data:image/png;base64," + cardBack);
    };

    /**
     * Reveals all of the hands
     */
    reveal( players, playerCards, communityCards ){
        var hand = [];
        for( var c = 0; c < playerCards; c++ ){
            for( var p = 0; p < players; p++){
                if( !hand[p] ){
                    hand[p] = [];
                }
                var b = $("#p" + p + "c" + c + " div.back");
                b.css({transform: "rotateY(180deg)"});
                var f = $("#p" + p + "c" + c + " div.front");
                if( f.attr("data-ordr") ){
                    hand[p].push( {
                        "order": f.attr("data-ordr"),
                        "value": f.attr("data-value"),
                        "suit": f.attr("data-suit"),
                        "position": "p" + p + "c" + c,
                        "card":f.html()
                    });
                    f.css({transform: "rotateY(0deg)"});
                }
            }
        }
        if( communityCards ){
            for( var p = 0; p < players; p++){
                for(var  com = playerCards; com < ( communityCards + playerCards ); com++){
                    if( !hand[p] ){
                        hand[p] = [];
                    }
                    var f = $("#comm_c" + com + " div.front");
                    var b = $("#comm_c" + com + " div.back");
                    b.css({transform:"rotateY(180deg)"});
                    if( f.attr("data-ordr") ){
                        hand[p].push( {
                            "order": f.attr("data-ordr"),
                            "value": f.attr("data-value"),
                            "suit": f.attr("data-suit"),
                            "position": "comm_c" + com,
                            "card":f.html()
                        });
                        f.css({transform: "rotateY(0deg)"});
                    }
                }
            }
        }
        for( var p = 0; p < players; p++){
            $("#score" + p).html( scoring.scoreMe( hand[p], p ) );
        };

        var playerNumber = $(".hand") ? $(".hand").length : 1;
        $("#play_button").attr( "onclick", "gamePlay.dealACard( 1, {\"player\" : 0, \"community\": 0, \"cards_already_dealt\": 0} );" ).val( "Start New Game" );
        // reshuffle the deck
        var newDeck = new Deck();
        var shuffledDeck = newDeck.shuffleTheDeck( ( $("input[name=d]:checked" ).val() || 1 ) );
        $("#deck").text( JSON.stringify( shuffledDeck ) );
    };

    /**
    * Deal the cards
    */
   dealACard( round, cardCount ){
       if( round === 1 && cardCount.cards_already_dealt == 0 ){
            // this is a new hand, so reset all of the players cards
            $(".back").css( { transform: "rotateY(0deg)" }) ;
            // clear score
            $(".score").html('');
       }
       var numberOfPlayers = $(".hand") ? $(".hand").length : 1;
       var gameData = JSON.parse( $("#gData").text() );
       var remainingDeck = JSON.parse( $("#deck").text() );
       var cardsToDealThisRound = gameData.dealOrder[round].cardsToDeal;
       var dealToWhoThisRound = gameData.dealOrder[round].dealTo;
       var howToDealThisRound = gameData.dealOrder[round].cardDirection;
       if( gameData.name == "5draw" && round == 1 ){
           $("#msg").html( "Click on up to 3 cards to replace. Once you have your cards selected, click on \"Deal Round 2\" to replace those cards");
       }

       // deal the cards for this round
       var dealTo = this.dealToFactory( dealToWhoThisRound );
       cardCount = dealTo.dealCards( numberOfPlayers, cardCount, cardsToDealThisRound, howToDealThisRound, remainingDeck );

       round++;
       cardCount.cards_already_dealt += cardsToDealThisRound;
       var pb = $("#play_button");
       if( round > Object.keys( gameData.dealOrder ).length  ){
           var cardContainers =  $(".hand .card-container") ? $(".hand .card-container").length : 0;
           var numberOfHands = $(".hand") ? $(".hand").length : 1;
           var parameters =  numberOfHands + "," + ( cardContainers / numberOfHands ) + "," + cardCount.community;
           pb.attr( "onclick", "gamePlay.reveal(" + parameters + ");" ).val( "Reveal?" );
       }else{
           var parameters = round + ',' + JSON.stringify( cardCount )
           pb.attr( "onclick", 'gamePlay.dealACard( ' + parameters + ' );' ).val( "Deal Round " + ( round ) );
       }
       // and replace the "remainingDeck" on the page
       $("#deck").text( JSON.stringify(remainingDeck  ) );
   };


   dealToFactory( type ){
       var typesList = {
           "players" : new DealToPlayers(),
           "community" : new DealToCommunity(),
           "replace" : new DealToReplace()
       }
       return typesList[ type ];
   }
}
