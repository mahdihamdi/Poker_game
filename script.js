/* 
@ Mahdi Hamdi

*/

Poker = (function($) {
  var chance = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
  var cardBaseURL = "http://h3h.net/images/cards/{suit}_{card}.svg";
  var suits = ['spade', 'heart', 'diamond', 'club'];
  var cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  var hand = [];
  var ncards = [];
  var p_pairs = [];
  var d_pairs1 = [];
  var d_pairs2 = [];
  var idcards = [];
  var pairs = 0;
  var k = 0;
  var n = 4;
  var p = 0;

  // *-* public methods *-*

  var init = function() {

    //event click .one 
    $(".buttons button").one("click", eventPlayAgainClicked);
    // *-* utility methods *-*

  };

  var makeHand = function() {

    for (var i = 0; i < 5; i++) {

      // generate random number for the suits between [0,3]
      rs = Math.round(Math.random() * 3);
      // generate random number for the suits between [0,12]

      rc = Math.round(Math.random() * 12);

      // display the random cards for the hand
      hand[i] = "http://h3h.net/images/cards/" + suits[rs] + "_" + cards[rc] + ".svg";

      ncards[i] = cards[rc];

      idcards.push(ncards[i]);

      if (i == 4) {

        pairs = 0;

        ncards.sort();

        for (var j = 1; j < 5; j++) {
          if (ncards[j] == ncards[j - 1]) {

            pairs++;

            if (p == 0) {
              d_pairs1.push(ncards[j]);
            } else {
              d_pairs2.push(ncards[j]);
            }

          }

        }
        p = 1;

        p_pairs.push(pairs);

      }

    }
    console.log(hand);

    if (p_pairs[0] < p_pairs[1]) {
      $(".card2").addClass("hand winning");
      alert("player2 is winner!");
    } else if (p_pairs[0] > p_pairs[1]) {
      $(".card1").addClass("hand winning");
      alert("player1 is winner!");
    }

  };

  // *-* event methods *-*
  var eventPlayAgainClicked = function() {
    makeHand();

    for (var i = 0; i < 5; i++) {
      var src = hand[i],
        img = document.createElement('img');
      img.src = src;
      $('.card1').append(img);
    }

    makeHand();

    for (var i = 0; i < 5; i++) {
      var src = hand[i],
        img = document.createElement('img');
      img.src = src;
      $('.card2').append(img);
    }

    for (k = 1; k < 6; k++) {

      $('.card1 img:nth-child(' + k + ')').attr('id', idcards[k - 1]);

    }

    for (k = 1; k < 6; k++) {

      $('.card2 img:nth-child(' + k + ')').attr('id', idcards[n + k]);

    }

    $(".card1 [id=" + d_pairs1[0] + "]").addClass("card pair0");

    $(".card1 [id=" + d_pairs1[1] + "]").addClass("card pair1");

    $(".card2 [id=" + d_pairs2[0] + "]").addClass("card pair0");

    $(".card2 [id=" + d_pairs2[1] + "]").addClass("card pair1");

  };
  // expose public methods
  return {
    init: init
  };
})(jQuery);

$(document).ready(Poker.init);