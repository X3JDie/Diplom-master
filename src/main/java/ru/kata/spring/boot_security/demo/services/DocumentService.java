package ru.kata.spring.boot_security.demo.services;

import ru.kata.spring.boot_security.demo.models.Document;

import java.util.List;
import java.util.Optional;

public interface DocumentService {
    List<Document> findAll();

    Document save(Document document);

    Optional<Document> findById(Long id);

    void delete(Long id);


}
