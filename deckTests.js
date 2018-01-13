class DeckTests{
    testNewDeck(numberOfDecks, testType){ 
        testType = testType || "count";  
        numberOfDecks = numberOfDecks || 1;
        var label = "Should get a new deck: ";
        var newDeck = new Deck();
        var d = newDeck.getDeck(numberOfDecks);
        var testOutput = '';
        if( testType === 'count'){
            label += "COUNT -- should be 52 X " + numberOfDecks;
            testOutput = '<p>There are ' + d.length + ' cards in the new deck</p>';
        }
        if( testType === 'list'){
            label += "LIST -- should be in order";
            d.forEach(card => {
                testOutput += '<li>  ' + card.cardValue + '</li>';
            });
        }
        return {"testOutput" : testOutput, "label": label};
    }

    testShuffleDeck(numberOfDecks, testType){ 
        testType = testType || "count";
        numberOfDecks = numberOfDecks || 1;
        var label = "Should get a shuffled deck: ";
        var newDeck = new Deck();
        var d = newDeck.shuffleTheDeck(numberOfDecks);
        var testOutput = '';
        if( testType === 'count'){
            label += "COUNT -- should be 52 X " + numberOfDecks;
            testOutput = '<p>There are ' + d.length + ' cards in the shuffled deck</p>';
        }
        if( testType === 'list'){
            label += "LIST -- should be out of order";
            d.forEach(card => {
                testOutput += '<li>  ' + card.cardValue + '</li>';
            });
        }
        return {"testOutput" : testOutput, "label": label};
    }
}