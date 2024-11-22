package ru.kata.spring.boot_security.demo.models;


import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.util.Collection;
import java.util.Set;

@Entity
@Table(name = "users", schema = "public")
public class User implements UserDetails {

    @Id
    @Column()
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotEmpty(message = "Name is empty")
    @Size(min = 3, max = 30, message = "Name size from 3 to 30")
    @Column()
    private String name;

    @NotEmpty(message = "Surname is empty")
    @Size(min = 3, max = 30, message = "Surname size from 3 to 30")
    @Column()
    private String surname;

//    @Min(value = 1, message = "Age must be greater than 0")
//    @Column()
//    private int age;

    @NotEmpty(message = "Username is empty")
    @Size(min = 3, max = 30, message = "Username size from 3 to 30")
    @Column()
    private String email;

    @NotEmpty(message = "Password is empty")
    @Size(min = 3, max = 100, message = "Password size from 3 to 30")
    @Column()
    private String password;

    @ManyToMany(fetch = FetchType.LAZY)
    //@Cascade(org.hibernate.annotations.CascadeType.PERSIST)
    @JoinTable(
            name = "users_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles;

    public User(String admin, String mail, String adminpassword, Set<Role> adminRoles) {

    }

    public User(String name, String surname, String email, String password) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
    }

    public User() {

    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    @Override
    public String toString() {
        return "User " + id +
                ": " + name + " " + surname + " roles: " + roles;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return getRoles();
    }

    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public void setEmail(String username) {
        this.email = username;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }
}
