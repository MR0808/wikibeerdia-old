const e = document.querySelector('[data-2fa-form]'),
    t = e?.querySelectorAll('input[type=number]'),
    o = document.getElementById('submit_otp');
let n;
if (e) {
    window.addEventListener('load', () => t[0].focus());
    const e = 6;
    t.forEach((r, u) => {
        r.addEventListener('keyup', (r) => {
            const { value: i } = r.target;
            i
                ? [...i].slice(0, e).forEach((e, o) => {
                      t &&
                          t[u + o] &&
                          ((t[u + o].value = e), t[u + o + 1]?.focus());
                  })
                : ((t[u].value = ''), t[u - 1]?.focus());
            n = [...t].reduce((e, t) => e + (t?.value || ''), '');
            e === n.length
                ? o.removeAttribute('disabled')
                : o.setAttribute('disabled', !0);
        });
    });
}

$(document).on('click', '#submit_otp', function () {
    $('#submit_otp').addClass('loading');
    validateToken();
});

async function validateToken() {
    let jsonData;
    const formData = {
        token: n
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
        } else {
            window.location.replace('/');
        }
    } catch (e) {
        console.log(e.stack);
        alert(e);
        throw new Error(e);
    }
}

const recoveryCodeModal = new tingle.modal({
    footer: true
});

$(document).on('click', '.p_recovery', function () {
    recoveryCodeModal.open();
});

recoveryCodeModal.setContent(
    `<h1>Two-Factor Authentication</h1>
    <hr>
    <h3>Enter one of your recovery codes below</h3>
    <div>Once you have used this recovery code, it will no longer be available.</div>
    <div class="account_form">
        <input type="text" name="code" id="code">
        <p class="hidden form_error_text token_error"><i class="fas fa-exclamation-triangle"></i> Recovery code incorrect</p>
    </div>
    `
);

recoveryCodeModal.addFooterBtn(
    'Close',
    'tingle-btn tingle-btn--default',
    function () {
        recoveryCodeModal.close();
    }
);

recoveryCodeModal.addFooterBtn(
    '<span class="button__text">Confirm</span>',
    'tingle-btn tingle-btn--primary verifyBtn',
    function () {
        $('.verifyBtn').addClass('button--loading');
        $('.button__text').addClass('button__text_hidden');
        validateBackup();
    }
);

async function validateBackup() {
    let jsonData;
    const formData = {
        code: $('#code').val()
    };
    try {
        const returnedData = await fetch('/otp/recovery', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        jsonData = await returnedData.json();
        const data = jsonData.data;
        if (data.result === 'error') {
            $('#code').val('');
            $('.verifyBtn').removeClass('button--loading');
            $('.button__text').removeClass('button__text_hidden');
            $('.token_error').removeClass('hidden');
        } else {
            window.location.replace('/');
        }
    } catch (e) {
        console.log(e.stack);
        alert(e);
        throw new Error(e);
    }
}
