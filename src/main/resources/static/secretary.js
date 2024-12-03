const userAPI = 'http://localhost:8080/api/secretary';
const documentAPI = 'http://localhost:8080/api/documents';
const userHeader = document.getElementById("navbar-user");
const userInfo = document.getElementById("user-info");
const emailInput = document.getElementById('email');
const suggestionsList = document.getElementById('email-suggestions');
const selectedEmailsContainer = document.getElementById('selected-emails');
let selectedEmails = [];

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
                        <th scope="row">${principal.id}</th>
                        <td>${principal.name}</td>
                        <td>${principal.surname}</td>
                        <th>${principal.email}</th>
                        <td><span>${roles}</span></td>`;

            // После получения email вызываем функцию для загрузки документов
            loadDocumentsIncoming(principal.email); // Передаем email для загрузки документов
            loadDocumentsSender(principal.email); // Загружаем отправленные документы
        })
        .catch(error => console.error("Error fetching user data:", error)); // Логирование ошибки
}

// Функция для загрузки входящих документов
function loadDocumentsIncoming(userEmail) {
    console.log("Loading incoming documents for email:", userEmail); // Логирование email
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
                        </td>
                    </tr>`;
            });
            $('#document-incoming-list').html(documentRows);
        })
        .catch(error => console.error("Error loading incoming documents:", error)); // Логирование ошибки
}

// Функция для загрузки отправленных документов
function loadDocumentsSender(userEmail) {
    console.log("Loading sent documents for email:", userEmail); // Логирование email
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
                        </td>
                    </tr>`;
            });
            $('#document-sent-list').html(documentRows);
        })
        .catch(error => console.error("Error loading sent documents:", error)); // Логирование ошибки
}

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
