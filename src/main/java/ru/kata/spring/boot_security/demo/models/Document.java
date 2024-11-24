package ru.kata.spring.boot_security.demo.models;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "documents")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String department; // Поле для хранения департамента
    private Date uploadDate;   // Поле для хранения даты загрузки
    private String status;
    @Column(length = 5000)
    private String filePath;

    public Document() {
    }

    public Document(String title, String department, String resolution, Date uploadDate, String status, String filePath) {
        this.title = title;
        this.department = department;
        this.uploadDate = uploadDate;
        this.status = status;
        this.filePath = filePath;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Date getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(Date uploadDate) {
        this.uploadDate = uploadDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }
}
