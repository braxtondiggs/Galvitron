(function() {
  'use strict';

  $(document).on('submit', 'form:not(".search-form")', function(event) { //Any form submit / All Pages
    $('[data-validator]').each(function() { //find inputs to validate
      new Validator($(this), {
        language: {
          same: 'Passwords must match',
          file_size : '{label} can\'t be larger than {param0}Mb',
          skills: '{label} must have atleast {param0}'
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
    window.location.replace('../search/index.html');
  });
  $('.title-input').typeahead({ source: ['VP of Communications', 'VP of Investments', 'VP of Marketing', 'VP of Operations', 'VP of Sales'] }); //Fill type ahead / Profile Edit
  $('.company-input').typeahead({ source: ['Bücker Flugzeugbau', 'Buick', 'BUM Equipment', 'Bushwick Daily', 'Bushwick Kitchen', 'Buw Consulting', 'BUX'] }); //Fill type ahead / Profile Edit
  $('.skill-input').typeahead({ //Fill type ahead / Profile Edit
    source: ['investment banking', 'investment planning'],
    autoSelect: false,
  	selectOnBlur: false,
    afterSelect: function() { // after selecting a skill from dropdown, clear input and create a new chip / Profile Edit
      const chips = $('.chips').text().split('×').map((el) => el.trim());
      if (!chips.includes($(this.$element.get(0)).val())) {
        $('.chips').append(`<li>${$(this.$element.get(0)).val()}<span class="delete">&times;</span></li>`);
        $('#skills-input').val($('.chips').text());
      }
      $(this.$element.get(0)).val('');
    }
  });
  $('#skills-input').val($('.chips').text());
  $('.chips').on('click', 'li', function() { //remove profile skill chips / Profile Edit
    $(this).remove();
    $('#skills-input').val($('.chips').text());
  });
  $('.profile-actions .user-image').on('click', () => $('input[type="file"]').trigger('click')); //fake clicks input for file upload / Profile Edit
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

  $(document).on('click', 'button.info-popover:not(.active)', function() {
    $(this).addClass('active');
    $(this).popover({
      html: true,
      placement: 'bottom',
      offset: '2, -38',
      container: $(this).parent('.input-wrapper'),
      content: function() {
        return $($(this).attr("data-popover-content")).html();
      }
    }).popover('show').on('hidden.bs.popover', function() {
      $(this).removeClass('active');
    });
  }).on('click', '.skill-info-wrapper .close', function() {
    $(this).parents('.input-wrapper').children('.info-popover').popover('hide')
  });

  $('.profile-actions').on('change', '#profile-image-upload', function(event) { // Profile Image Upload / Profile Edit
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (readerEvt) => {
        const userImage = `data:${file.type};base64,${btoa(readerEvt.target.result)}`; // Final Base64 ouput
        $('.profile-actions img.user').prop('src', userImage).siblings('.helper-text').hide();
      };
      reader.readAsBinaryString(file);
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
    updateAvailableTimes($(this).find('.time-container li'));
    $(this).find('input').Zebra_DatePicker({
      always_visible: $($(this).find(`.${$(this).find('input').prop('id')}_dropdown .calendar`)),
      direction: true,
      show_clear_date: false,
      show_select_today: false,
      first_day_of_week: 0,
      show_other_months: false,
      onSelect: function(value) {
        console.log('value', value);
        updateAvailableTimes($(this).parents('.dropdown-select').find('.time-container li'), value.replace(/(\d{4})\-(\d{2})\-(\d{2}).*/, '$1/$2/$3'));
      }
    });
  }).on('click', '.date-container', function(e) {
    e.stopPropagation();
  }).on('click', '.time-container li', function(e) {
    $(this).siblings().removeClass('active').end().addClass('active');
    let time = $(this).text();
  }).on('click', '.time-container li, .dp_daypicker td', function() {
    const dropdown = $(this).parents('.dropdown-select');
    const time = dropdown.find('.time-container li.active');
    const date = dropdown.find('.dp_daypicker td.dp_selected');
    if (date.length && time.length) {
      const dateValue = dropdown.children('input[type="hidden"]').val().replace(/(\d{4})\-(\d{2})\-(\d{2}).*/, '$2/$3/$1');
      dropdown.children('.dropdown-toggle').dropdown('toggle').text(`${dateValue} ${$(time).text()}`);
    }
  });

  function updateAvailableTimes(timeRef, date = new Date().toJSON().slice(0, 10).replace(/-/g, '/')) {
    $.each(timeRef, function(i, elem) {
      $(elem).show();
      if (Date.parse(`${date} ${convertTime($(elem).text())}`) < new Date()) $(elem).hide();
    });
  }

  function convertTime(t) {
    const split_time = t.split(':');
    return t.indexOf('p') > -1 && parseInt(split_time[0]) !== 12 ? `${(parseInt(split_time[0]) + 12).toString()}:${split_time[1].slice(0, -1)}` : t.slice(0, -1);
  }

  $('.readmore').each(function() {
    const content = $(this).text();
    const charLimit = 300;
    if(content.length > charLimit) {
      var c = content.substr(0, charLimit);
      var h = content.substr(charLimit, content.length - charLimit);
      $(this).html(`${c}<span class="hidden">${h}</span> <b class="action more">read more…</b></span>`);
    }
  }).on('click', '.action', function() {
    $(this).hasClass('more') ? $(this).toggleClass('more less').text('read less') : $(this).toggleClass('less more').text('read more…');
    $(this).prev().toggle();
  });

  Validator.prototype.file_size = function (fileSize) {
    return $('#profile-image-upload').get(0).files[0].size/1024/1024 <= fileSize;
  };
  Validator.prototype.skills = function (skillsSize) {
    return $('.chips li').length >= skillsSize;
  };
})();
