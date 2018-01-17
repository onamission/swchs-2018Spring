class Scoring{
	 scoreMe( hand, p ){
		var self = this;
		var retVal = '';
		var pd = new PokerData();
        var data = pd.getData();
        var helper = new ScoringHelper();
        var handScore = {
            score : data.handScoring.HC.score,
            high : 2,
            label: 'not set'
        };

        var [sets, flushes] = helper.getSetsAndFlushes( hand, p )

        //check for sets
        handScore = this.scoringFactory( "match" ).getScore( sets, flushes, handScore );

		// check for straights
        handScore = this.scoringFactory( "straight" ).getScore( sets, flushes, handScore );

        // check for flushes
        handScore = this.scoringFactory( "flush" ).getScore( sets, flushes, handScore );

        // if we still don't have a score, then get the high card
        if( handScore.score == data.handScoring.HC.score ){
            handScore = this.scoringFactory( "highcard" ).getScore( sets, flushes, handScore );
        }

		return handScore.label + " of " + handScore.high;
	}

	 scoringKey(){
		 var data = new PokerData();
         var handScoring = data.getData().handScoring;
         var reverseOrder = Object.keys( handScoring );
         var item;

        var retVal =
            "<html><head><link rel='stylesheet' type='text/css' href='./cards.css'></head<body>" +
            "<table class=\"scoringKeyTable\">" ;
        while( reverseOrder.length ){
            item = reverseOrder.pop();
            retVal += "<tr><td>"+
			"<span class='" + handScoring[ item ].classes  + "' >" + handScoring[ item ].label + "</span></td></tr>"
        }
		return retVal;
	}

   scoringFactory( type ){
       var typesList = {
           "highcard" : new HighCard(),
           "match" : new MatchingCards(),
           "flush" : new Flush(),
           "straight" : new Straight()
       }
       return typesList[ type ];
   }

}