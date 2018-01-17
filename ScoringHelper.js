class ScoringHelper{
    getSetsAndFlushes( hand, player ){
        var sets = [];
        var flushes = [];
        for(var ca=0; ca< hand.length; ca++ ){
			// get the card's value
			var order =hand[ca] && hand[ca].value ? hand[ca].value : '';
			var position =hand[ca] && hand[ca].position ? hand[ca].position : '';
			// get the card's suit
			var suit =hand[ca] && hand[ca].suit ? hand[ca].suit : '';
            var faceValue = pokerData.getData().cardKeys[ order ];

			// based on order we can look for sets and straights
			if( !sets[faceValue] ){ sets[faceValue] = [];}
			sets[faceValue].push( { 'card': hand[ca].card,'order': order, 'cardNum': ca, "position" : position } );

			// the card's suit is the fourth digit in the key
			if( !flushes[suit] ){ flushes[suit] = []; }
			flushes[suit].push(  {'card': hand[ca].card,'order': order, 'cardNum': ca, "position" : position }  );
		}
		return [ sets, flushes ];
    }

    addClassByElementId( eleId, style ){
        var ele = $("#" + eleId + " .front > span");
        ele.addClass( style );
    }

    replaceClassByElementId( eleId, style ){
        var ele = $("#" + eleId + " .front > span");
        if( ele.className && eleId.indexOf( "p" ) === 0 ){
            ele.className.replace(new RegExp( '.*', style ) );
        }else{
            ele.addClass( style );
        }
   }

    converToThreeCharStirng( numbr ){
        return  String( numbr ).padStart( 3, "0" );
    }
}

class HighCard extends ScoringHelper{
    getScore(  sets, flushes, handScore  ){
        var self = this;
        var data = pokerData.getData();
        var highCard = 0;
        sets.forEach(key => {
            if( parseInt( data.cardKeys[ key[ 0 ].order ] ) > parseInt( highCard ) ){
                highCard = data.cardKeys[ key[ 0 ].order ];
            }
        });
        handScore.score = data.handScoring.HC.score;
        handScore.label = data.handScoring.HC.label;
        handScore.high = data.cardValues[ highCard ];
        return handScore;
    }
}

class MatchingCards extends ScoringHelper{
    getScore( sets, flushes, handScore ){
        var self = this;
        var data = pokerData.getData();
        var handSets = {};
        var setsToProcess;
        sets.forEach( s =>{
            if( !handSets[ data.matches[ s.length ] ] ){
                handSets[ data.matches[ s.length ] ] = [];
            }
            handSets[ data.matches[ s.length ] ].push( s );
        });

        // auto create new object
        Object.keys( handSets ).forEach( key =>{
            if( key !== "HighCard" && handSets[ key ].length === 1 ){
                var scoringKey = Object.keys( data.handScoring ).find( scoreKey =>  data.handScoring[scoreKey].name === key )
                handScore = self.processMatch( handSets[ key ], Object.assign( { "key": key }, data.handScoring[ scoringKey ] ), handScore );
            }
        })

        // create "special" matches
        if ( handSets.Pair && handSets.Pair.length > 1 ){
            // just in case there are three pairs, take the top two
            var sortedSets = handSets.Pair.sort( function(a, b ) {
                return ( data.cardKeys[ b[ 0 ].order ] - data.cardKeys[ a[ 0 ].order ] );
            } )
            setsToProcess = [ sortedSets[ 0 ], sortedSets[ 1 ] ];
            handScore = self.processMatch( setsToProcess, Object.assign( { "key": "P2" }, data.handScoring[ "P2" ] ), handScore  );
        }
        if ( handSets.Pair && handSets.ThreeOfAKind ){
            // just in case there are two pairs and a three of a kind, take the top pair
            var sortedSets = handSets.Pair.sort( function(a, b ){
                return ( data.cardKeys[ b[ 0 ].order ] - data.cardKeys[ a[ 0 ].order ] );
            } )
            setsToProcess = [ sortedSets[ 0 ], handSets.ThreeOfAKind[ 0 ] ];
            handScore = self.processMatch( setsToProcess, Object.assign( { "key": "FH" }, data.handScoring[ "FH" ]), handScore  );
        }
        return handScore;
    }

    processMatch( setsInHand, options, handScore ){
        var self = this;
        var data = pokerData.getData();
        var cardValues = [], cardValue;
        setsInHand.forEach( set => {
            set.forEach( card =>{
                self.addClassByElementId( card.position, options.classes );
                cardValue = data.cardValues[ data.cardKeys[ card.order ] ] + "'s";
                if ( cardValues.indexOf( cardValue ) < 0){
                    cardValues.push( cardValue );
                }
            });
        });
        cardValues = cardValues.toString().replace( ",", " and ");
        if( handScore.score < options.score) {
            handScore.score = options.score;
            handScore.high = cardValues;
            handScore.label = options.label;
        };
        return handScore;
    }
}

class Flush extends ScoringHelper{
    getScore( sets, flushes, handScore ){
        var self = this;
        var data = pokerData.getData();
        Object.keys(flushes).forEach( function( flush ){
			// flushes we will border in gray
			if( flushes[flush].length > 4 ){
				var highCard = 1;
				flushes[flush].forEach( c =>{
                    if( handScore.score < data.handScoring.S.score ) {
                        var cardFace = data.cardKeys[ c.order ];
                        if( parseInt( highCard ) < parseInt( cardFace ) ){
                            highCard = cardFace;
                        }
                    }
				});
                // if the score is also a straight, set it to a straight flush or royal flush
                if( handScore.score == data.handScoring.S.score ) {
                    flushes[flush].forEach( card =>{
                        self.changeEleByIdStyle( card.position, 'flush') ;
                    });
                    handScore.score = cardOrder == 14 ? data.handScoring.RF.score : data.handScoring.SF.score;
                    handScore.label = cardOrder == 14 ? data.handScoring.RF.label : data.handScoring.SF.label;
                    handScore.high = data.cardValues[cardOrder] + " high";
                };

				// if the score is not as high as a flush, set it to a flush
				if( handScore.score < data.handScoring.F.score ) {
                    flushes[flush].forEach( card =>{
                        self.replaceClassByElementId( card.position, 'flush') ;
                    });
					handScore.score = data.handScoring.F.score;
					handScore.label = data.handScoring.F.label;
					handScore.high = data.cardValues[highCard] + " high";
				};
			}
        });
        return handScore;
    }
}

class Straight extends ScoringHelper{
    getScore( sets, flushes, handScore ){
        var self = this;
        var data = pokerData.getData();
        /* if we have an ace in our hand, add it as a 14th elmement as well */
		if( sets[ 14 ] ){
			sets[ 1 ]= sets[ 14 ];
		}
		// look for straights starting at Ace High and ending at 5
		for( var cardOrder = 14; cardOrder > 4; cardOrder-- ){
			if( sets[  cardOrder ] &&
				sets[ cardOrder - 1  ] &&
				sets[ cardOrder - 2 ] &&
				sets[ cardOrder - 3 ] &&
                sets[ cardOrder - 4 ] &&
                handScore.score < data.handScoring.S.score
            ){
                // change the first element of each card
                self.replaceClassByElementId(sets[ cardOrder ][ 0 ].position, 'straight') ;
                self.replaceClassByElementId( sets[ cardOrder - 1  ][ 0 ].position, 'straight') ;
                self.replaceClassByElementId( sets[ cardOrder - 2  ][ 0 ].position, 'straight') ;
                self.replaceClassByElementId( sets[ cardOrder - 3  ][ 0 ].position, 'straight') ;
                self.replaceClassByElementId( sets[ cardOrder - 4  ][ 0 ].position, 'straight') ;
                var highCard = self.converToThreeCharStirng( cardOrder );

                // if the score is not as high as a straight, set it to a straight
                if( handScore.score < data.handScoring.S.score ) {
                    handScore.label = data.handScoring.S.label;
					handScore.score = data.handScoring.F.score;
                    handScore.high = data.cardValues[cardOrder] + " high";
                };
			}
		}
        return handScore;
    }
}