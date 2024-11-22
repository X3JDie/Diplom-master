package ru.kata.spring.boot_security.demo.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.models.*;
import ru.kata.spring.boot_security.demo.repositories.*;
import ru.kata.spring.boot_security.demo.services.UserService;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired
    private final RoleRepository roleRepository;
    @Autowired
    private final UserService userService;
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final AttachmentRepository attachmentRepository;
    @Autowired
    private final DocumentRepository documentRepository;

    @Autowired
    private final OperationRepository operationRepository;
    @Autowired
    private final RequestRepository requestRepository;

    public DataInitializer(RoleRepository roleRepository, UserService userService, UserRepository userRepository, AttachmentRepository attachmentRepository,
                           DocumentRepository documentRepository, OperationRepository operationRepository, RequestRepository requestRepository) {
        this.roleRepository = roleRepository;
        this.userService = userService;
        this.userRepository = userRepository;
        this.attachmentRepository = attachmentRepository;
        this.documentRepository = documentRepository;
        this.operationRepository = operationRepository;
        this.requestRepository = requestRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        initializeRoles();
        initializeUsers();
        initializeAttachments();
        initializeOperations();
        initializeRequests();
    }

    private void initializeRoles() {
        roleRepository.save(new Role("ADMIN"));
        roleRepository.save(new Role("USER"));
        roleRepository.save(new Role("SECRETARY"));
        roleRepository.save(new Role("SALES"));
    }

    private void initializeUsers() {
        Set<Role> adminRoles = new HashSet<>();
        Role adminRole = roleRepository.findRoleByName("ADMIN");
        if (adminRole != null) {
            adminRoles.add(adminRole);
            User adminUser = new User("Admin", "Admin", "admin@example.com", "adminpassword");
            adminUser.setRoles(adminRoles);
            userService.save(adminUser); // Здесь вызываем метод save() из UserService
        }

        Set<Role> userRoles = new HashSet<>();
        Role userRole = roleRepository.findRoleByName("USER");
        if (userRole != null) {
            userRoles.add(userRole);
            User regularUser = new User("User", "User", "user@example.com", "userpassword");
            regularUser.setRoles(userRoles);
            userService.save(regularUser); // Здесь также вызываем метод save() из UserService
        }

        Set<Role> salesRoles = new HashSet<>();
        Role saleRole = roleRepository.findRoleByName("SALES");
        if (saleRole != null) {
            salesRoles.add(saleRole);
            User salesUser = new User("SALES", "SALES", "sales@example.com", "salespassword");
            salesUser.setRoles(salesRoles);
            userService.save(salesUser);
        }

        Set<Role> secretaryRoles = new HashSet<>();
        Role secretaryRole = roleRepository.findRoleByName("SECRETARY");
        if (secretaryRole != null) {
            secretaryRoles.add(secretaryRole);
            User secretaryUser = new User("Secretary", "Secretary", "secretary@example.com", "secretarypassword");
            secretaryUser.setRoles(secretaryRoles);
            userService.save(secretaryUser); // Здесь также вызываем метод save() из UserService
        }
    }


    private void initializeAttachments() {
        Attachment attachment1 = new Attachment("attachment1.pdf", "application/pdf");
        Attachment attachment2 = new Attachment("attachment2.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        attachmentRepository.save(attachment1);
        attachmentRepository.save(attachment2);
    }


    private void initializeOperations() {
        Operation operation1 = new Operation("Operation 1");
        Operation operation2 = new Operation("Operation 2");
        operationRepository.save(operation1);
        operationRepository.save(operation2);
    }


    private void initializeRequests() {
        Request request1 = new Request("Request 1", "Pending");
        Request request2 = new Request("Request 2", "Approved");
        requestRepository.save(request1);
        requestRepository.save(request2);
    }


}
