// Wait for the DOM content to be fully loaded before executing the following code
document.addEventListener("DOMContentLoaded", function () {

    // Function to add a book to the shopping cart
    function addToCart(bookId, title, author, imageSrc) {
        // Create a cart item object
        var cartItem = {
            bookId: bookId,
            title: title,
            author: author,
            imageSrc: 'images/' + imageSrc,
        };

        // Retrieve existing cart items from localStorage or initialize an empty array
        var cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

        // Add the new item to the cartItems array
        cartItems.push(cartItem);

        // Update local storage with the new cartItems array
        localStorage.setItem("cartItems", JSON.stringify(cartItems));

        // Trigger a function to update the cart display
        updateCartDisplay();
    }

    // Function to update the cart display based on search term
    function updateCartDisplay() {
        // Retrieve the cart content element
        var cartContent = document.getElementById("cart-content");

        // Check if cart-content element exists
        if (cartContent) {
            // Retrieve existing cart items from localStorage or initialize an empty array
            var cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

            // Clear existing content in the cart
            cartContent.innerHTML = "";

            // Iterate through the items in the cart
            cartItems.forEach(function (item) {
                // Check if the item matches the search term
                if (
                    item.title.toLowerCase().includes(searchTerm) ||
                    item.author.toLowerCase().includes(searchTerm)
                ) {
                    // Create a cart item element
                    var cartItem = document.createElement("div");
                    cartItem.classList.add("cart-item");

                    // Create an image element for the book cover
                    var imgElement = document.createElement("img");
                    imgElement.src = item.imageSrc;
                    imgElement.alt = item.title;
                    imgElement.style.maxWidth = '100%';
                    imgElement.style.height = 'auto';
                    cartItem.appendChild(imgElement);

                    // Create a div for item details (title and author)
                    var itemDetails = document.createElement("div");
                    itemDetails.classList.add("item-details");
                    itemDetails.innerHTML = `
                            <h3>${item.title}</h3>
                            <p>Author: ${item.author}</p>
                        `;

                    // Append the item details to the cart item
                    cartItem.appendChild(itemDetails);

                    // Append the cart item to the cart content
                    cartContent.appendChild(cartItem);
                }
            });
        } else {
            // Log an error if the cart content element is not found
            console.error("Cart content element not found");
        }
    }

    // Assign addToCart to the window object to make it accessible globally
    window.addToCart = addToCart;

    // Call the updateCartDisplay function when the DOM is ready
    if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
        updateCartDisplay();
    } else {
        document.addEventListener('DOMContentLoaded', updateCartDisplay);
    }

    // Attach an event listener to the search input for live search
    var searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", updateCartDisplay);
    } else {
        // Log an error if the search input element is not found
        console.error("Search input element not found");
    }
});
