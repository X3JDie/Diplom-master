const userAPI = 'http://localhost:8080/api/secretary';
const documentAPI = 'http://localhost:8080/api/documents';
const userHeader = document.getElementById("navbar-user");
const userInfo = document.getElementById("user-info");
const emailInput = document.getElementById('email');
const suggestionsList = document.getElementById('email-suggestions');
const selectedEmailsContainer = document.getElementById('selected-emails');
let selectedEmails = [];


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


        $(document).ready(function () {
            loadUsers(); // Загружаем список пользователей

        });

        // Функция для загрузки списка документов
        // function loadDocuments() {
        //     const userEmail = document.getElementById('email').value; // Получаем email текущего пользователя
        //     fetch(`/api/documents/mail?email=${userEmail}`)
        //         .then(res => res.json())
        //         .then(documents => {
        //             let sentDocuments = '';
        //             let receivedDocuments = '';
        //
        //             documents.forEach(doc => {
        //                 if (doc.emailSender === userEmail) {
        //                     sentDocuments += `
        //                 <tr>
        //                     <td>${doc.id}</td>
        //                     <td>${doc.title}</td>
        //                     <td>${doc.emailSender}</td>
        //                     <td>${new Date(doc.uploadDate).toLocaleString()}</td>
        //                     <td>${doc.status}</td>
        //                     <td>
        //                         <button class="btn btn-sm btn-primary download-btn" data-id="${doc.id}">Download</button>
        //                         <button class="btn btn-sm btn-danger delete-btn" data-id="${doc.id}">Delete</button>
        //                     </td>
        //                 </tr>`;
        //                 } else if (doc.emailRecipient === userEmail) {
        //                     receivedDocuments += `
        //                 <tr>
        //                     <td>${doc.id}</td>
        //                     <td>${doc.title}</td>
        //                     <td>${doc.emailSender}</td>
        //                     <td>${new Date(doc.uploadDate).toLocaleString()}</td>
        //                     <td>${doc.status}</td>
        //                     <td>
        //                         <button class="btn btn-sm btn-primary download-btn" data-id="${doc.id}">Download</button>
        //                         <button class="btn btn-sm btn-danger delete-btn" data-id="${doc.id}">Delete</button>
        //                     </td>
        //                 </tr>`;
        //                 }
        //             });
        //
        //             document.getElementById('sent-documents').innerHTML = sentDocuments;
        //             document.getElementById('received-documents').innerHTML = receivedDocuments;
        //         })
        //         .catch(error => console.error("Error loading documents:", error));
        // }

        function loadDocumentsIncoming() {
            const userEmail = 'secretary@example.com';  // Замените на логин пользователя, который залогинен
            fetch(`/api/documents/incoming?email=${userEmail}`)
                .then(res => res.json())
                .then(documents => {
                    let documentRows = '';
                    documents.forEach(doc => {
                        documentRows += `
                    <tr>
                        <td>${doc.id}</td>
                        <td>${doc.title}</td>
                        <td>${doc.status}</td>
                        <td>
                            <button class="btn btn-sm btn-primary download-btn" data-id="${doc.id}">Download</button>
                            <button class="btn btn-sm btn-danger delete-btn" data-id="${doc.id}">Delete</button>
                        </td>
                    </tr>`;
                    });
                    $('#document-incoming-1').html(documentRows);
                })
                .catch(error => console.error("Failed to load documents:", error));
        }



        function loadDocumentsSender() {
            const userEmail = 'secretary@example.com';  // Замените на логин пользователя, который залогинен
            fetch(`/api/documents/sent?emailSender=${userEmail}`)
                .then(res => res.json())
                .then(documents => {
                    let documentRows = '';
                    documents.forEach(doc => {
                        documentRows += `
                    <tr>
                        <td>${doc.id}</td>
                        <td>${doc.title}</td>
                        <td>${doc.status}</td>
                        <td>
                            <button class="btn btn-sm btn-primary download-btn" data-id="${doc.id}">Download</button>
                            <button class="btn btn-sm btn-danger delete-btn" data-id="${doc.id}">Delete</button>
                        </td>
                    </tr>`;
                    });
                    $('#document-sent-1').html(documentRows);
                })
                .catch(error => console.error("Failed to load documents:", error));
        }

        $(document).ready(function () {
            loadDocumentsIncoming(); // Загружаем список полученных документов
            loadDocumentsSender();   // Загружаем список отправленных документов
        });


// Upload document
        $('#upload-form').on('submit', function (event) {
            event.preventDefault();

            const formData = new FormData();
            const files = $('#files')[0].files;  // Получаем все выбранные файлы

            // Добавляем каждый файл в FormData
            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i]);  // 'files' будет массивом на сервере
            }

            formData.append('title', $('#title').val());  // Заголовок
            formData.append('email', $('#email').val());  // Почта получателя

            // Получаем email текущего пользователя через API
            fetch(userAPI)
                .then(res => res.json())
                .then(principal => {
                    formData.append('emailSend', principal.email);  // Используем email текущего пользователя

                    // Отправка формы через fetch
                    fetch(documentAPI + '/upload', {
                        method: 'POST',
                        body: formData
                    })
                        .then(response => {
                            if (response.ok) {
                                alert('Documents uploaded successfully.');
                                loadDocuments();  // Перезагружаем список документов
                            } else {
                                alert('Error uploading documents.');
                            }
                        })
                        .catch(error => {
                            console.error('Error uploading documents:', error);
                        });
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                });
            loadDocumentsIncoming();
            loadDocumentsSender();
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
        loadDocumentsIncoming();
        loadDocumentsSender();
    });


    //start


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

    // Обработка отправки формы
    document.getElementById('upload-form').addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData();
        const files = document.getElementById('files').files;

        // Добавляем каждый файл в FormData
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        formData.append('title', document.getElementById('title').value);
        formData.append('emails', JSON.stringify(selectedEmails)); // Передаем выбранные email как JSON

        fetch('http://localhost:8080/api/documents/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (response.ok) {
                    alert('Documents uploaded successfully.');
                    location.reload();
                } else {
                    return response.json(); // Получаем ответ от сервера, если он есть
                }
            })
            .then(data => {
                if (data && data.message) {
                    alert('Error uploading documents: ' + data.message); // Сообщение с ошибкой от сервера
                }
            })
            .catch(error => {
                console.error('Error uploading documents:', error);
                alert('An error occurred while uploading the documents. Please try again later.');
            });
    });


}

getUser();

