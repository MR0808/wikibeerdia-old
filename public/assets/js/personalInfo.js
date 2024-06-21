// Generic form open and closer

$(document).on('click', '.edit_link', function () {
    const form = this.id;
    $('.label_' + form).toggle();
    if ($('.form_' + form).css('display') === 'none') {
        $('#' + form).text('Cancel');
        switch (form) {
            case 'name':
            case 'location':
                $('.form_' + form).css('display', 'flex');
                break;
            case 'genderForm':
            case 'dob':
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
    minimumResultsForSearch: 10
});

$('#state').select2({
    placeholder: 'Select a state',
    minimumResultsForSearch: 10
});

$('#country').trigger('change');
$('#state').trigger('change');

$(document).on('click', '#location', function () {
    if ($('#location').text() === 'Cancel') {
        if (countryOld) {
            $('#country').val(countryOld).trigger('change');
            if (!stateOld) {
                getStates(countryOld);
            }
        } else {
            $('#country').val(null).trigger('change');
            clearStates();
        }
        if (stateOld) {
            $('#state').val(stateOld).trigger('change');
        } else {
            $('#state').val(null).trigger('change');
        }
    }
});

function clearStates() {
    let html = '<option></option>';
    document.getElementById('state').innerHTML = html;
    $('#state').val(null).trigger('change');
}

$('#country').on('change', function (event) {
    if ($('#country').val()) {
        getStates(this.value);
    }
});

async function getStates(countryId) {
    let jsonStates;
    try {
        const formData = {
            country: countryId
        };
        const returnedStates = await fetch('/config/getStates', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        jsonStates = await returnedStates.json();
        states = jsonStates.data;
    } catch (e) {
        alert(e);
        throw new Error(e);
    }

    let html = '<option></option>';
    for (let state of states) {
        html += '<option value="' + state._id + '">' + state.name + '</option>';
    }

    document.getElementById('state').innerHTML = html;
    if (stateOld) {
        $('#state').val(stateOld).trigger('change');
    }
}

$(document).on('click', '#submit_location', function () {
    $('#submit_location').addClass('loading');
    submitLocation();
});

async function submitLocation() {
    let jsonData;
    const formData = {
        country: $('#country').val(),
        state: $('#state').val()
    };
    try {
        const returnedData = await fetch('/account/personal-info/location', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        jsonData = await returnedData.json();
        const data = jsonData.data;
        if (data.result === 'error') {
            if (data.errors.find((e) => e.path === 'country')) {
                $('#country').addClass('invalid');
                $('.country_error').show();
            }
            if (data.errors.find((e) => e.path === 'state')) {
                $('#state').addClass('invalid');
                $('.state_error').show();
            }
            $('#submit_location').removeClass('loading');
        } else {
            countryOld = $('#country').val();
            stateOld = $('#state').val();
            $('.label_location')
                .children('p')
                .text(
                    $('#state :selected').text() +
                        ', ' +
                        $('#country :selected').text()
                );
            $('#country').removeClass('invalid');
            $('.country_error').hide();
            $('#state').removeClass('invalid');
            $('.lstate_error').hide();
            $('#submit_location').removeClass('loading');
            $('.label_location').toggle();
            $('#location').text('Edit');
            $('.form_location').css('display', 'none');
            $('.button_location').css('display', 'none');
            $('#formNotification').text('Location successfully updated');
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

// Date of Birth Edit functions

const DateTime = luxon.DateTime;
let maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() - 18);

$('#dateOfBirth').flatpickr({
    altInput: true,
    altFormat: 'j F, Y',
    dateFormat: 'Y-m-d',
    maxDate: maxDate
});

$(document).on('click', '#dob', function () {
    const fp = flatpickr('#dateOfBirth', {});
    if ($('#dob').text() === 'Cancel') {
        if (dobOld) {
            fp.setDate(dobOld);
            console.log(fp.config);
            fp.set('altInput', true);
        } else {
            fp.clear();
            fp.set('altInput', true);
        }
    }
});

$(document).on('click', '#submit_dob', function () {
    $('#submit_dob').addClass('loading');
    submitDob();
});

async function submitDob() {
    let jsonData;
    const formData = {
        dateOfBirth: $('#dateOfBirth').val()
    };
    try {
        const returnedData = await fetch('/account/personal-info/dob', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        jsonData = await returnedData.json();
        const data = jsonData.data;
        if (data.result === 'error') {
            $('.form-control').addClass('invalid');
            $('.dob_error').show();
            $('#submit_dob').removeClass('loading');
        } else {
            let dob = DateTime.fromISO($('#dateOfBirth').val());
            dobOld = $('#dateOfBirth').val();
            $('.label_dob')
                .children('p')
                .text(dob.toLocaleString(DateTime.DATE_FULL));
            $('.form-control').removeClass('invalid');
            $('.dob_error').hide();
            $('#submit_dob').removeClass('loading');
            $('.label_dob').toggle();
            $('#dob').text('Edit');
            $('.form_dob').css('display', 'none');
            $('.button_dob').css('display', 'none');
            $('#p_dob').removeClass('italic');
            $('#formNotification').text('Date of birth successfully updated');
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
