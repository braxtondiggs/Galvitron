(function() {
  'use strict';

  $(document).on('submit', 'form:not(".search-form")', function(event) { //Any form submit / All Pages
    $('[data-validator]').each(function() { //find inputs to validate
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
  $(document).on('submit', 'form.search-form', (event) => { //Search Form submit / All Pages
    event.preventDefault();
    window.location.replace('/search/index.html');
  });
  $('.title-input').typeahead({ source: ['VP of Communications', 'VP of Investments', 'VP of Marketing', 'VP of Operations', 'VP of Sales'] }); //Fill type ahead / Profile Edit
  $('.company-input').typeahead({ source: ['Bücker Flugzeugbau', 'Buick', 'BUM Equipment', 'Bushwick Daily', 'Bushwick Kitchen', 'Buw Consulting', 'BUX'] }); //Fill type ahead / Profile Edit
  $('.skill-input').typeahead({ //Fill type ahead / Profile Edit
    source: ['investment banking', 'investment planning'],
    afterSelect: function() { // after selecting a skill from dropdown, clear input and create a new chip / Profile Edit
      $('.chips').append(`<li>${$(this.$element.get(0)).val()}<span class="delete">&times;</span></li>`);
      $(this.$element.get(0)).val('');
    }
  });
  $('.chips').on('click', 'li', function() { //remove profile skill chips / Profile Edit
    $(this).remove();
  });
  $('.user-image').on('click', () => $('input[type="file"]').trigger('click')); //fake clicks input for file upload / Profile Edit
  $('#welcomeModal').modal('show'); //show welcome modal / Profile Edit
  $(document).on('click', 'button.welcome.btn-1', function() { //open 1st & hide 2st welcome popover / Profile View
    $('.profile-view .action-menu').popover('hide');
    $('.right-header .user').popover({
      html: true,
      placement: 'bottom',
      offset: '-150px 0',
      content: function() {
        return $($(this).attr("data-popover-content")).html();
      }
    }).popover('show');
  });
  $(document).on('click', 'button.welcome.btn-2', () => $('.right-header .user').popover('hide')); //hide 2st welcome popover / Profile View
  $('.profile-view .action-menu').popover({ //Open Profile 1st welcome popover / Profile View
    html: true,
    placement: 'bottom',
    offset: '-225px 0',
    content: function() {
      return $($(this).attr("data-popover-content")).html();
    }
  }).popover('show');

  $('.profile-actions').on('change', '#profile-image-upload', function(event) { // Profile Image Upload / Profile Edit
    const file = event.target.files[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onload = (readerEvt) => {
          const userImage = `data:${file.type};base64,${btoa(readerEvt.target.result)}`; // Final Base64 ouput
        };
        reader.readAsBinaryString(file);
      } catch {
        alert('Something went wrong, please try a diffrent image');
      }
    }
  });

  $('.pending nav').on('click', 'a', function(e) { //Pending Tabs / Dashboard Pending
    e.preventDefault()
    $(this).tab('show');
    $(this).parent().siblings('.card-container').hide();
    $($(this).parent().siblings('.card-container').get($(this).index())).show();
  });
  $('.search-card .filter-header .dropdown-menu').on('click', '.dropdown-item, .btn', (e) => e.stopPropagation()); // stop click for filer / Search
  $('.search-card .filter-header .dropdown-menu').on('click', '.btn.btn-secondary', function(e) { // Clear filter dropdown checkbox / Search
    $(this).parent().siblings('.dropdown-item').find('input[type="checkbox"]:checked').prop('checked', false);
    e.stopPropagation();
  });
  $('.dropdown-select.selected-value').on('click', '.dropdown-item', function() { // Add dropdown html to button inner html / Booking
    $(this).parents('.dropdown').find('.btn').html($(this).html()).parent().next('.form-group').children('input[type="hidden"]').val($.trim($(this).text()));
  });

  $('.dropdown-date').on('click', function() {
    $('#datepicker1').Zebra_DatePicker({
      always_visible: $($(this).find('.date-container')),
      direction: true,
      show_clear_date: false,
      show_select_today: false,
      first_day_of_week: 0,
      show_other_months: false,
      onSelect: function(value) {
        console.log('value', value);
      }
    });
  }).on('click', '.date-container', function(e) {
    e.stopPropagation();
  });
})();
