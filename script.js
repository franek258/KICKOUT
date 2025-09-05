// Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// Konfiguracja Firebase (wstaw swoje dane)
const firebaseConfig = {
  apiKey: "TWOJ_API_KEY",
  authDomain: "twoj-projekt.firebaseapp.com",
  projectId: "twoj-projekt",
  storageBucket: "twoj-projekt.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdefghijk"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Wyświetlanie produktów
async function displayProducts(search = "") {
    const container = document.querySelector('.products');
    if (!container) return;

    let q;
    if(search) {
        q = query(
            collection(db, "products"),
            where("name", ">=", search),
            where("name", "<=", search + "\uf8ff")
        );
    } else {
        q = collection(db, "products");
    }

    const querySnapshot = await getDocs(q);
    container.innerHTML = '';

    querySnapshot.forEach(doc => {
        const p = doc.data();
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
            <img src="${p.imageUrl}" alt="${p.name}" style="width:100%; height:150px; object-fit:cover;">
            <h3>${p.name}</h3>
            <p>${p.price} PLN</p>
            ${p.tag ? `<span style="color:red; font-weight:bold;">${p.tag}</span>` : ""}
            <button onclick="addToCart('${doc.id}', '${p.name}', ${p.price})">Dodaj do koszyka</button>
        `;
        container.appendChild(div);
    });
}

// Wyszukiwanie produktów
const searchInput = document.querySelector('header input[type="text"]');
searchInput?.addEventListener('input', (e) => {
    displayProducts(e.target.value);
});

// Koszyk w localStorage
function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({id, name, price});
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${name} dodano do koszyka!`);
}

// Wyświetlanie koszyka
window.showCart = function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if(cart.length === 0) {
        alert("Koszyk jest pusty");
        return;
    }
    let message = "Twój koszyk:\n\n";
    let total = 0;
    cart.forEach(item => {
        message += `${item.name} - ${item.price} PLN\n`;
        total += item.price;
    });
    message += `\nŁącznie: ${total.toFixed(2)} PLN`;
    alert(message);
}

// Inicjalizacja na stronie kolekcji
if (document.querySelector('.products')) {
    displayProducts();
}
