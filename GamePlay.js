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
        var cardCount = 0;

        // put the data on the page for easy access
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
        if( $("#dealDiv #play_button") && $("#dealDiv #play_button").length ){
            $("#play_button").attr( "onclick", "gamePlay.dealACard( 1, 0," + playerCount + ");" ).val("Deal Round " + round)
        }else{
            $("#dealDiv").append( "<input id=\"play_button\" type=\"button\" onClick=\"gamePlay.dealACard( " +
                round + ", " + cardCount + " )\" value=\"Deal Round " + round + "\">");
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
                for(var  com = playerCards; com < communityCards; com++){
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
        $("#play_button").attr( "onclick", "gamePlay.dealACard( 1, 0," + playerNumber + ");" ).val( "Start New Game" );
        // reshuffle the deck
        var newDeck = new Deck();
        var shuffledDeck = newDeck.shuffleTheDeck( ( $("input[name=d]:checked" ).val() || 1 ) );
        $("#deck").text( JSON.stringify( shuffledDeck ) );
    };

    /**
    * Deal the cards
    */
   dealACard( round, cardsAlreadyDealt ){
       if( round === 1 && cardsAlreadyDealt == 0 ){
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
       var communityCardCount = 0;
       var playerCardCount = 0;
       if( gameData.name == "5draw" && round == 1 ){
           $("#msg").html( "Click on up to 3 cards to replace. Once you have your cards selected, click on \"Deal Round 2\" to replace those cards");
       }
       if( dealToWhoThisRound == "replace" ){
           var sel = $(".selected > div.card.front");
           // var sel = $(".selected .front");
           if( sel.length > 3 ){
               alert( "You can only select three cards to replace." );
               round--; //reset the round
           }else{
               // first we must change the cards
               sel.each( s =>{
                   var crd = remainingDeck.shift();
                   var f = sel[s];
                   f.innerHTML = crd.cardValue ;
                   f.setAttribute("data-ordr",crd.card.order);
                   f.setAttribute("data-suit",crd.suit.name);
                   f.setAttribute("data-value",crd.card.value);
                   f.style.color=crd.suit.color;
                   toggleClass( f.parentElement.id, "selected" );
               });
           }
       }
       if( dealToWhoThisRound == "players"){
           for( var p = 0; p < numberOfPlayers; p++){
               // find the first unplayed card in the hand
               var nextCardToPlay = this.findFirstUnplayedCard( p, cardsAlreadyDealt, cardsToDealThisRound );
               for( var c = nextCardToPlay; c < cardsToDealThisRound; c++ ){
                   var f = $("#p" + p + "c" + c + " div.front");
                   var b = $("#p" + p + "c" + c + " div.back");
                   var crd = remainingDeck.shift();
                   f.html(crd.cardValue);
                   f.attr("data-ordr", crd.card.order);
                   f.attr("data-suit", crd.suit.name);
                   f.attr("data-value", crd.card.value);
                   f.css( "color", crd.suit.color);
                   if( howToDealThisRound == "up" || p==0 ){
                       b.css({transform: "rotateY(180deg)"});
                   }else{
                       f.css({transform: "rotateY(180deg)"});
                   }
               }
               playerCardCount++;
           }
       }
       if( dealToWhoThisRound == "community"){
           // find the first unplayed card in the hand
           var nextCardToPlay = this.findFirstUnplayedCard( "comm", cardsAlreadyDealt, cardsToDealThisRound );
           for( var c = nextCardToPlay; c < cardsToDealThisRound; c++ ){
               var f = $("#comm_c" + c + " div.front");
               var b = $("#comm_c" + c + " div.back");
               var crd = remainingDeck.shift();
               f.html(crd.cardValue );
               f.attr("data-ordr", crd.card.order);
               f.attr("data-suit", crd.suit.name);
               f.attr("data-value", crd.card.value);
               if( howToDealThisRound == "up" || p==0 ){
                   b.css({transform: "rotateY(180deg)"});
               }else{
                   f.css({transform: "rotateY(180deg)"});
               }
               communityCardCount++;
           }
       }
       round++;
       cardsAlreadyDealt += cardsToDealThisRound;
       var pb = $("#play_button");
       if( round > Object.keys( gameData.dealOrder ).length  ){
           var cardContainers =  $(".card-container") ? $(".card-container").length : 0;
           var numberOfHands = $(".hand") ? $(".hand").length : 1;
           var parameters =  numberOfHands + "," + ( cardContainers / numberOfHands ) + "," + communityCardCount;
           pb.attr( "onclick", "gamePlay.reveal(" + parameters + ");" ).val( "Reveal?" );
       }else{
           pb.attr( "onclick", "gamePlay.dealACard( "+ round +"," + cardsAlreadyDealt + " );" ).val( "Deal Round " + ( round ) );
       }
       // and replace the "remainingDeck" on the page
       $("#deck").text( JSON.stringify(remainingDeck  ) );
   };

   findFirstUnplayedCard( player, cards, cardsThisRound ){
       var nextCardFound = false;
       var nextCardToPlay = cards;
       do{
           var e = $("#" + player + "c" + nextCardToPlay + " div.front" );
           if ( e ){
               if ( !e.data() ){
                   nextCardFound = true;
               }else{
                   nextCardToPlay++;
               }
           }
       }while( nextCardFound === false && nextCardToPlay < cardsThisRound + cards );
       return nextCardToPlay;
   }
}

class dealToPlayers{
    dealCards(){

    }
}

class dealToCommunity{
    dealCards(){

    }
}

class dealToReplace{
    dealCards(){

    }
}