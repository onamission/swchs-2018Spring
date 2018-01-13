class ScoringTests{
    testScoreMe(hand, player){  
        var label = "Should score a hand: ";
        var newScore = new Scoring();
        var s = newScore.scoreMe(hand, player);
        var testOutput = '<ul>';
        label += "SCORE";
        hand.forEach(card => {
            testOutput += '<li>  ' + card.card + '</li>';
        });
        testOutput += '</ul>';
        testOutput += '<p>Score is ' + s + '</p>';
        return {"testOutput" : testOutput, "label": label};
    }
}

