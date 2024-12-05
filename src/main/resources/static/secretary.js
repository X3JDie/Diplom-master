const userAPI = 'http://localhost:8080/api/secretary';
const documentAPI = 'http://localhost:8080/api/documents';
const userHeader = document.getElementById("navbar-user");
const userInfo = document.getElementById("user-info");
const emailInput = document.getElementById('email');
const suggestionsList = document.getElementById('email-suggestions');
const selectedEmailsContainer = document.getElementById('selected-emails');
let selectedEmails = [];
let currentPage = 0;
const pageSize = 20;

// Функция для получения данных пользователя
function getUser() {
    fetch(userAPI)
        .then(res => res.json())
        .then(principal => {
            console.log("User data:", principal); // Логирование данных пользователя
            let roles = "";
            principal.roles.forEach(value => {
                roles += value.name + " ";
            });

            // Отображение данных пользователя
            userHeader.innerHTML = `<span class="fw-bolder">${principal.email}</span>
                    <span> with roles: </span>
                    <span>${roles}</span>`;
            userInfo.innerHTML = `
<!--                        <th scope="row">${principal.id}</th>-->
                        <td>${principal.name}</td>
                        <td>${principal.surname}</td>
                        <th>${principal.email}</th>
<!--                        <td><span>${roles}</span></td>-->`;

            // После получения email вызываем функцию для загрузки документов
            loadDocumentsIncoming(principal.email); // Передаем email для загрузки документов
            loadDocumentsSender(principal.email); // Загружаем отправленные документы
        })
        .catch(error => console.error("Error fetching user data:", error)); // Логирование ошибки
}

// Функция для загрузки входящих документов
function loadDocumentsIncoming(userEmail ) {
    fetch(`/api/documents/incoming?email=${userEmail}`)
        .then(res => res.json())
        .then(documents => {
            let documentRows = '';
            documents.forEach(doc => {
                documentRows += `
                    <tr>
                        <td>${doc.id}</td>
                        <td>${doc.title}</td>
                        <td>${doc.email}</td>
                        <td>${doc.emailSender}</td>
                        <td>${new Date(doc.uploadDate).toLocaleString()}</td>
                        <td>${doc.status}</td>
                        <td>
                            <button class="btn btn-sm btn-primary download-btn" data-id="${doc.id}">Download</button>
                            <button class="btn btn-sm btn-danger delete-btn" data-id="${doc.id}">Delete</button>
                            <button class="btn btn-sm btn-warning forward-btn" data-id="${doc.id}">Forward</button>
                        </td>
                    </tr>`;
            });
            $('#document-incoming-list').html(documentRows); // Обновляем таблицу входящих документов
        })
        .catch(error => console.error("Failed to load documents:", error));
}

// Функция для загрузки отправленных документов
function loadDocumentsSender(userEmail) {
    fetch(`/api/documents/sent?emailSender=${userEmail}`)
        .then(res => res.json())
        .then(documents => {
            let documentRows = '';
            documents.forEach(doc => {
                documentRows += `
                    <tr>
                        <td>${doc.id}</td>
                        <td>${doc.title}</td>
                        <td>${doc.email}</td>
                        <td>${doc.emailSender}</td>
                        <td>${new Date(doc.uploadDate).toLocaleString()}</td>
                        <td>${doc.status}</td>
                        <td>
                            <button class="btn btn-sm btn-primary download-btn" data-id="${doc.id}">Download</button>
                            <button class="btn btn-sm btn-danger delete-btn" data-id="${doc.id}">Delete</button>
                            <button class="btn btn-sm btn-warning forward-btn" data-id="${doc.id}">Forward</button>
                        </td>
                    </tr>`;
            });
            $('#document-sent-list').html(documentRows); // Обновляем таблицу отправленных документов
        })
        .catch(error => console.error("Failed to load documents:", error));
}

document.getElementById('forward-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const documentId = document.getElementById('document-to-forward').value;
    const recipientEmail = document.getElementById('forward-email').value;

    // Получаем email текущего пользователя
    const emailSender = document.querySelector('#navbar-user span.fw-bolder').textContent;

    // Создаем объект для отправки
    const forwardData = {
        documentId: documentId,
        emailSender: emailSender,
        recipientEmail: recipientEmail
    };

    // Отправляем запрос на сервер
    fetch('/api/documents/forward', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(forwardData)
    })
        .then(response => {
            if (response.ok) {
                alert('Document forwarded successfully.');
                $('#forward-modal').modal('hide'); // Закрываем модальное окно
                document.getElementById('forward-email').value = ''; // Очищаем поле ввода

                // Перезагружаем страницу
                location.reload(); // Обновляем страницу, чтобы отобразились изменения
            } else {
                alert('Error forwarding document.');
            }
        })
        .catch(error => console.error('Error forwarding document:', error));
});


$(document).on('click', '.forward-btn', function () {
    const docId = $(this).data('id');

    // Открытие модального окна для ввода email получателя
    $('#forward-modal').modal('show');
    $('#document-to-forward').val(docId); // Устанавливаем ID документа в скрытое поле

});
// Функция для загрузки списка пользователей
function loadUsers() {
    const userListAPI = 'http://localhost:8080/api/user/all';
    fetch(userListAPI)
        .then(res => res.json())
        .then(users => {
            const recipientSelect = document.getElementById('recipient');
            recipientSelect.innerHTML = ''; // Очищаем список перед заполнением
            users.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = `${user.name} (${user.email})`;
                recipientSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Failed to load users:", error)); // Логирование ошибки
}

$('#upload-form').on('submit', function (event) {
    event.preventDefault();

    const formData = new FormData();
    const files = $('#files')[0].files;  // Получаем все выбранные файлы

    // Добавляем каждый файл в FormData
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);  // 'files' будет массивом на сервере
    }

    formData.append('title', $('#title').val());  // Заголовок
    formData.append('email', $('#email').val());  // Почта (поле из формы)

    // Получаем email текущего пользователя и добавляем в FormData
    const userEmail = document.querySelector('#navbar-user span.fw-bolder').textContent; // Пытаемся получить email текущего пользователя из header
    formData.append('emailSend', userEmail);  // Используем email текущего пользователя для отправки документа


    // Отправка формы через fetch
    fetch(documentAPI + '/upload', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (response.ok) {
                alert('Documents uploaded successfully.');
                const userEmail = document.querySelector('#navbar-user span.fw-bolder').textContent; // Получаем email текущего пользователя

            } else {
                alert('Error uploading documents.');
            }
        })
        .catch(error => {
            console.error('Error uploading documents:', error);
        });
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
                const userEmail = document.querySelector('#navbar-user span.fw-bolder').textContent; // Получаем email текущего пользователя
                loadDocumentsIncoming(userEmail);
                loadDocumentsSender(userEmail);
            } else {
                alert('Error deleting document.');
            }
        })
        .catch(error => console.error('Error deleting document:', error));
});

// Функция для получения подсказок по email
async function getEmailSuggestions(query) {
    if (query.length < 3) {
        suggestionsList.innerHTML = '';
        return; // Не показываем подсказки, если введено меньше 3 символов
    }

    try {
        const response = await fetch(`http://localhost:8080/api/user/email-suggestions?query=${query}`);
        const suggestions = await response.json();
        showSuggestions(suggestions);
    } catch (error) {
        console.error('Error fetching email suggestions:', error);
    }
}

// Функция для отображения подсказок
function showSuggestions(suggestions) {
    suggestionsList.innerHTML = ''; // Очищаем список перед добавлением новых подсказок

    suggestions.forEach(email => {
        const suggestionItem = document.createElement('div');
        suggestionItem.textContent = email;
        suggestionItem.classList.add('suggestion-item', 'p-2', 'border', 'mb-1', 'cursor-pointer');
        suggestionItem.onclick = () => addEmail(email);
        suggestionsList.appendChild(suggestionItem);
    });
}

// Функция для добавления email в список выбранных
function addEmail(email) {
    if (!selectedEmails.includes(email)) {
        selectedEmails.push(email);
        updateSelectedEmails();
    }
    emailInput.value = ''; // Очищаем поле ввода
    suggestionsList.innerHTML = ''; // Очищаем подсказки
}

// Функция для отображения выбранных email
function updateSelectedEmails() {
    selectedEmailsContainer.innerHTML = '';
    selectedEmails.forEach(email => {
        const emailBadge = document.createElement('span');
        emailBadge.classList.add('badge', 'bg-secondary', 'me-2', 'position-relative');
        emailBadge.textContent = email;

        const removeButton = document.createElement('span');
        removeButton.classList.add('position-absolute', 'top-0', 'end-0', 'text-danger', 'cursor-pointer');
        removeButton.innerHTML = '&times;';
        removeButton.onclick = () => removeEmail(email);

        emailBadge.appendChild(removeButton);
        selectedEmailsContainer.appendChild(emailBadge);
    });
}

// Функция для удаления email из списка выбранных
function removeEmail(email) {
    selectedEmails = selectedEmails.filter(e => e !== email);
    updateSelectedEmails();
}

// Слушаем событие ввода в поле
emailInput.addEventListener('input', function () {
    const query = this.value;
    getEmailSuggestions(query); // Получаем подсказки, когда пользователь что-то вводит
});

// Загрузка пользователей и документов при загрузке страницы
$(document).ready(function () {
    loadUsers(); // Загружаем список пользователей
    getUser();   // Получаем данные пользователя

    // Загрузка документов после загрузки страницы
    const principalEmail = document.getElementById('email').value;
    loadDocumentsIncoming(principalEmail);
    loadDocumentsSender(principalEmail);
});
