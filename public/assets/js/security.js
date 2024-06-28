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

// Username Edit functions

$(document).on('click', '#usernameForm', function () {
    if ($('#usernameForm').text() === 'Cancel') {
        $('#username').removeClass('invalid');
        $('.username_error').addClass('hidden');
        $('#submit_username').prop('disabled', true);
        if (usernameOld) {
            $('#username').val(usernameOld);
        } else {
            $('#username').val(null);
        }
    }
});

$(document).on('click', '#check_username', function () {
    if ($('#username').val() && $('#username').val() !== usernameOld) {
        $('#check_username').addClass('loading');
        checkUsername();
    } else if ($('#username').val() && $('#username').val() === usernameOld) {
        $('.username_error').html(
            '<i class="fas fa-check-square"></i> Username is available, update your changes'
        );
        $('.username_error').addClass('valid');
        $('.username_error').removeClass('hidden');
        $('#submit_username').prop('disabled', false);
    }
});

async function checkUsername() {
    let jsonData;
    const formData = { username: $('#username').val() };
    try {
        const returnedData = await fetch('/checkUsername', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        jsonData = await returnedData.json();
        const data = jsonData.data;
        $('#check_username').removeClass('loading');
        if (data.result === 'error') {
            $('.username_error').html(
                '<i class="fas fa-exclamation-triangle"></i> Username is taken, please try again'
            );
            $('.username_error').removeClass('valid');
            $('.username_error').removeClass('hidden');
            $('#submit_username').prop('disabled', true);
        } else {
            $('.username_error').html(
                '<i class="fas fa-check-square"></i> Username is available, update your changes'
            );
            $('.username_error').addClass('valid');
            $('.username_error').removeClass('hidden');
            $('#submit_username').prop('disabled', false);
        }
    } catch (e) {
        alert(e);
        throw new Error(e);
    }
}

$(document).on('click', '#submit_username', function () {
    if ($('#username').val() !== usernameOld) {
        $('#submit_username').addClass('loading');
        submitUsername();
    } else {
        $('.label_usernameForm').toggle();
        $('#usernameForm').text('Edit');
        $('.form_usernameForm').addClass('hidden');
        $('.button_usernameForm').addClass('hidden');
    }
});

async function submitUsername() {
    let jsonData;
    const formData = {
        username: $('#username').val()
    };
    try {
        const returnedData = await fetch('/account/security/username', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        jsonData = await returnedData.json();
        const data = jsonData.data;
        if (data.result === 'error') {
            $('#username').addClass('invalid');
            $('.form_usernameForm').children('p').text(data.errors[0].msg);
            $('.username_error').removeClass('hidden');
            $('#submit_usernameForm').removeClass('loading');
        } else {
            let username = $('#username').val();
            usernameOld = $('#username').val();
            $('.label_usernameForm').children('p').text(username);
            $('#username').removeClass('invalid');
            $('.username_error').addClass('hidden');
            $('#submit_usernameForm').removeClass('loading');
            $('.label_usernameForm').toggle();
            $('#usernameForm').text('Edit');
            $('.form_usernameForm').addClass('hidden');
            $('.button_usernameForm').addClass('hidden');
            $('#formNotification').text('Username successfully updated');
            $('#formNotification').fadeIn();
            setTimeout(function () {
                $('#formNotification').fadeOut();
            }, 2000);
        }
    } catch (e) {
        alert(e);
        throw new Error(e);
    }
}

// Setup OTP

$(document).on('click', '#setup_otp', function () {
    generateOtp();
});

async function generateOtp() {
    let jsonData;
    try {
        const returnedData = await fetch('/otp/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        jsonData = await returnedData.json();
        const data = jsonData.data;
        $('#qrcode').html('');
        new QRCode(document.getElementById('qrcode'), {
            text: data.otpauth_url
        });
        $('#secretKey').text('Secret Key: ' + data.base32);
        setupOtpModal.open();
    } catch (e) {
        console.log(e.stack);
        alert(e);
        throw new Error(e);
    }
}

const setupOtpModal = new tingle.modal({
    footer: true
});

setupOtpModal.setContent(
    `<h1>Two-Factor Authentication</h1>
    <hr>
    <h3>Configuring Google Authenticator or Authy</h3>
    <ol>
        <li>1. Install Google Authenticator or Authy.</li>
        <li>2. In the authenticator app, select '+' icon.</li>
        <li>3. Select 'Scan a barcode (or QR code)' and use the phone's camera ot scane this barcode.</li>
    </ol>
    <h3>Scan QR Code</h3>
    <div id="qrcode" class="qrcode"></div>
    <h3>Or enter code into your app:</h3>
    <p id="secretKey"></p>
    <h3>Verify Code</h3>
    <div>Please enter the code below to verify that the authentication worked:</div>
    <div class="account_form">
        <input type="text" name="token" id="token">
        <p class="hidden form_error_text token_error"><i class="fas fa-exclamation-triangle"></i> Verification token incorrect</p>
    </div>
    `
);

setupOtpModal.addFooterBtn(
    'Close',
    'tingle-btn tingle-btn--default',
    function () {
        setupOtpModal.close();
    }
);

setupOtpModal.addFooterBtn(
    '<span class="button__text">Verify</span>',
    'tingle-btn tingle-btn--primary verifyBtn',
    function () {
        $('.verifyBtn').addClass('button--loading');
        $('.button__text').addClass('button__text_hidden');
        verifyOtp();
    }
);

async function verifyOtp() {
    let jsonData;
    const formData = {
        token: $('#token').val()
    };
    try {
        const returnedData = await fetch('/otp/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        jsonData = await returnedData.json();
        const data = jsonData.data;
        if (data.result === 'error') {
            $('#token').addClass('invalid');
            $('.token_error').removeClass('hidden');
            $('.verifyBtn').removeClass('button--loading');
            $('.button__text').removeClass('button__text_hidden');
        } else {
            $('#backupcodes').html(makeUL(data.recoveryCodes));
            $('.button_otp').addClass('hidden');
            $('.button_disable_otp').removeClass('hidden');
            $('.tan').removeClass('hidden');
            setupOtpModal.close();
            otpVerifiedModal.open();
            $('.verifyBtn').removeClass('button--loading');
            $('.button__text').removeClass('button__text_hidden');
        }
    } catch (e) {
        console.log(e.stack);
        alert(e);
        throw new Error(e);
    }
}

const otpVerifiedModal = new tingle.modal({
    footer: true
});

otpVerifiedModal.setContent(
    `<h1>Two-Factor Authentication</h1>
    <hr>
    <h3>Verification Confirmed</h3>
    <p>Two factor authentication has been enabled.</p>
    <p>Please copy your backup codes below as these will not be possible to retrieve again</p>
    <div id="backupcodes"></div>
    `
);

otpVerifiedModal.addFooterBtn(
    'Close',
    'tingle-btn tingle-btn--default',
    function () {
        otpVerifiedModal.close();
    }
);

function makeUL(array) {
    // Create the list element:
    var list = document.createElement('ul');

    for (var i = 0; i < array.length; i++) {
        // Create the list item:
        var item = document.createElement('li');

        // Set its contents:
        item.appendChild(document.createTextNode(array[i]));

        // Add it to the list:
        list.appendChild(item);
    }

    // Finally, return the constructed list:
    return list;
}

$(document).on('click', '#disable_otp', function () {
    otpDisableModal.open();
});

const otpDisableModal = new tingle.modal({
    footer: true
});

otpDisableModal.setContent(
    `<h1>Two-Factor Authentication</h1>
    <hr>
    <p>Are you sure you wish to disable two-factor authentication?</p>
    `
);

otpDisableModal.addFooterBtn(
    'Close',
    'tingle-btn tingle-btn--default',
    function () {
        setupOtpModal.close();
    }
);

otpDisableModal.addFooterBtn(
    '<span class="button__text">Confirm</span>',
    'tingle-btn tingle-btn--primary disableBtn',
    function () {
        $('.disableBtn').addClass('button--loading');
        $('.button__text').addClass('button__text_hidden');
        disableOtp();
    }
);

async function disableOtp() {
    try {
        await fetch('/otp/disable', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        $('.button_otp').removeClass('hidden');
        $('.button_disable_otp').addClass('hidden');
        $('.tan').addClass('hidden');
        otpDisableModal.close();
        $('.disableBtn').removeClass('button--loading');
        $('.button__text').removeClass('button__text_hidden');
    } catch (e) {
        console.log(e.stack);
        alert(e);
        throw new Error(e);
    }
}

$(document).on('click', '#reset_codes', function () {
    $('#reset_codes').removeClass('reset');
    $('#reset_codes').addClass('loading');
    $('#reset_codes').addClass('button-left');
    resetCodes();
});

async function resetCodes() {
    try {
        const returnedData = await fetch('/otp/resetcodes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        jsonData = await returnedData.json();
        const data = jsonData.data;
        $('#resetbackupcodes').html(makeUL(data.recoveryCodes));
        resetCodesModal.open();
        $('#reset_codes').addClass('reset');
        $('#reset_codes').removeClass('loading');
        $('#reset_codes').removeClass('button-left');
    } catch (e) {
        console.log(e.stack);
        alert(e);
        throw new Error(e);
    }
}

const resetCodesModal = new tingle.modal({
    footer: true
});

resetCodesModal.setContent(
    `<h1>Two-Factor Authentication</h1>
    <hr>
    <h3>Recovery Codes</h3>
    <p>Your recovery codes have been reset.</p>
    <p>Please copy your backup codes below as these will not be possible to retrieve again</p>
    <div id="resetbackupcodes"></div>
    `
);

resetCodesModal.addFooterBtn(
    'Close',
    'tingle-btn tingle-btn--default',
    function () {
        resetCodesModal.close();
    }
);
