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

    changeEleByIdStyle( eleId, style){
       var ele = $("#" + eleId + " .front > span");
       ele.addClass( style );
   }

    converToThreeCharStirng( numbr ){
        return  String( numbr ).padStart( 3, "0" );
    }
}

class HighCard extends ScoringHelper{
    getScore(  sets, flushes, handScore  ){
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
        var data = pokerData.getData();
        for( var s in sets ){
			// four of a kind highlight in GOLD
			if( sets[s].length > 3 ){
				for( var fourKind in sets[s] ){
					this.changeEleByIdStyle( sets[s][fourKind].position, 'four') ;
				}
				if( handScore.score < data.handScoring.K4.score) {
					handScore.score = data.handScoring.K4.score;
					handScore.high = data.cardValues[s] + "'s";
					handScore.label = data.handScoring.K4.label;
				};
				// three of a kind highlight in SILVER
			}else if( sets[s].length > 2 ){
				for( var threeKind in sets[s] ){
					this.changeEleByIdStyle( sets[s][threeKind].position, 'three') ;
				}
				if( handScore.score == data.handScoring.P.score ) {
					handScore.label = data.handScoring.FH.label;
					handScore.score = data.handScoring.FH.score;
					handScore.high = data.cardValues[s] +"'s over " + handScore.high ;
				};
				if( handScore.score < data.handScoring.K3.score ) {
					handScore.score = data.handScoring.K3.score;
                    handScore.high = data.cardValues[s] + "'s";
					handScore.label = data.handScoring.K3.label;

				};
			// pairs we will highlight in BRONZE, but since there is no color bronze, we will use coral
			}else if( sets[s].length > 1 ){
				for( var pair in sets[s] ){
					this.changeEleByIdStyle( sets[s][pair].position, 'pair') ;
				}
				if( handScore.score == data.handScoring.K3.score ) {
					handScore.label = data.handScoring.FH.label;
					handScore.score = data.handScoring.FH.score;
					handScore.high =  handScore.high +" over " + data.cardValues[s] + "'s" ;
				};
				if( handScore.score == data.handScoring.P.score ) {
					handScore.label = data.handScoring.P2.label;
					handScore.score = data.handScoring.P2.score;
					handScore.high = handScore.high +" & " + data.cardValues[s] + "'s";
				};
				if( handScore.score < data.handScoring.P.score ) {
					handScore.score = data.handScoring.P.score;
					handScore.label = data.handScoring.P.label;
					handScore.high = data.cardValues[s] + "'s";
				};
			}
        }
        return handScore;
    }
}

class Flush extends ScoringHelper{
    getScore( sets, flushes, handScore ){
        var data = pokerData.getData();
        Object.keys(flushes).forEach( function( flush ){
			// flushes we will border in gray
			if( flushes[flush].length > 4 ){
				var highCard = 1;
				flushes[flush].forEach( c =>{
                    if( handScore.score < data.handScoring.S.score ) {
                        self.changeEleByIdStyle( c.position, 'flush') ;
                        var cardFace = data.cardKeys[ c.order ];
                        if( parseInt( highCard ) < parseInt( cardFace ) ){
                            highCard = cardFace;
                        }
                    }
				});
                // if the score is also a straight, set it to a straight flush or royal flush
                if( handScore.score == data.handScoring.S.score ) {
                    handScore.score = cardOrder == 14 ? data.handScoring.RF.score : data.handScoring.SF.score;
                    handScore.label = cardOrder == 14 ? data.handScoring.RF.label : data.handScoring.SF.label;
                    handScore.high = data.cardValues[cardOrder] + " high";
                };

				// if the score is not as high as a flush, set it to a flush
				if( handScore.score < data.handScoring.F.score ) {
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
                self.changeEleByIdStyle(sets[ cardOrder ][ 0 ].position, 'straight') ;
                self.changeEleByIdStyle( sets[ cardOrder - 1  ][ 0 ].position, 'straight') ;
                self.changeEleByIdStyle( sets[ cardOrder - 2  ][ 0 ].position, 'straight') ;
                self.changeEleByIdStyle( sets[ cardOrder - 3  ][ 0 ].position, 'straight') ;
                self.changeEleByIdStyle( sets[ cardOrder - 4  ][ 0 ].position, 'straight') ;
                var highCard = this.converToThreeCharStirng( cardOrder );

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