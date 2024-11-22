$(document).ready(function() {
    // Функция для загрузки списка документов
    function loadDocuments() {
        $.ajax({
            url: '/api/documents',
            type: 'GET',
            success: function(documents) {
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
                        </tr>
                    `;
                });
                $('#document-info').html(documentRows);
            },
            error: function() {
                alert("Failed to load documents.");
            }
        });
    }

    // Событие для кнопки загрузки документа
    $('#upload-btn').on('click', function() {
        // Логика для загрузки документа
        alert('Upload document logic will be here');
    });

    // Событие для кнопки скачивания документа
    $(document).on('click', '.download-btn', function() {
        const docId = $(this).data('id');
        // Логика для скачивания документа
        alert('Download document with ID: ' + docId);
    });

    // Событие для кнопки удаления документа
    $(document).on('click', '.delete-btn', function() {
        const docId = $(this).data('id');
        // Логика для удаления документа
        alert('Delete document with ID: ' + docId);
    });

    // Загрузка документов при загрузке страницы
    loadDocuments();
});
