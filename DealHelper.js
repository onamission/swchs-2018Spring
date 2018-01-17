
class DealHelper{
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

class DealToPlayers extends DealHelper{
    dealCards( numberOfPlayers, cardCount, cardsToDealThisRound, howToDealThisRound, remainingDeck ){
        for( var p = 0; p < numberOfPlayers; p++){
            // find the first unplayed card in the hand
            var nextCardToPlay = this.findFirstUnplayedCard( p, cardCount.cards_already_dealt, cardsToDealThisRound );
            for( var c = nextCardToPlay; c < ( cardsToDealThisRound + nextCardToPlay ); c++ ){
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
        }
        cardCount.player += cardsToDealThisRound;
        return cardCount;
    }
}

class DealToCommunity extends DealHelper{
    dealCards( numberOfPlayers, cardCount, cardsToDealThisRound, howToDealThisRound, remainingDeck ){
        var nextCardToPlay = this.findFirstUnplayedCard( "comm", cardCount.cards_already_dealt, cardsToDealThisRound );
        for( var c = nextCardToPlay; c < ( cardsToDealThisRound + nextCardToPlay ); c++ ){
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
        }
        cardCount.community += cardsToDealThisRound;
        return cardCount;
    }
}

class DealToReplace extends DealHelper{
    dealCards( numberOfPlayers, cardCount, cardsToDealThisRound, howToDealThisRound, remainingDeck ){
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
        return cardCount;
    }
}