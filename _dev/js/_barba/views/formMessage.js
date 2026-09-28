export default function FormMessage() {
  this.init = function () {
    window.appEvent.listen('formMessage:ajax:process', function (data, el) {
      $(el).addClass('is-processing');
      $(el).removeClass('form-error');
      $(el).removeClass('form-success');
      $(el).find('[data-form-message-success], [data-form-message-error]').attr('style', '');
    });
    window.appEvent.listen('formMessage:ajax:success', function (data, response, el) {
      $(el).removeClass('is-processing');
      $(el).find('input:not([type="hidden"]), textarea').val('');
      $(el).find('input[type="checkbox"]').prop('checked', false);

      if (response == true || response === 1 || response === '1' || response.success === true) {
        $(el).addClass('form-success');
        $(el).removeClass('form-error');

        if ($(el).find('[data-form-message-success]').length > 0) {
          $(el).find('[data-form-message-success]').slideDown(300, function () {
            setTimeout(() => {
              $(el).find('[data-form-message-success]').slideUp(300);
            }, 3000);
          })
        }
      }
      else {
        $(el).removeClass('form-success');
        $(el).addClass('form-error');

        if ($(el).find('[data-form-message-error]').length > 0) {
          $(el).find('[data-form-message-error]').slideDown(300);
        }
      }
    })
    window.appEvent.listen('formMessage:ajax:error', function (data, el) {
      $(el).removeClass('is-processing');
      $(el).addClass('form-error');
      $(el).removeClass('form-success');
    });
  }
}