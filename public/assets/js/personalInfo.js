// Generic form open and closer

$(document).on('click', '.edit_link', function () {
    const form = this.id;
    $('.label_' + form).toggle();
    if ($('.form_' + form).css('display') === 'none') {
        $('#' + form).text('Cancel');
        if (form == 'name') {
            $('.form_' + form).css('display', 'flex');
        } else {
            $('.form_' + form).css('display', 'block');
        }
        $('.button_' + form).css('display', 'flex');
    } else {
        $('#' + form).text('Edit');
        $('.form_' + form).css('display', 'none');
        $('.button_' + form).css('display', 'none');
    }
});

// Name Edit functions

$(document).on('click', '#submit_name', function () {
    $('#submit_name').addClass('loading');
    submitName();
});

async function submitName() {
    let jsonData;
    const formData = {
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val()
    };
    try {
        const returnedData = await fetch('/account/personal-info/name', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        jsonData = await returnedData.json();
        const data = jsonData.data;
        if (data.result === 'error') {
            if (data.errors.find((e) => e.path === 'firstName')) {
                $('#firstName').addClass('invalid');
                $('.firstName_error').show();
            }
            if (data.errors.find((e) => e.path === 'lastName')) {
                $('#lastName').addClass('invalid');
                $('.lastName_error').show();
            }
            $('#submit_name').removeClass('loading');
        } else {
            $('.label_name')
                .children('p')
                .text($('#firstName').val() + ' ' + $('#lastName').val());
            $('#firstName').removeClass('invalid');
            $('.firstName_error').hide();
            $('#lastName').removeClass('invalid');
            $('.lastName_error').hide();
            $('#submit_name').removeClass('loading');
            $('.label_name').toggle();
            $('#name').text('Edit');
            $('.form_name').css('display', 'none');
            $('.button_name').css('display', 'none');
            $('#formNotification').text('Name successfully updated');
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

// Gender edit functions

$('#gender').select2({
    placeholder: 'Select a gender',
    minimumResultsForSearch: 10
});

$('#gender').trigger('change');

$(document).on('click', '#genderForm', function () {
    if ($('#genderForm').text() === 'Cancel') {
        if (genderOld) {
            $('#gender').val(genderOld).trigger('change');
        } else {
            $('#gender').val(null).trigger('change');
        }
    }
});

$(document).on('click', '#submit_gender', function () {
    $('#submit_gender').addClass('loading');
    submitGender();
});

async function submitGender() {
    let jsonData;
    const formData = {
        gender: $('#gender').val()
    };
    try {
        const returnedData = await fetch('/account/personal-info/gender', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        jsonData = await returnedData.json();
        const data = jsonData.data;
        if (data.result === 'error') {
            $('#gender').addClass('invalid');
            $('.gender_error').show();
            $('#submit_gender').removeClass('loading');
        } else {
            let gender = $('#gender').val();
            genderOld = gender;
            if ($('#gender').val() === 'NotSay') {
                gender = 'Rather not say';
            }
            $('.label_genderForm').children('p').text(gender);
            $('#gender').removeClass('invalid');
            $('.gender_error').hide();
            $('#submit_gender').removeClass('loading');
            $('.label_genderForm').toggle();
            $('#genderForm').text('Edit');
            $('.form_genderForm').css('display', 'none');
            $('.button_genderForm').css('display', 'none');
            $('#p_genderForm').removeClass('italic');
            $('#formNotification').text('Gender successfully updated');
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

// Location Edit functions

$('#country').select2({
    placeholder: 'Select a country',
    minimumResultsForSearch: 10,
    allowClear: true
});

$('#state').select2({
    placeholder: 'Select a state',
    minimumResultsForSearch: 10,
    allowClear: true
});

$('#country').trigger('change');
$('#state').trigger('change');

$(document).on('click', '#location', function () {
    if ($('#location').text() === 'Cancel') {
        if (countryOld) {
            $('#country').val(countryOld).trigger('change');
        } else {
            $('#country').val(null).trigger('change');
        }
        if (stateOld) {
            $('#state').val(stateOld).trigger('change');
        } else {
            $('#state').val(null).trigger('change');
        }
    }
});
