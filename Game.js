
class Game{
	constructor(players, cards, decks){
		var players = players || 4;
		var cards = cards || 5;
		var decks = decks || 1;
		var allHands = [];
		var deck = [];
	}

	dealTheCards(){
		var numPlayers = this.players;
		var numCards = this.cards;
		var numDecks = this.decks;

		// ensure that we have enough cards to play the game
		if( numPlayers * numCards > numDecks * 52 ){
			return "Not enough cards in the deck. Please adjust the number of players, cards or decks.";
		}
		if( numCards ){ this.cards = numCards; }
		if( numPlayers ){ this.players = numPlayers; }

		// get a new deck of cards and shuffle them
		var newDeck = new deck();
		this.deck = newDeck.shuffleDeck( numDecks );

		// for each player deal a hand
		var p;
		for( p = 0; p < this.players; p++ ){
			for( c = 0; c < this.cards; c++ ){
				// draw a card and add it to this players hand
				this.allHands[ p ][c]= this.deck.shift();
			}
		}
		this.allHands[community] = this.deck;
		return true;
	}

	getAllHands(){
		this.dealTheCards();
		return this.allHands;
	}
}