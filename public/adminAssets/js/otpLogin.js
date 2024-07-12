(function () {
    const inputs = document.querySelectorAll('#otp-input input');

    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];

        input.addEventListener('input', function () {
            // handling normal input
            if (input.value.length == 1 && i + 1 < inputs.length) {
                inputs[i + 1].focus();
            }

            // if a value is pasted, put each character to each of the next input
            if (input.value.length > 1) {
                // sanitise input
                if (isNaN(input.value)) {
                    input.value = '';
                    updateInput();
                    return;
                }

                // split characters to array
                const chars = input.value.split('');

                for (let pos = 0; pos < chars.length; pos++) {
                    // if length exceeded the number of inputs, stop
                    if (pos + i >= inputs.length) break;

                    // paste value
                    let targetInput = inputs[pos + i];
                    targetInput.value = chars[pos];
                }

                // focus the input next to the last pasted character
                let focus_index = Math.min(inputs.length - 1, i + chars.length);
                inputs[focus_index].focus();
            }
            updateInput();
        });

        input.addEventListener('keydown', function (e) {
            // backspace button
            if (e.keyCode == 8 && input.value == '' && i != 0) {
                // shift next values towards the left
                for (let pos = i; pos < inputs.length - 1; pos++) {
                    inputs[pos].value = inputs[pos + 1].value;
                }

                // clear previous box and focus on it
                inputs[i - 1].value = '';
                inputs[i - 1].focus();
                updateInput();
                return;
            }

            // delete button
            if (e.keyCode == 46 && i != inputs.length - 1) {
                // shift next values towards the left
                for (let pos = i; pos < inputs.length - 1; pos++) {
                    inputs[pos].value = inputs[pos + 1].value;
                }

                // clear the last box
                inputs[inputs.length - 1].value = '';
                input.select();
                e.preventDefault();
                updateInput();
                return;
            }

            // left button
            if (e.keyCode == 37) {
                if (i > 0) {
                    e.preventDefault();
                    inputs[i - 1].focus();
                    inputs[i - 1].select();
                }
                return;
            }

            // right button
            if (e.keyCode == 39) {
                if (i + 1 < inputs.length) {
                    e.preventDefault();
                    inputs[i + 1].focus();
                    inputs[i + 1].select();
                }
                return;
            }
        });
    }

    function updateInput() {
        let inputValue = Array.from(inputs).reduce(function (otp, input) {
            otp += input.value.length ? input.value : ' ';
            return otp;
        }, '');
        document.querySelector('input[name=otp]').value = inputValue;
        if (inputs.length === inputValue.trim().length) {
            $('#submit_otp').prop('disabled', false);
        } else {
            $('#submit_otp').prop('disabled', true);
        }
    }
})();

$(document).on('click', '#submit_otp', function () {
    $('#submit_otp').addClass('loading');
    $('#submit_otp').text('');
    validateToken();
});

async function validateToken() {
    let jsonData;
    const formData = {
        token: $('#otp').val()
    };
    try {
        const returnedData = await fetch('/otp/validate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        jsonData = await returnedData.json();
        const data = jsonData.data;
        if (data.result === 'error') {
            $('.login_error').removeClass('hidden');
            $('#submit_otp').removeClass('loading');
            $('#submit_otp').text('Continue');
        } else {
            window.location.replace('/admin');
        }
    } catch (e) {
        console.log(e.stack);
        alert(e);
        throw new Error(e);
    }
}

// const recoveryCodeModal = new tingle.modal({
//     footer: true
// });

// $(document).on('click', '.p_recovery', function () {
//     recoveryCodeModal.open();
// });

// recoveryCodeModal.setContent(
//     `<h1>Two-Factor Authentication</h1>
//     <hr>
//     <h3>Enter one of your recovery codes below</h3>
//     <div>Once you have used this recovery code, it will no longer be available.</div>
//     <div class="account_form">
//         <input type="text" name="code" id="code">
//         <p class="hidden form_error_text token_error"><i class="fas fa-exclamation-triangle"></i> Recovery code incorrect</p>
//     </div>
//     `
// );

// recoveryCodeModal.addFooterBtn(
//     'Close',
//     'tingle-btn tingle-btn--default',
//     function () {
//         recoveryCodeModal.close();
//     }
// );

// recoveryCodeModal.addFooterBtn(
//     '<span class="button__text">Confirm</span>',
//     'tingle-btn tingle-btn--primary verifyBtn',
//     function () {
//         $('.verifyBtn').addClass('button--loading');
//         $('.button__text').addClass('button__text_hidden');
//         validateBackup();
//     }
// );

// async function validateBackup() {
//     let jsonData;
//     const formData = {
//         code: $('#code').val()
//     };
//     try {
//         const returnedData = await fetch('/otp/recovery', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(formData)
//         });
//         jsonData = await returnedData.json();
//         const data = jsonData.data;
//         if (data.result === 'error') {
//             $('#code').val('');
//             $('.verifyBtn').removeClass('button--loading');
//             $('.button__text').removeClass('button__text_hidden');
//             $('.token_error').removeClass('hidden');
//         } else {
//             window.location.replace('/');
//         }
//     } catch (e) {
//         console.log(e.stack);
//         alert(e);
//         throw new Error(e);
//     }
// }
