// Inicjalizacja Firebase (CDN)
const firebaseConfig = {
  apiKey: "TWOJ_API_KEY",
  authDomain: "twoj-projekt.firebaseapp.com",
  projectId: "twoj-projekt",
  storageBucket: "twoj-projekt.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdefghijk"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function displayProducts(search = "") {
    const container = document.querySelector('.products');
    if (!container) return;

    let queryRef = db.collection("products");
    if(search) {
        queryRef = queryRef
            .orderBy("name")
            .startAt(search)
            .endAt(search + "\uf8ff");
    }

    queryRef.get().then(snapshot => {
        container.innerHTML = '';
        snapshot.forEach(doc => {
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
    });
}

const searchInput = document.querySelector('header input[type="text"]');
if(searchInput) {
    searchInput.addEventListener('input', (e) => displayProducts(e.target.value));
}

function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({id, name, price});
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${name} dodano do koszyka!`);
}

function showCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if(cart.length === 0) { alert("Koszyk jest pusty"); return; }
    let message = "Twój koszyk:\n\n";
    let total = 0;
    cart.forEach(item => { message += `${item.name} - ${item.price} PLN\n`; total += item.price; });
    message += `\nŁącznie: ${total.toFixed(2)} PLN`;
    alert(message);
}

if(document.querySelector('.products')) { displayProducts(); }
