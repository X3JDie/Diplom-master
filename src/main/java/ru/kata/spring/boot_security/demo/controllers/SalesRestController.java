package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.repositories.DocumentRepository;
import ru.kata.spring.boot_security.demo.services.RoleService;
import ru.kata.spring.boot_security.demo.services.UserService;
import ru.kata.spring.boot_security.demo.models.Document;


import java.security.Principal;
import java.util.List;


@RestController
@RequestMapping("/api/sales")
public class SalesRestController {

    private final UserService userService;

    private final RoleService roleService;

    private final DocumentRepository documentRepository;

    @Autowired
    public SalesRestController(UserService userService, RoleService roleService, DocumentRepository documentRepository) {
        this.userService = userService;
        this.roleService = roleService;
        this.documentRepository = documentRepository;
    }

    @GetMapping("")
    public ResponseEntity<User> salesInfo(Principal principal) {
        return new ResponseEntity<>(userService.findByUsername(principal.getName()).orElse(null), HttpStatus.OK);
    }

 }

