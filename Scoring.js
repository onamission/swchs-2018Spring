class Scoring{
	 scoreMe( hand, p ){
		var sets = {};
		var straights = {};
		var flushes = {};
		var retVal = '';
		var handScoring = {
			"HC":{label: "High Card", score : 0},
			"P":{label: "Pair", score : 1},
			"P2":{label: "2 Pair", score : 3},
			"K3":{label: "3 of a Kind", score : 4},
			"S":{label: "Straight", score : 5},
			"F":{label: "Flush", score : 6},
			"FH":{label: "Full House", score : 7},
			"K4":{label: "4 of a Kind", score : 9},
			"SF":{label: "Straight Flush", score : 11},
			"RF":{label: "Royal Flush", score : 13},
		};
		var cardValues = {
			"14" : "A",
			"13" : "K",
			"12" : "Q",
			"11" : "J",
			"10" : "10",
			"9" : "9",
			"8" : "8",
			"7" : "7",
			"6" : "6",
			"5" : "5",
			"4" : "4",
			"3" : "3",
			"2" : "2",
		}

		var handScore = handScoring.HC;
		var highCard = 2;
		for(ca=0; ca< hand.length; ca++ ){
			// the card's order is the first  digit of the key
			var order =hand[ca] && hand[ca].order ? hand[ca].order.substring( 0, 1 ) : '';
			order = parseInt( order, 16);
			if( highCard < order ){
				highCard = order;
			}

			// based on order we can look for sets and straights
			if( !sets[order] ){ sets[order] = [];}
			sets[order].push( { 'card': hand[ca].card,'order': hand[ca].order, 'cardNum': ca } );
			if( !straights[order] ){ straights[order] = []; }
			straights[order].push( { 'card': hand[ca].card,'order': hand[ca].order, 'cardNum': ca} ) ;

			// the card's suit is the fourth digit in the key
			var suit = hand[ca] && hand[ca].order ?  hand[ca].order.substring( 1, 2 ) : '';
			if( !flushes[suit] ){ flushes[suit] = []; }
			flushes[suit].push(  {'card': hand[ca].card,'order': hand[ca].order, 'cardNum': ca }  );
		}
		handScore.high = cardValues[highCard];
		//check for sets
		for( var s in sets ){
			// four of a kind highlight in GOLD
			if( sets[s].length > 3 ){
				for( var fourKind in sets[s] ){
					changeEleByIdStyle( "p" + p + "c" + sets[s][fourKind].cardNum, 'four') ;
				}
				if( handScore.score < handScoring.K4.score) {
					handScore = handScoring.K4;
					handScore.high = cardValues[s] + "'s";
				};
				// three of a kind highlight in SILVER
			}else if( sets[s].length > 2 ){
				for( var threeKind in sets[s] ){
					changeEleByIdStyle( "p" + p + "c" + sets[s][threeKind].cardNum, 'three') ;
				}
				if( handScore.score == handScoring.P.score ) {
					handScore.label = handScoring.FH.label;
					handScore.score = handScoring.FH.score;
					handScore.high = cardValues[s] +" over " + handScore.high + "'s" ;
				};
				if( handScore.score < handScoring.K3.score ) {
					handScore = handScoring.K3;
					handScore.high = cardValues[s] + "'s";
				};
			// pairs we will highlight in BRONZE, but since there is no color bronze, we will use coral
			}else if( sets[s].length > 1 ){
				for( var pair in sets[s] ){
					changeEleByIdStyle( "p" + p + "c" + sets[s][pair].cardNum, 'pair') ;
				}
				if( handScore.score == handScoring.K3.score ) {
					handScore.label = handScoring.FH.label;
					handScore.score = handScoring.FH.score;
					handScore.high =  handScore.high +" over " + cardValues[s] + "'s" ;
				};
				if( handScore.score == handScoring.P.score ) {
					handScore.label = handScoring.P2.label;
					handScore.score = handScoring.P2.score;
					handScore.high = handScore.high +" & " + cardValues[s] + "'s" ;
				};
				if( handScore.score < handScoring.P.score ) {
					handScore = handScoring.P;
					handScore.high = cardValues[s] + "'s";
				};
			}
		}
		// check for straights
		/* if we have an ace in our hand, add it as a 14th elmement as well */
		if( straights[ '001' ] ){
			straights[ '014']= straights[ '001' ];
		}
		var straightsList = [];
		for( var ix = 1; ix < 15; ix++ ){
			var index = addPadToStart(ix, 3, "0");
			if( straights[ index ] ){
				straightsList.push( straights[ index ] );
			}else{
				straightsList = [];
			}
			if( straightsList.length >= 5 ){
				for( var vals in straightsList ){
					changeEleByIdStyle( "p" + p + "c" + straightsList[vals][0].cardNum, 'straight') ;
				}
				var highCard = straightsList[0][0].order.substring(0,3);
				if( handScore.score == handScoring.F.score ) {
					handScore = highCard == '001' ? handScoring.RF : handScoring.SF;
					handScore.high = cardValues[highCard] + " high";
				};
				if( handScore.score < handScoring.S.score ) {
					handScore = handScoring.S;
					handScore.high = cardValues[highCard] + " high";
				};
			}
		}
		// check for flushes
		for( var flush in flushes ){
			// flushes we will border in gray
			if( flushes[flush].length > 4 ){
				var highCard = '013';
				for(var c in flushes[flush] ){
					changeEleByIdStyle( "p" + p + "c" + flushes[flush][c].cardNum, 'flush') ;
					var cardFace = flushes[flush][c].order.substring(0,3);
					if( highCard > cardFace ){
						highCard = cardFace;
					}
				}
				if( handScore.score == handScoring.S.score ) {
					handScore = handScoring.SF;
					handScore.high = cardValues[highCard] + " high";
				};
				if( handScore.score < handScoring.F.score ) {
					handScore = handScoring.F;
					handScore.high = cardValues[highCard] + " high";
				};
			}
		}
		return handScore.label + " of " + handScore.high;
	}

	 scoringKey(){
		 var data = new PokerData();
		 var styleList = data.getData().styleList;
			var retVal = 
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
		"</table>";
			return retVal;
		}


	 changeEleByIdStyle( eleId, style){
		var ele = $("#" + eleId + " .front > span");
		ele.addClass( style );
	}

	 addPadToStart( inValue, len, padWith ){
		if( !inValue ){ return '' };
		var retVal = inValue;
		inValLen = inValue.toString().length;
		if( padWith === '' ){
			padWith = ' '; // default to a space
		}
		if( len === ''){
			len = inValLen; // default to the length of the input value
		}
		for ( i = 0; i < ( len - inValLen); i++ ){
			retVal = padWith + retVal;
		}
		return retVal;
	}
}