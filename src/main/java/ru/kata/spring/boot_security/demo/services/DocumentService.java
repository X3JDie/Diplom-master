package ru.kata.spring.boot_security.demo.services;

import ru.kata.spring.boot_security.demo.models.Document;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.repositories.DocumentRepository;
import ru.kata.spring.boot_security.demo.repositories.UserRepository;

import java.util.List;
import java.util.Optional;

public interface DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private UserRepository userRepository;

    List<Document> findAll();

    Document save(Document document);

    Optional<Document> findById(Long id);

    void delete(Long id);

    @Override
    public Document assignDocumentToUser(Long documentId, Long userId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        document.setAssignedUser(user);
        return documentRepository.save(document);
    }

    @Override
    public List<Document> getDocumentsByUser(Long userId) {
        return documentRepository.findByAssignedUser_Id(userId);
    }

}
