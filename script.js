document.addEventListener('DOMContentLoaded', function () {
    var fetchUsersButton = document.getElementById('fetchUsersButton');
    var usernameInput = document.getElementById('username');
    var firstnameInput = document.getElementById('firstname');
    var lastnameInput = document.getElementById('lastname');
    var dataFound = document.getElementById('data-found');
    var foundDataCount = document.getElementById('found-data-count');

    // Define a variable to store the fetched user data
    var userData = [];

    // Function to clean up the name during search (removes "Mrs.")
    function cleanUpNameForSearch(name) {
        return name.replace(/^(Mrs\.)\s+/i, '');
    }

    // Function to display the user's name with titles
    function displayUserNameWithTitles(name) {
        return name; 
    }

    // Add a click event listener to the "OTSI" button
    fetchUsersButton.addEventListener('click', function (event) {
        event.preventDefault();

        // Check if the username, first name, and last name input fields are all empty
        if (usernameInput.value === '' && firstnameInput.value === '' && lastnameInput.value === '') {
            dataFound.innerHTML = "Otsimiseks sisesta kasutajanimimi, eesnimi või perenimi.";
            return;
        }

        // Check if a user matches the search criteria
        function matchesSearchCriteria(user) {
            const searchTerms = [];

            if (usernameInput.value) {
                searchTerms.push(usernameInput.value.toLowerCase());
            }
            if (firstnameInput.value) {
                searchTerms.push(cleanUpNameForSearch(firstnameInput.value.toLowerCase()));
            }
            if (lastnameInput.value) {
                searchTerms.push(cleanUpNameForSearch(lastnameInput.value.toLowerCase()));
            }

            for (const term of searchTerms) {
                if (
                    user.username.toLowerCase().includes(term) ||
                    cleanUpNameForSearch(user.name.toLowerCase()).includes(term)
                ) {
                    return true;
                }
            }

            return false;
        }

        // Filter users based on the search criteria
        var matchingUsers = userData.filter(matchesSearchCriteria);

        if (matchingUsers.length > 0) {
            var resultHTML = '';
            for (var user of matchingUsers) {
                resultHTML += `
                    <h4>Kasutaja:</h4>
                    <br/>
                    <p><strong>Nimi:</strong> ${displayUserNameWithTitles(user.name)}</p>
                    <p><strong>Kasutajanimi:</strong> ${user.username}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Aadress:</strong> ${user.address.street}, ${user.address.suite}, ${user.address.city} ${user.address.zipcode}</p>
                    <p><strong>Telefon:</strong> ${user.phone}</p>
                    <p><strong>Koduleht:</strong> ${user.website}</p>
                    <p><strong>Ettevõte:</strong> ${user.company.name} - ${user.company.catchPhrase}</p>
                    <br/>
                `;
            }
            dataFound.innerHTML = resultHTML;
            foundDataCount.innerText = matchingUsers.length;
        } else {
            dataFound.innerHTML = "Ühtegi isikut ei leitud. Proovi uuesti.";
            foundDataCount.innerText = 0;
        }
    });

    // Add a click event listener to the "Tühista otsing" link + clear contents
    var cancelSearchLink = document.getElementById('cancel-search');
    cancelSearchLink.addEventListener('click', function (event) {
        event.preventDefault(); 
        dataFound.innerHTML = '';
        usernameInput.value = ''; 
        firstnameInput.value = ''; 
        lastnameInput.value = '';
        foundDataCount.innerText = 0;
    });

    // Fetch the user data from the API when the page loads
    fetch("https://jsonplaceholder.typicode.com/users")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            userData = data;
        })
        .catch(function (error) {
            console.error("Kasutajaandmete hankimisel ilmnes viga:", error);
        });
});