new DataTable('#dt-breweryTypes');

const editModal = document.getElementById('editTypeModal');
editModal.addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget;
    const id = button.getAttribute('data-bs-id');
    const name = button.getAttribute('data-bs-name');
    const method = button.getAttribute('data-bs-method');
    const modalTitle = editModal.querySelector('.modal-title');

    if (method === 'edit') {
        modalTitle.textContent = 'Edit Brewery Type';
        editModal.querySelector('#updateButton').textContent = 'Update';
    } else {
        modalTitle.textContent = 'Add Brewery Type';
        editModal.querySelector('#updateButton').textContent = 'Add';
    }
    editModal.querySelector('#method').value = method;
    editModal.querySelector('#name').value = name;
    editModal.querySelector('#oldName').value = name;
    editModal.querySelector('#id').value = id;
});

$(document).on('click', '#updateButton', function () {
    if ($('#name').val() !== $('#oldName').val()) {
        $('#updateButton').text('');
        $('#updateButton').addClass('loading');
        // submitBreweryType();
    }
});

async function submitBreweryType() {
    let jsonData;
    const formData = {
        type: $('#name').val(),
        method: $('#method').val(),
        id: $('#id').val()
    };
    try {
        const returnedData = await fetch('/admin/brewery-types', {
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
