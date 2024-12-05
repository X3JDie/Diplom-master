package ru.kata.spring.boot_security.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.kata.spring.boot_security.demo.models.Document;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Integer> {

    void deleteById(Long id);

    Optional<Document> findById(Long id);

    List<Document> findByEmail(String email);

    List<Document> findByEmailSenderOrEmailSender(String email, String emailSender);

    List<Document> findByEmailSender(String emailSender);

    @Query("SELECT d FROM Document d WHERE d.email = :email AND LOWER(d.title) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Document> findByEmailAndTitleContainingIgnoreCase(@Param("email") String email, @Param("search") String search);

    @Query("SELECT d FROM Document d WHERE d.emailSender = :emailSender AND LOWER(d.title) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Document> findByEmailSenderAndTitleContainingIgnoreCase(@Param("emailSender") String emailSender, @Param("search") String search);

}
