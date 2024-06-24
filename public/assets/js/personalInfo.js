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

// Name Edit functions

$(document).on('click', '#submit_name', function () {
    $('#submit_name').addClass('loading');
    submitName();
});

$(document).on('click', '#name', function () {
    if ($('#name').text() === 'Cancel') {
        $('#firstName').removeClass('invalid');
        $('.firstName_error').addClass('hidden');
        $('#lastName').removeClass('invalid');
        $('.lastName_error').addClass('hidden');
        if (firstNameOld) {
            $('#firstName').val(firstNameOld);
        } else {
            $('#firstName').val(null);
        }
        if (lastNameOld) {
            $('#lastName').val(lastNameOld);
        } else {
            $('#lastName').val(null);
        }
    }
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
                $('.firstName_error').removeClass('hidden');
            } else {
                $('#firstName').removeClass('invalid');
                $('.firstName_error').addClass('hidden');
            }
            if (data.errors.find((e) => e.path === 'lastName')) {
                $('#lastName').addClass('invalid');
                $('.lastName_error').removeClass('hidden');
            } else {
                $('#lastName').removeClass('invalid');
                $('.lastName_error').addClass('hidden');
            }
            $('#submit_name').removeClass('loading');
        } else {
            $('.label_name')
                .children('p')
                .text($('#firstName').val() + ' ' + $('#lastName').val());
            $('#firstName').removeClass('invalid');
            $('.firstName_error').addClass('hidden');
            $('#lastName').removeClass('invalid');
            $('.lastName_error').addClass('hidden');
            $('#submit_name').removeClass('loading');
            $('.label_name').toggle();
            $('#name').text('Edit');
            $('.form_name').addClass('hidden');
            $('.button_name').addClass('hidden');
            $('#p_name').removeClass('italic');
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
        $('#gender').removeClass('invalid');
        $('.gender_error').addClass('hidden');
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
            $('.gender_error').removeClass('hidden');
            $('#submit_gender').removeClass('loading');
        } else {
            let gender = $('#gender').val();
            genderOld = gender;
            if ($('#gender').val() === 'NotSay') {
                gender = 'Rather not say';
            }
            $('.label_genderForm').children('p').text(gender);
            $('#gender').removeClass('invalid');
            $('.gender_error').addClass('hidden');
            $('#submit_gender').removeClass('loading');
            $('.label_genderForm').toggle();
            $('#genderForm').text('Edit');
            $('.form_genderForm').addClass('hidden');
            $('.button_genderForm').addClass('hidden');
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
        $('#country').removeClass('invalid');
        $('.country_error').addClass('hidden');
        $('#state').removeClass('invalid');
        $('.state_error').addClass('hidden');
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
                $('.country_error').removeClass('hidden');
            } else {
                $('#country').removeClass('invalid');
                $('.country_error').addClass('hidden');
            }
            if (data.errors.find((e) => e.path === 'state')) {
                $('#state').addClass('invalid');
                $('.state_error').removeClass('hidden');
            } else {
                $('#state').removeClass('invalid');
                $('.state_error').addClass('hidden');
            }
            $('#submit_location').removeClass('loading');
        } else {
            countryOld = $('#country').val();
            stateOld = $('#state').val();
            if (stateOld) {
                $('.label_location')
                    .children('p')
                    .text(
                        $('#state :selected').text() +
                            ', ' +
                            $('#country :selected').text()
                    );
            } else {
                $('.label_location')
                    .children('p')
                    .text($('#country :selected').text());
            }
            $('#country').removeClass('invalid');
            $('.country_error').addClass('hidden');
            $('#state').removeClass('invalid');
            $('.state_error').addClass('hidden');
            $('#submit_location').removeClass('loading');
            $('.label_location').toggle();
            $('#location').text('Edit');
            $('.form_location').addClass('hidden');
            $('.button_location').addClass('hidden');
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

$('#dateOfBirth').pickadate({
    selectYears: 100,
    selectMonths: true,
    max: maxDate,
    formatSubmit: 'yyyy-mm-dd',
    hiddenName: true,
    today: ''
});

$(document).on('click', '#dob', function () {
    const dobPicker = $('#dateOfBirth').pickadate();
    const picker = dobPicker.pickadate('picker');
    if ($('#dob').text() === 'Cancel') {
        $('#dateOfBirth').removeClass('invalid');
        $('.dob_error').addClass('hidden');
        if (dobOld) {
            picker.set('select', new Date(dobOld));
        } else {
            picker.clear();
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
        dateOfBirth: $('[name="dateOfBirth"]').val()
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
            $('#dateOfBirth').addClass('invalid');
            $('.dob_error').removeClass('hidden');
            $('#submit_dob').removeClass('loading');
        } else {
            let dob = DateTime.fromISO($('[name="dateOfBirth"]').val());
            dobOld = $('[name="dateOfBirth"]').val();
            $('.label_dob')
                .children('p')
                .text(dob.toLocaleString(DateTime.DATE_FULL));
            $('#dateOfBirth').removeClass('invalid');
            $('.dob_error').addClass('hidden');
            $('#submit_dob').removeClass('loading');
            $('.label_dob').toggle();
            $('#dob').text('Edit');
            $('.form_dob').addClass('hidden');
            $('.button_dob').addClass('hidden');
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

// profile picture Edit functions

const profileInput = $('#profilePicture');

profileInput.change(function (e) {
    file = this.files[0];
    if (file) {
        let validExtensions = ['image/jpeg', 'image/jpg', 'image/png'];
        let fileType = file.type;
        if (validExtensions.includes(fileType)) {
            let reader = new FileReader();
            reader.onload = function (event) {
                $('#profilePicHolder').attr('src', event.target.result);
            };
            reader.readAsDataURL(file);
        }
    }
});

$(document).on('click', '#submit_profile', function () {
    $('#submit_profile').addClass('loading');
    submitProfile();
});

async function submitProfile() {
    let jsonData;
    const input = document.getElementById('profilePicture');
    const formData = new FormData();
    formData.append('profilePicture', input.files[0]);
    try {
        const returnedData = await fetch('/account/personal-info/profile', {
            method: 'POST',
            body: formData
        });
        jsonData = await returnedData.json();
        const data = jsonData.data;
        if (data.result === 'error') {
            $('#profilePicHolder').addClass('invalid');
            $('.profile_error').removeClass('hidden');
            $('#submit_profile').removeClass('loading');
        } else {
            $('#profilePicHolder').removeClass('invalid');
            $('.profile_error').addClass('hidden');
            $('#submit_profile').removeClass('loading');
            $('#formNotification').text('Profile picture successfully updated');
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

const removeModal = new tingle.modal({
    footer: true
});

// set content
removeModal.setContent('Are you sure you wish to remove your profile picture?');

// add a button
removeModal.addFooterBtn(
    'Remove',
    'tingle-btn tingle-btn--primary',
    async function () {
        try {
            await fetch('/account/personal-info/removeprofile', {
                method: 'POST'
            });
            $('#formNotification').text('Profile picture successfully removed');
            $('#formNotification').fadeIn();
            setTimeout(function () {
                $('#formNotification').fadeOut();
            }, 2000);
            $('#profilePicHolder').attr('src', '/assets/images/profile.jpg');
            removeModal.close();
        } catch (e) {
            alert(e);
            throw new Error(e);
        }
    }
);

// add another button
removeModal.addFooterBtn(
    'Cancel',
    'tingle-btn tingle-btn--default',
    function () {
        removeModal.close();
    }
);

$(document).on('click', '.remove_link', function () {
    removeModal.open();
});
