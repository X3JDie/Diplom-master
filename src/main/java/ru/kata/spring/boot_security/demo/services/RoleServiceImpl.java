package ru.kata.spring.boot_security.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.repositories.RoleRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class RoleServiceImpl implements RoleService{
    private final RoleRepository roleRepository;

    @Autowired
    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public List<Role> allRole() {
        return roleRepository.findAll();
    }

    @Override
    public Set<Role> findFormRole(List<String> formRoleId) {
        Set<Role> roles = new HashSet<>();
        for (String roleId : formRoleId) {
           roles.add(roleRepository.findRoleById(Integer.parseInt(roleId)));
        }
        return roles;
    }

}
