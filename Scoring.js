class Scoring{
	 scoreMe( hand, p ){
		var self = this;
		var sets = {};
		var flushes = {};
		var retVal = '';
		var pd = new PokerData();
        var data = pd.getData();

		var handScore = data.handScoring.HC;
		var highCard = 2;
		for(var ca=0; ca< hand.length; ca++ ){
			// get the card's value
			var order =hand[ca] && hand[ca].value ? hand[ca].value : '';
			var position =hand[ca] && hand[ca].position ? hand[ca].position : '';
			// get the card's suit
			var suit =hand[ca] && hand[ca].suit ? hand[ca].suit : '';
			var faceValue = data.cardKeys[ order ];
			if( parseInt(highCard) < parseInt(faceValue) ){
				highCard = faceValue;
			}

			// based on order we can look for sets and straights
			if( !sets[faceValue] ){ sets[faceValue] = [];}
			sets[faceValue].push( { 'card': hand[ca].card,'order': order, 'cardNum': ca, "position" : position } );

			// the card's suit is the fourth digit in the key
			if( !flushes[suit] ){ flushes[suit] = []; }
			flushes[suit].push(  {'card': hand[ca].card,'order': order, 'cardNum': ca, "position" : position }  );
		}
		handScore.high = data.cardValues[highCard];
		//check for sets
		for( var s in sets ){
			// four of a kind highlight in GOLD
			if( sets[s].length > 3 ){
				for( var fourKind in sets[s] ){
					self.changeEleByIdStyle( sets[s][fourKind].position, 'four') ;
				}
				if( handScore.score < data.handScoring.K4.score) {
					handScore = data.handScoring.K4;
					handScore.high = data.cardValues[s] + "'s";
				};
				// three of a kind highlight in SILVER
			}else if( sets[s].length > 2 ){
				for( var threeKind in sets[s] ){
					self.changeEleByIdStyle( sets[s][threeKind].position, 'three') ;
				}
				if( handScore.score == data.handScoring.P.score ) {
					handScore.label = data.handScoring.FH.label;
					handScore.score = data.handScoring.FH.score;
					handScore.high = data.cardValues[s] +" over " + handScore.high ;
				};
				if( handScore.score < data.handScoring.K3.score ) {
					handScore = data.handScoring.K3;
					handScore.high = data.cardValues[s] + "'s";
				};
			// pairs we will highlight in BRONZE, but since there is no color bronze, we will use coral
			}else if( sets[s].length > 1 ){
				for( var pair in sets[s] ){
					self.changeEleByIdStyle( sets[s][pair].position, 'pair') ;
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
					handScore = data.handScoring.P;
					handScore.high = data.cardValues[s] + "'s";
				};
			}
		}
		// check for straights
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
				sets[ cardOrder - 4 ] ){
					// change the first element of each card
					self.changeEleByIdStyle(sets[ cardOrder ][ 0 ].position, 'straight') ;
					self.changeEleByIdStyle( sets[ cardOrder - 1  ][ 0 ].position, 'straight') ;
					self.changeEleByIdStyle( sets[ cardOrder - 2  ][ 0 ].position, 'straight') ;
					self.changeEleByIdStyle( sets[ cardOrder - 3  ][ 0 ].position, 'straight') ;
					self.changeEleByIdStyle( sets[ cardOrder - 4  ][ 0 ].position, 'straight') ;
					var highCard = this.converToThreeCharStirng( cardOrder );
					// if the score is not as high as a straight, set it to a straight
					if( handScore.score < data.handScoring.S.score ) {
						handScore = data.handScoring.S;
						handScore.high = data.cardValues[cardOrder] + " high";
					};
			}
		}
		// check for flushes
		Object.keys(flushes).forEach( function( flush ){
			// flushes we will border in gray
			if( flushes[flush].length > 4 ){
				var highCard = 1;
				flushes[flush].forEach( c =>{
					self.changeEleByIdStyle( c.position, 'flush') ;
					var cardFace = data.cardKeys[ c.order ];
					if( parseInt( highCard ) < parseInt( cardFace ) ){
						highCard = cardFace;
					}
				});
				// if the score is also a straight, set it to a straight flush or royal flush
				if( handScore.score == data.handScoring.S.score ) {
					handScore = handScore.high == 14 ? data.handScoring.RF : data.handScoring.SF;
					handScore.high = data.cardValues[highCard] + " high";
				};
				// if the score is not as high as a flush, set it to a flush
				if( handScore.score < data.handScoring.F.score ) {
					handScore = data.handScoring.F;
					handScore.high = data.cardValues[highCard] + " high";
				};
			}
		});
		return handScore.label + " of " + handScore.high;
	}

	converToThreeCharStirng( numbr ){
		return  String( numbr ).padStart( 3, "0" );
	}

	 scoringKey(){
		 var data = new PokerData();
		 var styleList = data.getData().styleList;
            var retVal =
        "<html><head><link rel='stylesheet' type='text/css' href='./cards.css'></head<body>" +
		"<table style='border-radius: 15px; border:double #333 1px ;margin:10px;padding:5px'>" +
		"<tr><td style='text-align:center'>"+
			"<span class='flush straight' >Royal Flush</span></td></tr>" +
		"<tr><td style='text-align:center'>"+
			"<span class='flush straight'>Straight Flush</span></td></tr>" +
		"<tr><td style='text-align:center'>"+
			"<span class='four' >" +styleList.four.label + "</span></td></tr>" +
		"<tr><td style='text-align:center'>"+
			"<span class='pair' >Full</span> <span class='three'>House</span></td></tr>" +
		"<tr><td style='text-align:center'>"+
			"<span class='flush' >" +styleList.flush.label + "</span></td></tr>" +
		"<tr><td style='text-align:center'>"+
			"<span class='straight' >" +styleList.straight.label + "</span></td></tr>" +
		"<tr><td style='text-align:center'>"+
			"<span class='three' >" +styleList.three.label + "</span></td></tr>" +
		"<tr><td style='text-align:center'>"+
			"<span class='pair'>Two</span> <span class='pair'>Pair</span></td></tr>" +
		"<tr><td style='text-align:center'>"+
			"<span class='pair' >" +styleList.pair.label + "</span></td></tr>" +
		"</table></body></html>";
			return retVal;
		}


	 changeEleByIdStyle( eleId, style){
		var ele = $("#" + eleId + " .front > span");
		ele.addClass( style );
	}
}