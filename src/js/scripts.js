  var fdf = fdf || {};
  (function($, window, document, undefined) {

      'use strict';
      $('.language-control').on('click', function() {
          $(this).toggleClass('arabic');
          var arabicStyle = $('<link rel="stylesheet">').attr('href', 'assets/css/style-ar.min.css');
          var englishStyle = $('<link rel="stylesheet">').attr('href', 'assets/css/style.min.css');
          if ($(this).hasClass('arabic')) {
              $('head').append(arabicStyle);
              $('head').find('link[href $="style.min.css"]').remove();
          } else {
              $('head').append(englishStyle);
              $('head').find('link[href $="style-ar.min.css"]').remove();
          }
      });

      function resizeFlex() {
          var flexItemHeight = $(window).height() - $('header').outerHeight(true) - $('footer').outerHeight(true);
          $('.flexbox-wrapper').css({
              'min-height': flexItemHeight + 'px'
          });
          $('footer').css({
              opacity: '1'
          });
      }
      $(function() {
          resizeFlex();
          $(window).on('resize', resizeFlex);
      });
      $('.email-field').on('blur', function() {
          var $th = $(this);
          var $url = $(this).data('weburl') + '/_vti_bin/FDFAM/Login/Login.svc/CheckEmail?emailid=' + $(this).val() + '&weburl=' + $(this).data('weburl');

          $.ajax({
              url: $url,
              method: 'GET',
              success: function(result) {
                  console.log(result);
                  if (result) {
                      $th.closest('.form-validate').find('.error-box').addClass('visible');
                  } else {
                      $th.closest('.form-validate').find('.error-box').removeClass('visible');
                  }

              },
              error: function() {
                  console.log('error');
              }
          });
      });
      $('.action-buttons').on('click', '.reset', function() {
          var $form = $(this).closest('.form-validate');
          $form.find('input,textarea,select').each(function() {
              var $th = $(this);
              $th.removeClass('error');
              if ($th.is('input,textarea')) {
                  if ($th.is('input[type="radio"]')) {
                      $th.closest('.radiobox').find('input[type="radio"]').eq(0).get(0).checked = true;
                  } else if ($th.parent('[data-provide="datepicker"]').length > 0) {
                      $th.val('');
                      $th.parent('[data-provide="datepicker"]').removeData('datepicker');
                  } else {
                      $th.val('');
                  }
              } else if ($th.is('select')) {

                  $th.parent('.custom-select').addClass('not-chosen').removeClass('error');
                  $th.val($th.find('option:first').val());
                  if ($th.parent().hasClass('entity-type')) {
                      $th.attr('disabled', true).parent().addClass('disabled');
                  }
              }
          });

          $form.find('label.error').remove();
      });

      $('.action-buttons').on('click', '.prev,.next', function() {
          var $this = $(this);
          if ($this.hasClass('disabled')) {
              return false;
          }

          var $wizard = $this.closest('.wizard');

          var $tabLinks = $('.wizard-link', $wizard);
          var $tabPages = $('.wizard-page', $wizard);

          if ($(this).hasClass('next')) {
              var valid = fdf.form.validateForm($(this).closest('.form-validate'));
              if (!valid) {
                  return false;
              } else {
                  var $form = $(this).closest('.form-validate');
                  var $text = $('.form-text', $form);
                  if ($text.length > 0) {
                      $text.find('.enter-message').removeClass('visible');
                      $text.find('.success-message').addClass('visible').find('.email-add').text($form.find('input[type="email"]').val());
                  }
              }
          }
          var curTabIndex = $tabLinks.filter(function() {
              return $(this).hasClass('active');
          }).index();
          var newTabIndex = $(this).hasClass('prev') ? curTabIndex - 1 : curTabIndex + 1;
          $tabLinks.removeClass('active activated').eq(newTabIndex).addClass('active').prevAll('.wizard-link').addClass('activated');
          $tabPages.removeClass('active activated');
          if (curTabIndex === 0) {

              var $formInd = $wizard.find('.wizard-pages')[0].getAttribute('data-regTypeIndex');
              $('.tab-wrappers[data-formIndex=' + $formInd + '] .wizard-page').eq(newTabIndex - 1).addClass('active');
              $tabPages.eq(0).addClass('activated');
          } else if (newTabIndex > 0) {

              $this.closest('.tab-wrappers').find('.wizard-page').eq(newTabIndex - 1).addClass('active').prevAll('.wizard-page').addClass('activated');
              $tabPages.eq(0).addClass('activated');
          } else if (newTabIndex === 0) {

              $tabPages.eq(newTabIndex).addClass('active');
          }

      });


      var readURL = function(input) {
          if (input.files && input.files[0]) {
              var reader = new FileReader();

              reader.onload = function(e) {
                  $('.profile-thumbnail img').attr('src', e.target.result);
              };

              reader.readAsDataURL(input.files[0]);
          }
      };
      $(document).on('change', 'input[type="file"]', function() {

          var filename = $(this).val().replace(/C:\\fakepath\\/i, '');
          $(this).siblings('input.file-explorer').val(filename).removeClass('error');
          $(this).siblings('.browse-link').addClass('added');
          if ($(this).hasClass('showthumb')) {
              readURL(this);
          }
      });


      $('.choose-type').on('change', function() {
          var $th = $(this);
          var $val = $th.find('select').val();
          $th.closest('.wizard-pages')[0].setAttribute('data-regTypeIndex', $val);
          $th.closest('.wizard-pages').find('.tab-wrappers[data-formindex=' + $val + ']').addClass('show').siblings('.tab-wrappers').removeClass('show');
          var ajaxUrl = $th.data('weburl') + '/_vti_bin/FDFAM/Login/Login.svc/GetSubtypes?selectedvalue=' + $val + '&weburl=' + $th.data('weburl') + '&lcid=' + $th.data('lcid');
          $.ajax({
              url: ajaxUrl,
              method: 'GET',
              success: function(result) {
                  console.log(result);
                  $('.entity-type').removeClass('disabled').find('select').attr('disabled', false).html('<option value=""selected disabled>Select</option>');
                  result.forEach(function(e) {
                      var $opt = $('<option value=' + e + '>' + e + '</option>');
                      $('.entity-type select').append($opt);
                  });
              },
              error: function() {
                  console.log('error');
              }
          });

      });

      $('.custom-select select').on('change', function() {
          $(this).closest('.custom-select').removeClass('not-chosen');
      });

      $('.radiobox.date-select input[type="radio"]').on('change', function() {
          var val = $(this).val();
          console.log(val);
          $(this).closest('.date-select').siblings('.between-dates,.particular-date').removeClass('visible');
          $('.' + val).addClass('visible');
      });

      $('.select-award-btn').on('click', function() {
          $(this).closest('main').find('.modal').addClass('visible');
          $('body').addClass('modalOpen');
      });
      $('.modal').on('click', '.cancel-modal', function() {
          $(this).closest('.modal').removeClass('visible');
          $('body').removeClass('modalOpen');
      });

      $('.modal').on('click', '.select-all,.clear-all', function() {
          var $th = $(this);
          var $table = $(this).closest('.modal-table');
          var checkboxes = $('input[type="checkbox"]', $table);

          checkboxes.each(function() {
              if ($th.hasClass('select-all')) {
                  console.log($(this).prop('checked'));
                  $(this).prop('checked', true);
              } else {
                  $(this).prop('checked', false);
              }
          });
      });


      $('.modal').on('click', '.submit-modal', function() {
          var $th = $(this);
          var $form = $th.closest('.form-validate');
          var checkboxes = $('input[type="checkbox"]:checked', $form);
          $(this).closest('.modal').removeClass('visible');
          $('body').removeClass('modalOpen');
          var $filters = $('.selected-awards').html('');
          checkboxes.each(function() {

              var $a = $('<a href="javascript:void(0)" class="gray-button rounded filter-item" />');
              var $span = $('<span class ="text-uppercase"></span>').html($(this).next('label').text());
              $a.append($span);
              $filters.append($a);
          });


      });


  })(jQuery, window, document);