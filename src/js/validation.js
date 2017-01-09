   var fdf = fdf || {};
   (function($, window, document, undefined) {

       'use strict';

       $.extend($.expr[":"], {
           attrStartsWith: function(el, idx, selector) {
               var atts = el.attributes;
               for (var i = 0, n = atts.length; i < n; i++) {
                   if (atts[i].nodeName.toLowerCase().indexOf(selector[3].toLowerCase()) === 0) {
                       return true;
                   }
               }
               return false;
           }
       });

       fdf.form = {
           validation: {
               required: function(ele) {
                   var isValid;
                   if (ele.is('select')) {
                       if (ele.parent('.custom-select').length > 0)
                           isValid = !ele.parent('.custom-select').hasClass('not-chosen');
                   } else if (ele.is('input,textarea'))
                       isValid = ele.val().trim().length > 0;
                   return isValid;
               },
               email: function(ele) {
                   var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                   return re.test(ele.val());
               },
               password: function(ele) {
                   return ele.val().trim().length > 7;
               },
               passmatch: function(ele) {
                   var eleToMatch = $(ele.attr('data-rule-passmatch'));
                   return ele.val() === eleToMatch.val();
               },
               length: function(ele) {
                   return ele.val().length == 8;
               },
               minlength: function(ele) {
                   return ele.val().length >= 8;
               },
               maxlength: function(ele) {
                   return ele.val().length <= 8;
               },
               errorField: function(ele, validationtype) {
                   var $errorlbl = $('<label class="error" />').text(ele.attr('data-msg-' + validationtype));

                   if (ele.is('select')) {
                       ele.parent('.custom-select').addClass('error');
                   }
                   if (!ele.next('.error').length > 0) {
                       ele.addClass('error').after($errorlbl);
                   }
                   if (ele.is('select')) {
                       ele.on("change", watchEle);

                   } else if (ele.is('input')) {
                       ele.on("blur", watchEle);

                   }

                   function watchEle(e) {
                       fdf.form.validateFieldByRule(ele, validationtype);
                   }

               },
               validField: function(ele) {
                   if (ele.is('select')) {
                       ele.parent('.custom-select').removeClass('error');
                   }
                   ele.removeClass('error').next('label.error').remove();
               }

           },
           validateForm: function($form) {
               var $elems = $form.find(':attrStartsWith("data-rule")');
               var isValid = true;
               $elems.each(function() {
                   var $this = $(this);
                   var $rules = [];
                   var atts = this.attributes;
                   for (var i = 0, n = atts.length; i < n; i++) {
                       if (/^data-rule-(\w*)/.test(atts[i].nodeName)) {
                           var match = atts[i].nodeName.match(/^data-rule-(\w*)/);
                           if ($this.attr(match[0]) != 'false')
                               $rules.push(match[1]);
                       }
                   }

                   $rules.forEach(function($rule) {
                       isValid = fdf.form.validateFieldByRule($this, $rule) && isValid;
                   });

               });
               return isValid;
           },
           validateFieldByRule: function(field, rule) {
               var eleValid = fdf.form.validation[rule](field);
               if (!eleValid)
                   fdf.form.validation.errorField(field, rule);
               else
                   fdf.form.validation.validField(field);
               return eleValid;
           }
       }
   })(jQuery, window, document);