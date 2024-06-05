document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM fully loaded and parsed');

    // Function to change password
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            // Password change code
            const currentPassword = document.getElementById('currentPasswordInput').value;
            const newPassword = document.getElementById('newPassword').value;

            // Check for empty fields
            if (currentPassword.trim() === '' || newPassword.trim() === '') {
                alert('Please fill in all fields');
                return;
            }

            // Sending data to the server
            const response = await fetch('change_password.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `currentPassword=${currentPassword}&newPassword=${newPassword}`
            });
            const data = await response.text();
            alert(data); // Display server response
        });
    }

    // User registration section
    const registerButton = document.getElementById('registerButton');
    if (registerButton) {
        registerButton.addEventListener('click', async function() {
            // User registration code
            const regUsername = document.getElementById('regUsername').value;
            const regEmail = document.getElementById('regEmail').value;
            const regPassword = document.getElementById('regPassword').value;

            // Check for empty fields
            if (regUsername.trim() === '' || regEmail.trim() === '' || regPassword.trim() === '') {
                alert('Please fill in all fields');
                return;
            }

            // Sending data to the server
            const response = await fetch('register.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `regUsername=${regUsername}&regEmail=${regEmail}&regPassword=${regPassword}`
            });
            const data = await response.text();
            console.log(data); // Display server response in console
            alert(data); // Display server response
            if (data === 'Registration successful') {
                window.location.href = 'login.html'; // Redirect to login page after successful registration
            }
        });
    }

    // User login section
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.addEventListener('click', async function() {
            // User login code
            const login = document.getElementById('login').value;
            const password = document.getElementById('password').value;

            // Check for empty fields
            if (login.trim() === '' || password.trim() === '') {
                alert('Please fill in all fields');
                return;
            }

            // Sending data to the server
            const response = await fetch('login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `login=${login}&password=${password}`
            });
            const data = await response.text();
            console.log(data); // Display server response in console
            alert(data); // Display server response
            if (data === 'Login successful') {
                window.location.href = 'CryptoWebLapa.html'; // Redirect to the main page after successful login
            }
        });
    }

    // Get user data from the server
    fetch('get_user_info.php')
        .then(response => response.json())
        .then(data => {
            // Display current username and password hash from the database on the page
            document.getElementById('currentUsername').textContent = data.username;

            // Display '*' instead of password hash with the same length
            const passwordLength = data.password_hash.length;
            document.getElementById('currentPassword').textContent = '*'.repeat(passwordLength);
        })
        .catch(error => console.error('Error fetching user data:', error));

    // Get cryptocurrency data from the server
    fetch('get_crypto_data.php')
        .then(response => response.json())
        .then(data => {
            // Display cryptocurrency data on the page
            const cryptoDataBlock = document.getElementById('test');
            if (cryptoDataBlock) {
                console.log('Container found:', cryptoDataBlock);

                // Create table to display data
                const table = document.createElement('table');
                const thead = document.createElement('thead');
                const tbody = document.createElement('tbody');

                // Create table headers
                const tableHeaders = ['Name', 'Price', 'Price Change-24h'];
                const headerRow = document.createElement('tr');
                tableHeaders.forEach(headerText => {
                    const th = document.createElement('th');
                    th.textContent = headerText;
                    th.classList.add('sortable');
                    th.addEventListener('click', () => {
                        if (headerText.toLowerCase() === 'name') {
                            sortTableByName();
                        } else {
                            sortTableByColumn(headerText.toLowerCase());
                        }
                    });
                    headerRow.appendChild(th);
                });
                thead.appendChild(headerRow);
                table.appendChild(thead);

                // Add data rows to the table
                data.forEach((crypto, index) => {
                    const row = document.createElement('tr');
                    const nameCell = document.createElement('td');
                    const priceCell = document.createElement('td');
                    const change24hCell = document.createElement('td');

                    nameCell.textContent = crypto.currency_name;
                    priceCell.textContent = crypto.price;
                    change24hCell.textContent = crypto.price_change_24h;

                    row.appendChild(nameCell);
                    row.appendChild(priceCell);
                    row.appendChild(change24hCell);
                    tbody.appendChild(row);
                });

                // Add tbody to the table
                table.appendChild(tbody);

                // Add the table to the page
                cryptoDataBlock.appendChild(table);
            } else {
                console.error('Crypto data container not found');
            }
        })
        .catch(error => console.error('Error fetching cryptocurrency data:', error));

    // Sort table by column
    function sortTableByColumn(columnName) {
        const table = document.querySelector('table');
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));

        let columnIndex;
        switch (columnName) {
            case 'price':
                columnIndex = 1;
                break;
            case 'price change-24h':
                columnIndex = 2;
                break;
            default:
                return;
        }

        rows.sort((a, b) => {
            const aValue = parseFloat(a.cells[columnIndex].textContent);
            const bValue = parseFloat(b.cells[columnIndex].textContent);

            if (columnName === 'price') {
                return bValue - aValue;
            } else if (columnName === 'price change-24h') {
                if (aValue >= 0 && bValue >= 0) {
                    return bValue - aValue;
                } else if (aValue < 0 && bValue < 0) {
                    return bValue - aValue;
                } else if (aValue >= 0 && bValue < 0) {
                    return -1;
                } else if (aValue < 0 && bValue >= 0) {
                    return 1;
                }
            }
        });

        // Remove current rows
        rows.forEach(row => tbody.removeChild(row));

        // Add sorted rows back
        rows.forEach(row => tbody.appendChild(row));
    }

    // Sort table by name
    function sortTableByName() {
        const table = document.querySelector('table');
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));

        rows.sort((a, b) => {
            const aValue = a.cells[0].textContent.toLowerCase();
            const bValue = b.cells[0].textContent.toLowerCase();

            if (aValue < bValue) {
                return -1;
            }
            if (aValue > bValue) {
                return 1;
            }
            return 0;
        });

        // Remove current rows
        rows.forEach(row => tbody.removeChild(row));

        // Add sorted rows back
        rows.forEach(row => tbody.appendChild(row));
    }

    const logo = document.querySelector('.logo img');
    const mainContainer = document.querySelector('.main-container');

    // Fade out animation
    function fadeOut(link) {
        mainContainer.classList.add('page-fade-out');
        setTimeout(() => {
            window.location.href = link;
        }, 300); // Wait for animation to finish
    }

    // Home and User links
    document.querySelectorAll('.navbar ul li a').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const href = this.getAttribute('href');
            fadeOut(href);
        });
    });

    // Logo link
    logo.addEventListener('click', function() {
        fadeOut('CryptoWebLapa.html');
    });

    // Cryptocurrency search by name
    const cryptoSearchInput = document.getElementById('cryptoSearch');
    cryptoSearchInput.addEventListener('input', function() {
        const searchTerm = cryptoSearchInput.value.toLowerCase();
        const cryptoRows = document.querySelectorAll('tbody tr');

        cryptoRows.forEach(row => {
            const cryptoName = row.cells[0].textContent.toLowerCase();
            if (cryptoName.includes(searchTerm)) {
                row.style.display = ''; // Show row if cryptocurrency name matches search query
            } else {
                row.style.display = 'none'; // Hide row if cryptocurrency name doesn't match search query
            }
        });
    });

    // Get last database update time
    fetch('get_last_update.php')
        .then(response => response.text())
        .then(data => {
            // Display time on the page
            const lastUpdateElement = document.getElementById('lastUpdate');
            if (lastUpdateElement) {
                lastUpdateElement.textContent = data;
            } else {
                console.error('Element with ID "lastUpdate" not found');
            }
        })
        .catch(error => console.error('Error fetching last update data:', error));
});
