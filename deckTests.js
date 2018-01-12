class deckTests{
    runNewDeck(){   
        $(document).ready( function(){  
            var newDeck = new deck();
            var d = newDeck.getDeck();
            var testOutput = '<p>There are ' + d.length + ' cards in the deck</p><ul>';
            d.forEach(card => {
                testOutput += '<li>  ' + card.value + '</li>';
            });
            $("#test_output_001").html( testOutput + "</ul>" );
        });
    }

    runShuffleDeck(){
        $(document).ready( function(){  
            var newDeck = new deck();
            var d = newDeck.shuffleTheDeck();
            var testOutput = '<p>There are ' + d.length + ' cards in the deck</p><ul>';
            d.forEach(card => {
                testOutput += '<li>  ' + card.value + '</li>';
            });
            $("#test_output_002").html( testOutput + "</ul>" );
        });
    }
}