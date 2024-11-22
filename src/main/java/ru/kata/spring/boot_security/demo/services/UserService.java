package ru.kata.spring.boot_security.demo.services;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;
import java.util.Optional;

public interface UserService extends UserDetailsService {
    UserDetails loadUserByUsername(String email);
    List<User> findAll();
    User findById(int id);
    Optional<User> findByUsername(String username);
    void save(User user);
    void update(User updatedUser, int id);
    void delete(int id);

}
