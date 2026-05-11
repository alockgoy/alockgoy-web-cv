(function ($) {
    "use strict";

    $(".navbar-nav a").on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            $('html, body').animate({ scrollTop: $(this.hash).offset().top - 30 }, 1500, 'easeInOutExpo');
            if ($(this).parents('.navbar-nav').length) {
                $('.navbar-nav .active').removeClass('active');
                $(this).closest('a').addClass('active');
            }
        }
    });

    if ($('.header h2').length == 1) {
        var typed_strings = $('.header .typed-text').text();
        var typed = new Typed('.header h2', {
            strings: typed_strings.split(', '),
            typeSpeed: 100,
            backSpeed: 20,
            smartBackspace: false,
            loop: true
        });
    }

    $('.skills').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, { offset: '80%' });

    var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });

    $('#portfolio-flters li').on('click', function () {
        $("#portfolio-flters li").removeClass('filter-active');
        $(this).addClass('filter-active');
        portfolioIsotope.isotope({ filter: $(this).data('filter') });
    });

    $('.review-slider').slick({
        autoplay: true, dots: false, infinite: true,
        slidesToShow: 1, slidesToScroll: 1
    });

    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });

    function showContactModal(title, message, isSuccess) {
        $('#contactFormModal').remove();

        const borderClass = isSuccess ? 'border-success' : 'border-danger';
        const btnClass    = isSuccess ? 'btn-success'    : 'btn-danger';

        $('body').append(`
            <div class="modal fade" id="contactFormModal" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content ${borderClass}">
                        <div class="modal-header">
                            <h5 class="modal-title">${title}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">${message}</div>
                        <div class="modal-footer">
                            <button type="button" class="btn ${btnClass}" data-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>`);

        const $modal = $('#contactFormModal');
        $modal.modal('show');
        $modal.on('hidden.bs.modal', function () {
            $(this).remove();
        });
    }

    $('#contactForm').on('submit', async function (event) {
        event.preventDefault();

        try {
            const response = await fetch(this.action, {
                method: 'POST',
                body: new FormData(this)
            });
            const result = await response.json();
            showContactModal(
                response.ok && result.success ? 'Mensaje enviado' : 'Atención',
                result.message || 'No se pudo completar la operación.',
                response.ok && result.success
            );
            if (response.ok && result.success) this.reset();
        } catch (error) {
            showContactModal('Error', 'Se produjo un error al enviar el mensaje. Inténtalo de nuevo.', false);
        }
    });

})(jQuery);