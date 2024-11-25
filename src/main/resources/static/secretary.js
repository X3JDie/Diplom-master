const userAPI = 'http://localhost:8080/api/secretary';
const userHeader = document.getElementById("navbar-user");
const userInfo = document.getElementById("user-info");



//start


// Функция для получения подсказок по email
async function getEmailSuggestions(query) {
    if (query.length < 3) {
        document.getElementById('email-suggestions').innerHTML = '';
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
    const suggestionsList = document.getElementById('email-suggestions');
    suggestionsList.innerHTML = ''; // Очищаем список перед добавлением новых подсказок

    suggestions.forEach(email => {
        const suggestionItem = document.createElement('div');
        suggestionItem.textContent = email;
        suggestionItem.onclick = () => selectEmail(email);
        suggestionsList.appendChild(suggestionItem);
    });
}

// Функция для выбора email из подсказок
function selectEmail(email) {
    document.getElementById('email').value = email; // Устанавливаем выбранный email в поле ввода
    document.getElementById('email-suggestions').innerHTML = ''; // Очищаем список подсказок
}

// Слушаем событие ввода в поле
document.getElementById('email').addEventListener('input', function () {
    const query = this.value;
    getEmailSuggestions(query); // Получаем подсказки, когда пользователь что-то вводит
});



// end








function getUser() {
    fetch(userAPI)
        .then(res => res.json())
        .then(principal => {
            let roles = "";
            principal.roles.forEach(value => {
                roles += value.name + " "
            });
            userHeader.innerHTML = `<span class="fw-bolder">${principal.email}</span>
                    <span> with roles: </span>
                    <span>${roles}</span>`;
            userInfo.innerHTML = `
                        <th scope="row">${principal.id}</th>
                        <td>${principal.name}</td>
                        <td>${principal.surname}</td>
                        <th>${principal.email}</th>
                        <td>
                            <span>${roles}</span></td>`;
        });

    $(document).ready(function () {
        const documentAPI = 'http://localhost:8080/api/documents';

        // Функция для загрузки списка пользователей
        function loadUsers() {
            const userListAPI = 'http://localhost:8080/api/user/all'; // URL для получения списка пользователей
            fetch(userListAPI)
                .then(res => res.json())
                .then(users => {
                    const recipientSelect = document.getElementById('recipient');
                    recipientSelect.innerHTML = ''; // Очищаем список перед заполнением
                    users.forEach(user => {
                        const option = document.createElement('option');
                        option.value = user.id; // ID пользователя
                        option.textContent = `${user.name} (${user.email})`; // Имя и email
                        recipientSelect.appendChild(option);
                    });
                })
                .catch(error => console.error("Failed to load users:", error));
        }

// Добавьте вызов loadUsers при загрузке страницы
        $(document).ready(function () {
            loadUsers(); // Загружаем список пользователей
            loadDocuments(); // Загружаем документы
        });



        // Функция для загрузки списка документов
        function loadDocuments() {
            fetch(documentAPI)
                .then(res => res.json())
                .then(documents => {
                    let documentRows = '';
                    documents.forEach(doc => {
                        documentRows += `
                        <tr>
                            <td>${doc.id}</td>
                            <td>${doc.title}</td>
                            <td>${doc.department}</td>
                            <td>${new Date(doc.uploadDate).toLocaleString()}</td>
                            <td>${doc.status}</td>
                            <td>
                                <button class="btn btn-sm btn-primary download-btn" data-id="${doc.id}">Download</button>
                                <button class="btn btn-sm btn-danger delete-btn" data-id="${doc.id}">Delete</button>
                            </td>
                        </tr>`;
                    });
                    $('#document-info').html(documentRows);
                })
                .catch(error => console.error("Failed to load documents:", error));
        }


// Upload document
        $('#upload-form').on('submit', function (event) {
            event.preventDefault();

            const formData = new FormData();
            formData.append('file', $('#files')[0].files[0]); // файл
            formData.append('title', $('#title').val());      // заголовок
            formData.append('department', $('#department').val()); // департамент
            formData.append('recipientId', $('#recipient').val()); // ID получателя

            fetch(documentAPI, {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (response.ok) {
                        alert('Document uploaded successfully.');
                        loadDocuments(); // Перезагружаем список документов
                    } else {
                        alert('Error uploading document.');
                    }
                })
                .catch(error => console.error('Error uploading document:', error));
        });


// Download document
        $(document).on('click', '.download-btn', function () {
            const docId = $(this).data('id');
            fetch(`${documentAPI}/${docId}/download`)
                .then(response => {
                    if (response.ok) {
                        return response.blob();
                    } else {
                        throw new Error('Error downloading document.');
                    }
                })
                .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'document.zip';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();

                    // После скачивания архива обновляем страницу, чтобы перезагрузить документы
                    location.reload();
                })
                .catch(error => console.error('Error downloading document:', error));
        });



        // Событие для кнопки удаления документа
        $(document).on('click', '.delete-btn', function () {
            const docId = $(this).data('id');
            fetch(`${documentAPI}/${docId}`, {
                method: 'DELETE'
            })
                .then(response => {
                    if (response.ok) {
                        alert('Document deleted successfully.');
                        loadDocuments(); // Перезагружаем список документов
                    } else {
                        alert('Error deleting document.');
                    }
                })
                .catch(error => console.error('Error deleting document:', error));
        });

        // Загрузка документов при загрузке страницы
        loadDocuments();
    });
}

getUser();
