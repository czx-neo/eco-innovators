const users = {
    'relief_center': 'password1',
    'supply_coordinator': 'password2'
};

function login() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    if (users[username] && users[username] === password) {
        document.getElementById('login-page').classList.add('hidden');
        if (username === 'relief_center') {
            document.getElementById('relief-dashboard').classList.remove('hidden');
        } else {
            document.getElementById('supply-dashboard').classList.remove('hidden');
        }
    } else {
        alert('Invalid credentials!');
    }
}