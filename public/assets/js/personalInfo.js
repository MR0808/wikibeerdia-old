$(document).on('click', '.edit_link', function () {
    const form = this.id;
    $('.label_' + form).toggle();
    if ($('.form_' + form).css('display') === 'none') {
        $('#' + form).text('Cancel');
        $('.form_' + form).css('display', 'flex');
        $('.button_' + form).css('display', 'flex');
    } else {
        $('#' + form).text('Edit');
        $('.form_' + form).css('display', 'none');
        $('.button_' + form).css('display', 'none');
    }
});

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
        } else {
            $('#firstName').removeClass('invalid');
            $('.firstName_error').hide();
            $('#lastName').removeClass('invalid');
            $('.lastName_error').hide();
        }
    } catch (e) {
        alert(e);
        throw new Error(e);
    }
}
