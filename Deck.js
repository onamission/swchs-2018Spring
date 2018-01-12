class Deck{
	getDeck( deckCount ){
		var pd = new PokerData();
        var data = pd.getData();
		var fullDeck = [], i;
		deckCount = deckCount || 1;
		var cardSuits = data.suits;
		var cards = data.cards;
		for( i = 0; i < deckCount; i++ ){
			cardSuits.forEach( suit=>{
				cards.forEach( card =>{
					if( card && suit && card.order ){
						fullDeck.push({
							"card": card,
							"suit": suit,
							"cardValue": "<span style='color:" + suit.color + "'><b>" + card.value + " " + suit.symbol + "</b></span>" 
						});
					}
				});
			});
		}
		return fullDeck;
	}

	shuffleTheDeck( deckCount ){
		deckCount = deckCount || 1;
		var shuffledCards = [];
		var allCards = this.getDeck( deckCount );
		var cardCount = 0;
		do{
			var randomCardIndex = Math.floor(Math.random() * Math.floor(allCards.length));
			if( allCards[ randomCardIndex ] ){
				var randomCard = allCards[ randomCardIndex ];
				shuffledCards.push( randomCard);
				delete allCards[ randomCardIndex ];
				cardCount++;
			}
		}while ( cardCount < allCards.length);
		return shuffledCards;
	}
}
