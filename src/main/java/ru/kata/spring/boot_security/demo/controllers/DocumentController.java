package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.zeroturnaround.zip.ZipUtil;
import ru.kata.spring.boot_security.demo.models.Document;
import ru.kata.spring.boot_security.demo.services.DocumentService;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    @Autowired
    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadDocuments(@RequestParam("files") MultipartFile[] files,
                                                  @RequestParam("title") String title,
                                                  @RequestParam("email") String email,
                                                  @RequestParam("emailSend") String emailSend) {
        try {
            StringBuilder fileNames = new StringBuilder();

            for (MultipartFile file : files) {
                String originalFilename = file.getOriginalFilename();
                String filePath = "uploads/" + originalFilename;
                Files.write(Paths.get(filePath), file.getBytes());

                fileNames.append(filePath).append(";");
            }

            Document document = new Document();
            document.setTitle(title);
            document.setEmail(email);
            document.setEmailSender(emailSend);
            document.setFilePath(fileNames.toString());
            document.setStatus("Draft");
            document.setUploadDate(new Date());

            documentService.save(document);

            return ResponseEntity.ok("Documents uploaded successfully.");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Document upload failed.");
        }
    }

    @GetMapping
    public ResponseEntity<List<Document>> getAllDocuments() {
        return ResponseEntity.ok(documentService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocumentById(@PathVariable Long id) {
        Optional<Document> documentOptional = documentService.findById(id);
        if (documentOptional.isPresent()) {
            return ResponseEntity.ok(documentOptional.get());
        } else {
            System.err.println("Document not found with id: " + id);
            return ResponseEntity.status(404).body(null);
        }
    }



    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long id) {
        Optional<Document> documentOptional = documentService.findById(id);
        if (documentOptional.isPresent()) {
            Document document = documentOptional.get();
            String[] filePaths = document.getFilePath().split(";");
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            ZipUtil.pack(Paths.get("uploads").toFile(), byteArrayOutputStream, name -> {
                for (String filePath : filePaths) {
                    if (name.equals(Paths.get(filePath).getFileName().toString())) {
                        return filePath;
                    }
                }
                return null;
            });

            ByteArrayResource resource = new ByteArrayResource(byteArrayOutputStream.toByteArray());

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + document.getTitle() + ".zip\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(resource);
        } else {
            System.err.println("Document not found with id: " + id);
            return ResponseEntity.status(404).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDocument(@PathVariable Long id) {
        try {
            documentService.delete(id);
            return ResponseEntity.ok("Document deleted successfully.");
        } catch (Exception e) {
            System.err.println("Error deleting document with id: " + id + " - " + e.getMessage());
            return ResponseEntity.status(500).body("Document deletion failed.");
        }
    }

    @GetMapping("/mail")
    public ResponseEntity<List<Document>> getDocumentsByEmail(@RequestParam String email, String emailSender) {
        System.out.println("Looking for documents for email: " + email);  // Выводим email для отладки
        List<Document> documents = documentService.getDocumentsByEmail(email,emailSender);
        if (documents.isEmpty()) {
            return ResponseEntity.noContent().build();  // Если документов не найдено, возвращаем 204
        }
        return ResponseEntity.ok(documents);  // Возвращаем документы с кодом 200
    }

    @GetMapping("/incoming")
    public ResponseEntity<List<Document>> getDocumentsByIncomingEmail(@RequestParam String email,
                                                              @RequestParam(required = false) String search) {
        // Фильтрация по получателю (email) и поиску по названию
        List<Document> documents = documentService.getDocumentsByEmailAndSearch(email, search);

        if (documents.isEmpty()) {
            return ResponseEntity.noContent().build();  // Если документы не найдены, возвращаем 204
        }

        return ResponseEntity.ok(documents);  // Возвращаем документы с кодом 200
    }

    @GetMapping("/sent")
    public ResponseEntity<List<Document>> getDocumentsBySenderEmail(@RequestParam String emailSender,
                                                                    @RequestParam(required = false) String search) {
        // Фильтрация по отправителю и поиску по названию
        List<Document> documents = documentService.getDocumentsBySenderEmailAndSearch(emailSender, search);

        if (documents.isEmpty()) {
            return ResponseEntity.noContent().build();  // Если документы не найдены, возвращаем 204
        }

        return ResponseEntity.ok(documents);  // Возвращаем документы с кодом 200
    }


    @PostMapping("/forward")
    public ResponseEntity<String> forwardDocument(@RequestBody Map<String, Object> request) {
        Long documentId = Long.valueOf(request.get("documentId").toString());
        String recipientEmail = request.get("recipientEmail").toString();

        documentService.forwardDocument(documentId, recipientEmail);

        return ResponseEntity.ok("Document forwarded successfully.");
    }

}
