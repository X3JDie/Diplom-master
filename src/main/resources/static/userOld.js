const userAPI = 'http://localhost:8080/api/user';
const userHeader = document.getElementById("navbar-user");
const userInfo = document.getElementById("user-info");

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
                        <td>${principal.age}</td>
                        <th>${principal.email}</th>
                        <td>
                            <span>${roles}</span></td>`;
        });

    $(document).ready(function () {
        const documentAPI = 'http://localhost:8080/api/documents';

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
                                <td>${doc.description}</td>
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
            formData.append('file', $('#file')[0].files[0]);
            formData.append('title', $('#title').val());
            formData.append('description', $('#description').val());

            fetch(documentAPI, {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (response.ok) {
                        alert('Document uploaded successfully.');
                        loadDocuments(); // Reload document list
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
