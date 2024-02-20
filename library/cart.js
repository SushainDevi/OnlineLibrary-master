// cart.js
// Wait for the DOM content to be fully loaded before executing the following code
document.addEventListener("DOMContentLoaded", function () {
    // Log a message indicating that the cart.js script is running
    console.log("cart.js script is running");

    // Retrieve the "Issue Now" button element from the DOM
    var issueNowButton = document.getElementById('issue_now');
    console.log("Issue Now button:", issueNowButton);

    // Function to update the cart display based on items in localStorage
    function updateCartDisplay() {
        // Retrieve the cart content element from the DOM
        var cartContent = document.getElementById('cart-content');

        console.log("Cart Content Element:", cartContent);

        if (cartContent) {
            // Retrieve cart items from localStorage or initialize an empty array
            var cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

            // Clear existing content in the cart
            cartContent.innerHTML = "";

            // Iterate through the items in the cart and display them
            cartItems.forEach(function (item) {
                var cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');

                var imgElement = document.createElement('img');
                imgElement.src = item.imageSrc;
                imgElement.alt = item.title;
                cartItem.appendChild(imgElement);

                var itemDetails = document.createElement('div');
                itemDetails.classList.add('item-details');
                itemDetails.innerHTML = `
                    <h3>${item.title}</h3>
                    <p>Author: ${item.author}</p>
                `;

                cartItem.appendChild(itemDetails);
                cartContent.appendChild(cartItem);
            });
        } else {
            console.error("Cart content element not found");
        }
    }

    // Async function to handle issuing cart items to the database
    async function handleIssueToDatabase() {
        // Retrieve cart items from localStorage or initialize an empty array
        var cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        try {
            // Display the user info form
            var userInfoForm = document.getElementById('user-info-form');
            userInfoForm.style.display = 'block';

            // Wait for user info submission
            var submitUserInfoButton = document.getElementById('submit-user-info');
            submitUserInfoButton.addEventListener('click', async function () {
                var name = document.getElementById('name').value;
                var prn = document.getElementById('prn').value;

                // Check if both name and prn are provided
                if (name && prn) {
                    // Add user information to each cart item
                    cartItems.forEach(item => {
                        item.issuedBy = name;
                        item.prn = prn;
                    });

                    // Determine the base URL based on environment
                    var baseURL = "https://online-library-one.vercel.app/";

                    // Send a POST request to the server to issue cart items
                    var response = await fetch(baseURL + '/issue', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ cartItems }),
                    });

                    // Check if the HTTP response is successful
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    // Parse the response JSON data
                    var data = await response.json();
                    console.log('Items have been issued and saved to the database:', data);

                    // Clear cart items from localStorage after successful issuance
                    localStorage.removeItem('cartItems');

                    // Redirect to the success page
                    window.location.href = 'issued.html';

                    // Update the cart display
                    updateCartDisplay();
                } else {
                    console.error('Please provide both name and PRN.');
                    // You can display an error message to the user if needed
                }
            });
        } catch (error) {
            console.error('Error handling user information:', error.message);
            // Handle the error or display a message to the user
        }
    }

    // Call the updateCartDisplay function to initially populate the cart display
    updateCartDisplay();

    // Retrieve the "Clear Cart" button element from the DOM
    var clearCartButton = document.getElementById('clear-cart');
    if (clearCartButton) {
        // Attach an event listener to the "Clear Cart" button to remove cart items from localStorage
        clearCartButton.addEventListener('click', function () {
            localStorage.removeItem('cartItems');
            // Update the cart display after clearing the cart
            updateCartDisplay();
        });
    } else {
        console.error("Clear cart button not found");
    }

    // Attach an event listener to the "Issue Now" button to handle issuing items to the database
    if (issueNowButton) {
        issueNowButton.addEventListener('click', function () {
            handleIssueToDatabase();
        });
    } else {
        console.error("Issue Now button not found");
    }
});