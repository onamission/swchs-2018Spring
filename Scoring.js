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
		 var styleList = data.getData().styleList;
            var retVal =
        "<html><head><link rel='stylesheet' type='text/css' href='./cards.css'></head<body>" +
		"<table style='border-radius: 15px; border:double #333 1px ;margin:10px;padding:5px'>" +
		"<tr><td style='text-align:center'>"+
			"<span class='royal flush straight' >Royal Flush</span></td></tr>" +
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