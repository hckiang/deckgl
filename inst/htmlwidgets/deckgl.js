var deck = window.deck;

(function() {"use strict"; // anonymos start

  HTMLWidgets.widget({

    name: 'deckgl',

    type: 'output',

    factory: function(el, width, height) {

      // TODO: define shared variables for this instance

      return {

        renderValue: function(x) {

          // TODO: code to render the widget, e.g.
          el.innerText = x.message;

        },

        resize: function(width, height) {

          // TODO: code to re-render the widget with a new size

        }

      };
    }
  });

})(); // anonymos end
