package ru.kata.spring.boot_security.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.models.Document;
import ru.kata.spring.boot_security.demo.repositories.DocumentRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.Date;

@Service
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final Path fileStorageLocation;

    @Autowired
    public DocumentServiceImpl(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
        this.fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @Transactional(readOnly = true)
    public List<Document> findAll() {
        return documentRepository.findAll();
    }

    @Transactional
    public Document save(Document document) {
        return documentRepository.save(document);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Document> findById(Long id) {
        return documentRepository.findById(id);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Optional<Document> documentOptional = documentRepository.findById(id);
        if (documentOptional.isPresent()) {
            Document document = documentOptional.get();
            try {
                Path filePath = Paths.get(document.getFilePath());
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                throw new RuntimeException("Could not delete file: " + document.getFilePath(), e);
            }
            documentRepository.deleteById(id);
        } else {
            throw new RuntimeException("Document not found with id: " + id);
        }
    }

    @Override
    public List<Document> getDocumentsByEmail(String email, String emailSender) {
        // Фильтрация документов по email (получатель) и/или emailSender (отправитель)
        if (emailSender != null) {
            return documentRepository.findByEmailSender(emailSender);
        }
        return documentRepository.findByEmail(email);
    }

    public void forwardDocument(Long documentId, String recipientEmail) {
        // Найти существующий документ
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found with ID: " + documentId));

        // Обновить почту получателя и статус
        document.setEmail(recipientEmail);
        document.setStatus("Forwarded");
        document.setUploadDate(new Date());

        // Сохранить обновленный документ
        documentRepository.save(document);
    }

    public List<Document> getDocumentsByEmailAndSearch(String email, String search) {
        if (search == null || search.isEmpty()) {
            return documentRepository.findByEmail(email);
        } else {
            return documentRepository.findByEmailAndTitleContainingIgnoreCase(email, search);
        }
    }

    public List<Document> getDocumentsBySenderEmailAndSearch(String emailSender, String search) {
        if (search == null || search.isEmpty()) {
            return documentRepository.findByEmailSender(emailSender);
        } else {
            return documentRepository.findByEmailSenderAndTitleContainingIgnoreCase(emailSender, search);
        }
    }




}
