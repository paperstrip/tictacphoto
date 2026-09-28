window.filters = new (function () {

  this.ajax = function () {
    const $container = $('[data-barba-namespace]:last-child');

    // Helper: always resolve the form fresh so stale references after
    // Barba navigation never point to the wrong archive's action URL.
    const liveForm = () => $('[data-barba-namespace]:last-child [data-ajax-filter]');

    // Pagination — delegated on container (survives form replaceWith)
    $container.off('click.filterPage').on('click.filterPage', '[data-page]', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const $f  = liveForm();
      const page = $(e.currentTarget).attr('data-page');
      const data = $f.serialize() + '&page=' + encodeURIComponent(page);
      this.inject($f.attr('action') + '?' + data);
    });

    // Any checkbox / radio change → sync parent↔child, then reload
    $container.off('change.filterInput').on('change.filterInput', '[data-ajax-filter] input[type="checkbox"], [data-ajax-filter] input[type="radio"]', (e) => {
      const $input = $(e.currentTarget);
      const $label = $input.closest('.filter-dropdown__item');

      if ($label.hasClass('filter-dropdown__item--parent')) {
        // Parent toggled → uncheck all its children to avoid double IDs in URL
        let $sib = $label.next();
        while ($sib.length && $sib.hasClass('filter-dropdown__item--sub')) {
          $sib.find('input[type="checkbox"]').prop('checked', false);
          $sib = $sib.next();
        }
      } else if ($label.hasClass('filter-dropdown__item--sub')) {
        // Child toggled → uncheck the parent so it isn't serialized alongside
        $label.prevAll('.filter-dropdown__item--parent').first()
              .find('input[type="checkbox"]').prop('checked', false);
      }

      const $f = liveForm();
      this.inject($f.attr('action') + '?' + $f.serialize());
    });

    this.initDropdowns();
  }

  this.initDropdowns = function () {
    const $form = $('[data-barba-namespace]:last-child [data-ajax-filter]');

    // Toggle open / close
    $form.find('[data-filter-trigger]').off('click.fd').on('click.fd', (e) => {
      e.stopPropagation();
      const $dropdown = $(e.currentTarget).closest('[data-filter-dropdown]');
      const wasOpen   = $dropdown.hasClass('is-open');
      $form.find('[data-filter-dropdown]').removeClass('is-open');
      if (!wasOpen) $dropdown.addClass('is-open');
    });

    // Close button inside panel
    $form.find('[data-filter-close]').off('click.fd').on('click.fd', (e) => {
      $(e.currentTarget).closest('[data-filter-dropdown]').removeClass('is-open');
    });

    // Reset all
    $form.find('[data-filter-reset]').off('click.fd').on('click.fd', () => {
      $form.find('[data-filter-dropdown]').removeClass('is-open is-active');
      this.inject($form.attr('action'));
    });

    // Close on outside click
    $(document).off('click.filterDropdown').on('click.filterDropdown', (e) => {
      if (!$(e.target).closest('[data-filter-dropdown]').length) {
        $('[data-barba-namespace]:last-child [data-ajax-filter] [data-filter-dropdown]').removeClass('is-open');
      }
    });
  }

  this.inject = function (url) {
    return new Promise((resolve) => {
      // Remember which dropdown is open so we can restore it after inject
      const $ns         = $('[data-barba-namespace]:last-child');
      const $allBefore  = $ns.find('[data-ajax-filter] [data-filter-dropdown]');
      const $openBefore = $allBefore.filter('.is-open');
      const openIndex   = $openBefore.length ? $allBefore.index($openBefore) : -1;

      $('body').addClass('is-loading');
      window.barbaInstance.history.add(url, 'barba');

      $.ajax({
        url:  url,
        type: 'GET',
        success: (html) => {
          $('body').removeClass('is-loading');

          // Wrap in a div so .find() reliably traverses the full response
          const $parsed = $('<div>').html(html);
          const $ns     = $('[data-barba-namespace]:last-child');

          $ns.find('[data-ajax-content]').html($parsed.find('[data-ajax-content]').html());
          $ns.find('[data-ajax-pagination]').html($parsed.find('[data-ajax-pagination]').html());
          $ns.find('[data-ajax-filter]').replaceWith($parsed.find('[data-ajax-filter]'));

          window.imageLoader.lazy('.container');
          window.imageReplace.replace();
          window.scrollAnimation.update();
          appEvent.trigger('app:ajaxInjected');

          // Re-init listeners on the new form
          window.filters.ajax();

          // Reopen the dropdown that was open before the inject
          if (openIndex >= 0) {
            $('[data-barba-namespace]:last-child [data-ajax-filter] [data-filter-dropdown]')
              .eq(openIndex)
              .addClass('is-open');
          }

          resolve(true);
        },
        error: (err) => {
          console.error('[filters] inject error', err);
          $('body').removeClass('is-loading');
          resolve(false);
        }
      });
    });
  }

})
