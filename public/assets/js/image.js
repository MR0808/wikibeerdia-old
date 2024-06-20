const logoInput = $('#logo');

logoInput.change(function (e) {
    file = this.files[0];
    if (file) {
        let validExtensions = ['image/jpeg', 'image/jpg', 'image/png'];
        let fileType = file.type;
        if (validExtensions.includes(fileType)) {
            let reader = new FileReader();
            reader.onload = function (event) {
                $('#logoPreview').attr('src', event.target.result);
            };
            reader.readAsDataURL(file);
            $('.hidden').show();
        }
    }
});

$(document).on('click', '.logo-delete', function () {
    $('.hidden').hide();
    logoInput.val('');
});
