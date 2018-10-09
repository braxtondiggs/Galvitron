(function() {
  'use strict';

  $(document).on('submit', 'form', function(event) {
    $('[data-validator]').each(function() {
      new Validator($(this), {
        language: {
          same: 'Passwords must match'
        }
      });
    });
    if ($(this).find('.has-error').length === 0) {
      alert('valid');
    } else {
      event.preventDefault();
    }
  });
  $('.title-input').typeahead({ source: ['VP of Communications', 'VP of Investments', 'VP of Marketing', 'VP of Operations', 'VP of Sales'] });
  $('.company-input').typeahead({ source: ['Bücker Flugzeugbau', 'Buick', 'BUM Equipment', 'Bushwick Daily', 'Bushwick Kitchen', 'Buw Consulting', 'BUX'] });
  $('.skill-input').typeahead({ source: ['investment banking', 'investment planning'] });
})();
