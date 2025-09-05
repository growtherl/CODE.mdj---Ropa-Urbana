document.addEventListener('DOMContentLoaded', () => {
    // Definir el carrito de compras como un array vacío o cargar del almacenamiento local
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Obtener elementos del DOM
    const cartIcon = document.querySelector('.cart-icon');
    const cartCount = document.querySelector('.cart-count');
    const cartModal = document.getElementById('cart-modal');
    const closeModalBtn = document.querySelector('.close-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    
    // Elementos del buscador
    const searchIconBtn = document.querySelector('.search-icon-btn');
    const searchBar = document.querySelector('.search-bar-dropdown');
    const searchInput = document.querySelector('.search-input');
    const allProducts = document.querySelectorAll('.product-card');

    // Función para actualizar el contador del carrito en el ícono
    function updateCartCount() {
        cartCount.textContent = cart.length;
    }

    // Función para guardar el carrito en el almacenamiento local del navegador
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

    // Función para renderizar los productos en el modal del carrito
    function renderCart() {
        cartItemsContainer.innerHTML = '';
        let totalPrice = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>El carrito está vacío.</p>';
        } else {
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>Talla: ${item.size}</p>
                        <p>$${item.price} x ${item.quantity}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="decrease-btn" data-id="${item.id}" data-size="${item.size}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-btn" data-id="${item.id}" data-size="${item.size}">+</button>
                    </div>
                    <button class="remove-item-btn" data-id="${item.id}" data-size="${item.size}">Eliminar</button>
                `;
                cartItemsContainer.appendChild(itemElement);
                totalPrice += item.price * item.quantity;
            });
        }
        cartTotalPrice.textContent = totalPrice.toFixed(2);
    }

    // --- Event Listeners ---

    // Manejar clics generales en la página (para selección de talla, añadir al carrito, etc.)
    document.addEventListener('click', (e) => {
        // Lógica para seleccionar talla
        if (e.target.classList.contains('size-option')) {
            const productSizes = e.target.closest('.sizes').querySelectorAll('.size-option');
            productSizes.forEach(size => size.classList.remove('selected'));
            e.target.classList.add('selected');
        }
        
        // Lógica para añadir al carrito
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productCard = e.target.closest('.product-card');
            const selectedSize = productCard.querySelector('.size-option.selected');

            if (!selectedSize) {
                alert('Por favor, selecciona una talla.');
                return;
            }

            const product = {
                id: productCard.dataset.productId,
                name: productCard.dataset.name,
                price: parseFloat(productCard.dataset.price),
                size: selectedSize.dataset.size,
                image: productCard.querySelector('img').src,
            };

            const existingItem = cart.find(item => item.id === product.id && item.size === product.size);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                product.quantity = 1;
                cart.push(product);
            }

            saveCart();
            alert(`${product.name} ha sido añadido al carrito.`);
        }

        // Lógica para aumentar cantidad en el carrito
        if (e.target.classList.contains('increase-btn')) {
            const id = e.target.dataset.id;
            const size = e.target.dataset.size;
            const item = cart.find(i => i.id === id && i.size === size);
            if (item) {
                item.quantity++;
                saveCart();
                renderCart();
            }
        }

        // Lógica para disminuir cantidad en el carrito
        if (e.target.classList.contains('decrease-btn')) {
            const id = e.target.dataset.id;
            const size = e.target.dataset.size;
            const item = cart.find(i => i.id === id && i.size === size);
            if (item && item.quantity > 1) {
                item.quantity--;
                saveCart();
                renderCart();
            }
        }

        // Lógica para eliminar un artículo del carrito
        if (e.target.classList.contains('remove-item-btn')) {
            const id = e.target.dataset.id;
            const size = e.target.dataset.size;
            cart = cart.filter(item => !(item.id === id && item.size === size));
            saveCart();
            renderCart();
        }
    });

    // Abrir y cerrar el modal del carrito
    cartIcon.addEventListener('click', () => {
        cartModal.style.display = 'flex';
        renderCart();
    });

    closeModalBtn.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // Lógica para el buscador (mostrar/ocultar la barra)
    searchIconBtn.addEventListener('click', (e) => {
        e.preventDefault();
        searchBar.classList.toggle('active');
        if (searchBar.classList.contains('active')) {
            searchInput.focus();
        } else {
            searchInput.blur();
            searchInput.value = '';
            filterProducts('');
        }
    });

    // Lógica de filtrado de productos al escribir en el input
    searchInput.addEventListener('input', (e) => {
        filterProducts(e.target.value);
    });

    // Función de filtrado de productos
    function filterProducts(searchTerm) {
        searchTerm = searchTerm.toLowerCase();

        allProducts.forEach(product => {
            const productName = product.querySelector('h3').textContent.toLowerCase();
            
            if (productName.includes(searchTerm)) {
                product.style.display = 'block'; 
            } else {
                product.style.display = 'none';
            }
        });
    }

    // Inicializar el contador del carrito al cargar la página
    updateCartCount();
});