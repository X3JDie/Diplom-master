const API = 'http://localhost:8080/api/admin';
const adminHeader = document.getElementById("navbar-header");
const usersTable = document.getElementById("table-users");
const adminInfo = document.getElementById("admin-info");



function getAdmin() {
    fetch(API + '/info')
        .then(res => res.json())
        .then(principal => {
            let roles = "";
            principal.roles.forEach(value => {
                roles += value.name + " "
            })
            adminHeader.innerHTML = `<span class="fw-bolder">${principal.email}</span>
                    <span> with roles: </span>
                    <span>${roles}</span>`;
            adminInfo.innerHTML = `
                                            <td>${principal.id}</td>
                                            <td>${principal.name}</td>
                                            <td>${principal.surname}</td>
                                            <td>${principal.age}</td>
                                            <td>${principal.email}</td>
                                            <td>
                                                <span>${roles}</span></td>`;
        });
}

getAdmin();

function getUsers() {
    fetch(API)
        .then(res => {
            return res.json()
        })
        .then(users => {
            let data ="";
            users.forEach((user) => {
                let roles = "";
                user.roles.forEach(value => {
                    roles += value.name + " "
                })
                data += `<tr>
                        <th scope="row" >${user.id}</th>
                        <td >${user.name}</td>
                        <td >${user.surname}</td>
                        <td >${user.age}</td>
                        <th >${user.email}</th>
                        <td>
                            <span>${roles}</span></td>
                        <td>
                            <button type="button" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#editUser" th:data-id="${user.id}" onclick="showUpdatedUser(${user.id})">
                                Edit
                            </button></td>
                        <td>
                            <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteUser" th:data-id="${user.id}" onclick="showDeletedUser(${user.id})">
                                Delete
                            </button></td>`;
            });

            usersTable.innerHTML=data;


        })
        .catch(error => console.error(error));
}

getUsers();

function showUpdatedUser(id) {
    fetch(API + "/" + id)
        .then((res) => {
            return res.json();
        })
        .then((user) => {
            document.getElementById('idEdit').value = user.id;
            document.getElementById('nameEdit').value = user.name;
            document.getElementById('surnameEdit').value = user.surname;
            document.getElementById('ageEdit').value = user.age;
            document.getElementById('emailEdit').value = user.email;
            document.getElementById('passwordEdit').value = user.password;
            document.getElementById('editRoles').value = user.roles;
            updateUser();
        })
        .catch((error) => console.log(error))
}
function updateUser(){
    const editElement = document.getElementById('editForm');
    editElement.addEventListener('submit', (e) => {
        e.preventDefault();
        const userId = document.getElementById('idEdit').value;
        const rolesOptions = document.getElementById('editRoles').options;
        const selectRoles = Array.from(rolesOptions)
            .filter(o => o.selected)
            .map(opt => ({
                id: opt.value,
                name: opt.text
            }))

        const formEdit = new FormData(editElement);
        const user = {
            id: userId,
            name: formEdit.get('nameEdit'),
            surname: formEdit.get('surnameEdit'),
            age: formEdit.get('ageEdit'),
            email: formEdit.get('emailEdit'),
            password: formEdit.get('passwordEdit'),
            roles: selectRoles
        }

        fetch(API + "/" + userId, {
            method: "PATCH",
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (res.ok) {
                    console.log("User updated")
                    return res.json();
                }
            })
            .then(() => {
                document.getElementById('editCloseForm').click();
                getUsers();
            })
            .catch((error) => console.log(error))
    })
}

function showDeletedUser(id) {
    fetch(API + "/" + id)
        .then((res) => {
            return res.json();
        })
        .then((user) => {
            document.getElementById('deleteId').value = user.id;
            document.getElementById('deleteName').value = user.name;
            document.getElementById('deleteSurname').value = user.surname;
            document.getElementById('deleteAge').value = user.age;
            document.getElementById('deleteEmail').value = user.email;
            document.getElementById('deletePassword').value = user.password;
            document.getElementById('deleteRoles').value = user.roles;
            deletedUser();
        })
        .catch((error) => console.log(error))
}



function deletedUser() {
    const deleteElement = document.getElementById('deleteForm');
    deleteElement.addEventListener('submit', (e) => {
        e.preventDefault();
        const deleteId = document.getElementById('deleteId').value;
        const rolesOptions = document.getElementById('deleteRoles').options;
        const selectRoles = Array.from(rolesOptions)
            .filter(o => o.selected)
            .map(opt => ({
                id: opt.value,
                name: opt.text
            }))

        const formEdit = new FormData(deleteElement);
        const user = {
            id: deleteId,
            name: formEdit.get('deleteName'),
            surname: formEdit.get('deleteSurname'),
            age: formEdit.get('deleteAge'),
            email: formEdit.get('deleteEmail'),
            password: formEdit.get('deletePassword'),
            roles: selectRoles
        }

        fetch(API + "/" + deleteId, {
            method: "DELETE",
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (res.ok) {
                    console.log("User deleted")
                    return res.json();
                }
            })
            .then(() => {
                document.getElementById('deleteClose').click();
                getUsers();
            })
            .catch((error) => console.log(error))
    })
}



function addUser() {
    const formElement = document.getElementById("newUserForm");
    formElement.addEventListener('submit', (e) => {
        e.preventDefault();
        const rolesOptions = document.getElementById('roles').options;
        const selectRoles = Array.from(rolesOptions)
            .filter(o => o.selected)
            .map(opt => ({
                id: opt.value,
                name: opt.text
            }))


        const formData = new FormData(formElement);
        const user = {
            name: formData.get('name'),
            surname: formData.get('surname'),
            age: formData.get('age'),
            email: formData.get('email'),
            password: formData.get('password'),
            roles: selectRoles
        };

        fetch(API, {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                "Content-Type" : "application/json",
            },
        })
            .then((res) => {
                if (res.ok) {
                    console.log("User added")
                    return res.json();
                }
            })
            .then(() => {
                formElement.reset();
                getUsers();
            });
    });
}
addUser();

