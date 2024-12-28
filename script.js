const apiUrl = 'http://localhost:8080/users';

const usersTable = document.querySelector('#usersTable tbody');
const paginationContainer = document.querySelector('#paginationContainer');
const addUserBtn = document.querySelector('#addUserBtn');
const userFormContainer = document.querySelector('#userFormContainer');
const userForm = document.querySelector('#userForm');
const formTitle = document.querySelector('#formTitle');

const userIdInput = document.querySelector('#userId');
const firstNameInput = document.querySelector('#firstName');
const lastNameInput = document.querySelector('#lastName');
const emailInput = document.querySelector('#email');
const cancelFormBtn = document.querySelector('#cancelFormBtn');

let currentPage = 0;
let totalPages = 0;

// Load users on page load
document.addEventListener('DOMContentLoaded', loadUsers);

// Fetch and display users
function loadUsers() {
    fetch(`${apiUrl}?page=${currentPage}&size=5`)
        .then(response => {
            totalPages = parseInt(response.headers.get('X-Total-Pages'), 10) || 0;
            return response.json();
        })
        .then(users => {
            usersTable.innerHTML = ''; // Clear table
            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
          <td>${user.id}</td>
          <td>${user.firstName}</td>
          <td>${user.lastName}</td>
          <td>${user.email}</td>
          <td>
            <button onclick="editUser(${user.id})">Edit</button>
            <button onclick="deleteUser(${user.id})">Delete</button>
          </td>
        `;
                usersTable.appendChild(row);
            });
            updatePaginationControls();
        });
}

// Update pagination controls
function updatePaginationControls() {
    paginationContainer.innerHTML = ''; // Clear pagination

    for (let i = 0; i < totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i + 1;
        pageButton.disabled = i === currentPage;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            loadUsers();
        });
        paginationContainer.appendChild(pageButton);
    }
}

// Show the form for adding a user
addUserBtn.addEventListener('click', () => {
    userFormContainer.style.display = 'block';
    formTitle.textContent = 'Add User';
    userForm.reset();
    userIdInput.value = '';
});

// Hide the form
cancelFormBtn.addEventListener('click', () => {
    userFormContainer.style.display = 'none';
});

// Handle form submission
userForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const id = userIdInput.value;
    const user = {
        firstName: firstNameInput.value,
        lastName: lastNameInput.value,
        email: emailInput.value,
    };

    if (id) {
        // Update user
        fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        }).then(() => {
            loadUsers();
            userFormContainer.style.display = 'none';
        });
    } else {
        // Add new user
        fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        }).then(() => {
            loadUsers();
            userFormContainer.style.display = 'none';
        });
    }
});

// Edit user
function editUser(id) {
    fetch(`${apiUrl}/${id}`)
        .then(response => response.json())
        .then(user => {
            userFormContainer.style.display = 'block';
            formTitle.textContent = 'Edit User';
            userIdInput.value = user.id;
            firstNameInput.value = user.firstName;
            lastNameInput.value = user.lastName;
            emailInput.value = user.email;
        });
}

// Delete user
function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        fetch(`${apiUrl}/${id}`, { method: 'DELETE' })
            .then(() => loadUsers());
    }
}
