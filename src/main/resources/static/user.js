const userAPI = 'http://localhost:8080/api/user';
const documentAPI = 'http://localhost:8080/api/documents/mail';
const userHeader = document.getElementById("navbar-user");
const userInfo = document.getElementById("user-info");

let currentUserEmail = '';  // Для хранения email текущего пользователя

// Функция для загрузки документов пользователя
function loadUserDocuments() {
    // Логируем URL для диагностики
    console.log(`Fetching documents for user: ${currentUserEmail}`);

    fetch(`${documentAPI}?email=${currentUserEmail}`)
        .then(res => res.json()) // Получаем JSON ответ
        .then(documents => {
            let documentRows = '';
            console.log(documents);  // Логируем все документы

            // Для каждого документа создаем строку таблицы
            documents.forEach(doc => {
                console.log(`Document ID: ${doc.id}, Email: ${doc.email}`); // Логируем каждый документ

                let emailList = '';
                if (doc.email) {
                    // Если email несколько, разделяем их запятой
                    if (doc.email.includes(',')) {
                        emailList = doc.email.split(',').map(email => `<span class="badge bg-primary me-1">${email.trim()}</span>`).join(' ');
                    } else if (doc.email !== 'undefined') { // Если email один и он не 'undefined'
                        emailList = `<span class="badge bg-primary">${doc.email.trim()}</span>`;
                    }
                } else {
                    emailList = '<span class="text-muted">No email</span>'; // Если email отсутствует
                }

                documentRows += `
                    <tr>
                        <td>${doc.id}</td>
                        <td>${doc.title}</td>
                        <td>${doc.department || 'No department'}</td>
                        <td>${new Date(doc.uploadDate).toLocaleString()}</td> <!-- Преобразуем дату -->
                        <td>${emailList}</td> <!-- Здесь выводим email -->
                        <td>
                            <button class="btn btn-sm btn-primary download-btn" data-id="${doc.id}">Download</button>
                            <button class="btn btn-sm btn-danger delete-btn" data-id="${doc.id}">Delete</button>
                        </td>
                    </tr>`;
            });

            // Вставляем строки в таблицу
            $('#document-info').html(documentRows);
        })
        .catch(error => console.error("Failed to load documents:", error)); // Логируем ошибки
}

// Функция для загрузки данных текущего пользователя
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

            // Отображаем информацию о пользователе
            userInfo.innerHTML = `
                <th scope="row">${principal.id}</th>
                <td>${principal.name}</td>
                <td>${principal.surname}</td>
                <td>${principal.age}</td>
                <th>${principal.email}</th>
                <td><span>${roles}</span></td>`;

            currentUserEmail = principal.email;  // Сохраняем email текущего пользователя
            loadUserDocuments();  // Загружаем документы для этого пользователя
        })
        .catch(error => console.error('Error fetching user data:', error));
}

// События загрузки и удаления документов
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

    // Загружаем данные при загрузке страницы
    getUser();
});
