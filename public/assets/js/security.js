$(document).on('click', '.edit_link', function () {
    const form = this.id;
    $('.label_' + form).toggle();
    if ($('.form_' + form).css('display') === 'none') {
        $('#' + form).text('Cancel');
        $('.form_' + form).removeClass('hidden');
        $('.button_' + form).removeClass('hidden');
    } else {
        $('#' + form).text('Edit');
        $('.form_' + form).addClass('hidden');
        $('.button_' + form).addClass('hidden');
    }
});

// Email Edit functions

$(document).on('click', '#emailForm', function () {
    if ($('#emailForm').text() === 'Cancel') {
        $('#email').removeClass('invalid');
        $('.email_error').addClass('hidden');
        if (emailOld) {
            $('#email').val(emailOld);
        } else {
            $('#email').val(null);
        }
    }
});

$(document).on('click', '#submit_emailForm', function () {
    if ($('#email').val() !== emailOld) {
        $('#submit_emailForm').addClass('loading');
        submitEmail();
    } else {
        $('.label_emailForm').toggle();
        $('#emailForm').text('Edit');
        $('.form_emailForm').addClass('hidden');
        $('.button_emailForm').addClass('hidden');
    }
});

async function submitEmail() {
    let jsonData;
    const formData = {
        email: $('#email').val()
    };
    try {
        const returnedData = await fetch('/account/security/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        jsonData = await returnedData.json();
        const data = jsonData.data;
        if (data.result === 'error') {
            $('#email').addClass('invalid');
            $('.form_emailForm').children('p').text(data.errors[0].msg);
            $('.email_error').removeClass('hidden');
            $('#submit_emailForm').removeClass('loading');
        } else {
            let email = $('#email').val();
            emailOld = $('#email').val();
            $('.label_emailForm')
                .children('p')
                .html(
                    email +
                        '<span>Unverified</span><div id="resend">Resend email</div>'
                );
            $('#email').removeClass('invalid');
            $('.email_error').addClass('hidden');
            $('#submit_emailForm').removeClass('loading');
            $('.label_emailForm').toggle();
            $('#emailForm').text('Edit');
            $('.form_emailForm').addClass('hidden');
            $('.button_emailForm').addClass('hidden');
            emailModal.open();
            // $('#formNotification').text('emasuccessfully updated');
            // $('#formNotification').fadeIn();
            // setTimeout(function () {
            //     $('#formNotification').fadeOut();
            // }, 2000);
        }
    } catch (e) {
        alert(e);
        throw new Error(e);
    }
}

const emailModal = new tingle.modal({
    footer: true
});

// set content
emailModal.setContent(
    'Your email has been updated. Please check your email as you will need to verify your new email.'
);

// add a button
emailModal.addFooterBtn('Okay', 'tingle-btn tingle-btn--primary', function () {
    emailModal.close();
});

$(document).on('click', '#resend', function () {
    resendEmail();
    emailModal.setContent(
        'Your verification email has been resent. Please check your email.'
    );
    emailModal.open();
});

async function resendEmail() {
    try {
        await fetch('/account/security/resendEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        emailModal.open();
    } catch (e) {
        alert(e);
        throw new Error(e);
    }
}
