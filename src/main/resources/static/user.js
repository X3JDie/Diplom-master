const userAPI = 'http://localhost:8080/api/user';
const documentAPI = 'http://localhost:8080/api/documents/mail';
const userHeader = document.getElementById("navbar-user");
const userInfo = document.getElementById("user-info");

let currentUserEmail = '';  // Для хранения email текущего пользователя

function loadUserDocuments() {
    fetch(`${documentAPI}?email=${currentUserEmail}`)
        .then(res => res.json())
        .then(documents => {
            let documentRows = '';
            documents.forEach(doc => {
                documentRows += `
                    <tr>
                        <td>${doc.id}</td>
                        <td>${doc.title}</td>
                        <td>${doc.description}</td>
                        <td>${doc.status}</td>
                        <td>
                            <button class="btn btn-sm btn-primary download-btn" data-id="${doc.id}">Download</button>
                            <button class="btn btn-sm btn-danger delete-btn" data-id="${doc.id}">Delete</button>
                        </td>
                    </tr>`;
            });
            $('#document-info').html(documentRows);  // Заполняем таблицу с документами
        })
        .catch(error => console.error("Failed to load documents:", error));
}

function getUser() {
    fetch(userAPI)
        .then(res => res.json())
        .then(principal => {
            let roles = "";
            principal.roles.forEach(value => {
                roles += value.name + " ";
            });
            userHeader.innerHTML = `<span class="fw-bolder">${principal.email}</span>
            <span> with roles: </span>
            <span>${roles}</span>`;
            userInfo.innerHTML = `
                <th scope="row">${principal.id}</th>
                <td>${principal.name}</td>
                <td>${principal.surname}</td>
                <td>${principal.age}</td>
                <th>${principal.email}</th>
                <td>
                    <span>${roles}</span></td>`;

            currentUserEmail = principal.email;  // Сохраняем email текущего пользователя
            loadUserDocuments();  // Загружаем документы для этого пользователя
        })
        .catch(error => console.error('Error fetching user data:', error));
}

$(document).ready(function () {
    // Upload document
    $('#upload-form').on('submit', function (event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append('file', $('#file')[0].files[0]);
        formData.append('title', $('#title').val());
        formData.append('description', $('#description').val());
        formData.append('email', currentUserEmail);  // Отправляем email вместе с документом

        fetch(documentAPI, {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (response.ok) {
                    alert('Document uploaded successfully.');
                    loadUserDocuments();  // Перезагружаем документы для текущего пользователя
                } else {
                    alert('Error uploading document.');
                }
            })
            .catch(error => console.error('Error uploading document:', error));
    });

    // Download document
    $(document).on('click', '.download-btn', function () {
        const docId = $(this).data('id');
        window.location.href = `${documentAPI}/${docId}/download`;
    });

    // Delete document
    $(document).on('click', '.delete-btn', function () {
        const docId = $(this).data('id');
        fetch(`${documentAPI}/${docId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    alert('Document deleted successfully.');
                    loadUserDocuments();  // Перезагружаем список документов для текущего пользователя
                } else {
                    alert('Error deleting document.');
                }
            })
            .catch(error => console.error('Error deleting document:', error));
    });

    // Загрузка документов при загрузке страницы
    loadUserDocuments();
});

getUser();
