const dropArea = document.querySelector('.drag-area');
const dragText = document.querySelector('.drag-header');
const imageArea = document.querySelector('.image-list');
const fileInput = document.getElementById('breweryImages');

let button = dropArea.querySelector('.drag-button');
let input = dropArea.querySelector('.drag-files');
//let file;
let files;
button.onclick = () => {
    input.click();
};

// when browse
input.addEventListener('change', function () {
    files = this.files;
    dropArea.classList.add('active');
    displayFile();
});

// when file is inside drag area
dropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropArea.classList.add('active');
    dragText.textContent = 'Release to Upload';
    // console.log('File is inside the drag area');
});

// when file leave the drag area
dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('active');
    // console.log('File left the drag area');
    dragText.textContent = 'Drag & Drop';
});

// when file is dropped
dropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    // console.log('File is dropped in drag area');
    //file = event.dataTransfer.files[0]; // grab single file even of user selects multiple files
    files = event.dataTransfer.files;
    displayFile();
});

function displayFile() {
    let validExtensions = ['image/jpeg', 'image/jpg', 'image/png'];
    let list = new DataTransfer();
    Array.from(files).forEach((file) => {
        list.items.add(file);
        let fileType = file.type;
        // console.log(fileType);
        if (validExtensions.includes(fileType)) {
            // console.log('This is an image file');
            let fileReader = new FileReader();
            fileReader.onload = () => {
                let fileURL = fileReader.result;
                // console.log(fileURL);
                let imgTag = `<div class="col-xxl-4 col-md-6">
                            <div class="image-item">
                                <img name="uploadImg" id="${file.name}" src="${fileURL}">
                                <ul class="">
                                    <li class="delete-btns">
                                        <i class="far fa-trash-alt"></i>
                                    </li>
                                </ul>
                            </div>
                        </div>`;
                imageArea.innerHTML += imgTag;
            };
            fileReader.readAsDataURL(file);
        }
    });
    fileInput.files = list.files;
}

$(document).on('click', '.delete-btns', function () {
    const imageUrl =
        this.parentNode.parentNode.querySelector('[name=uploadImg]').id;
    const attachments = document.getElementById('breweryImages').files;
    const fileBuffer = new DataTransfer();
    for (let i = 0; i < attachments.length; i++) {
        if (attachments[i].name !== imageUrl) {
            fileBuffer.items.add(attachments[i]);
        }
    }
    document.getElementById('breweryImages').files = fileBuffer.files;
    this.parentNode.parentNode.parentNode.remove();
});
