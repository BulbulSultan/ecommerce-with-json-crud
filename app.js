const loginBtn = document.getElementById('loginBtn')
const logoutBtn = document.getElementById('logoutBtn')
const registerBtn = document.getElementById('registerBtn');

const email_login = document.getElementById('email-login')
const password_login = document.getElementById('password-login')
const signInBtn = document.getElementById('signInBtn');

const email_register = document.getElementById('email-register')
const password_register = document.getElementById('password-register')
const confirm_password = document.getElementById('confirm-password-register')
const signUpBtn = document.getElementById('signUpBtn');
const not_show = document.getElementById('not-show')
const products = document.getElementById('products')

const basketModal = document.getElementById('basketModal')
const closeBasketBtn = document.getElementById('closeBasketBtn')
const basket_container_body = document.querySelector('.basket-container-body');
const totalPrice = document.getElementById('totalPrice');


localStorage.setItem('isLogged', "false")
const isLogged = localStorage.getItem('isLogged');
let loggedUserId = '69be';
let productList = [];
let userBasket = [];
let userWishlist = [];
const checkUserLogin = () => {
    if (JSON.parse(isLogged)) {
        products.classList.remove('d-none');
        not_show.classList.add('d-none');
        not_show.classList.remove('d-block');
    } else {
        products.classList.add('d-none');
        not_show.classList.remove('d-none');
        not_show.classList.add('d-block');

    }
}

const signUpUser = async () => {
    try {
        if (email_register.value.trim() === "" || password_register.value.trim() === "" || confirm_password.value.trim() === "") {
            alert('xanalari doldurun')
        } else if (password_register.value !== confirm_password.value) {
            alert('Parollar eyni olmalidir')
        } else {
            const data = {
                email: email_register.value,
                password: password_register.value,
                basket: [],
                favorites: []
            }
            const req = await fetch('http://localhost:3010/istifadeciler', {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-type": "Application/json"
                }
            });
            if (req.status === 201) {
                alert('Tebrikler')
            } else {
                alert('Xeta bas verdi')
            }
        }
    } catch (error) {
        console.error(error);

    }
}

const signInUser = async () => {
    try {
        if (email_login.value.trim() === '' || password_login.value.trim() === '') {
            alert('giris ucun melumatlari daxil edin')
        } else {
            const req = await fetch('http://localhost:3010/istifadeciler');
            const users = await req.json();

            const axtar = users.find(item => item.email === email_login.value);
            if (axtar) {
                if (axtar.password === password_login.value) {
                    localStorage.setItem('isLogged', "true");
                    loginBtn.classList.add('d-none')
                    logoutBtn.classList.remove('d-none')
                    registerBtn.classList.add('d-none');
                    products.classList.remove('d-none');
                    not_show.classList.add('d-none');
                    not_show.classList.remove('d-block');
                    userBasket = [...axtar.basket];
                    userWishlist = [...axtar.favorites];

                    loggedUserId = axtar.id;
                } else {
                    alert('Parolunz yanlisdir')
                }
            } else {
                alert('bele bir email bazada mopvcud deyil')
            }
        }
    } catch (error) {
        console.error(error);

    }
}

const logoutAccount = () => {
    localStorage.setItem('isLogged', "false");
    loginBtn.classList.remove('d-none')
    logoutBtn.classList.add('d-none')
    registerBtn.classList.remove('d-none')
}

const fetchProducts = async () => {
    try {
        const req = await fetch('http://localhost:3010/mehsullar');
        const products = await req.json();
        productList = [...products];
        showProducts(products)
    } catch (error) {
        console.error(error);
    }
}

const showProducts = (arr) => {
    products.innerHTML = '';
    arr.forEach(item => {
        products.innerHTML += `
        <div class="card col-4" style="width: 12rem;">
            <img src="${item.image}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${item.name}</h5>
                <div class="d-flex justify-content-between">
                    <p class="card-text">${item.price}</p>
                    <i data-id='${item.id}' onclick='addToWishlist("${item.id}", this)' class="fa-solid fa-heart"></i>
                </div>
                <button type="button" data-stock='${item.stock}' data-id='${item.id}' class="btn btn-primary" onclick='addToBasket("${item.id}")'>Add to basket</button>
            </div>
        </div>
        `
    })
}

const addToBasket = id => {
    basketModal.classList.remove('d-none');
    basketModal.classList.add('d-block');
    const product = productList.find(item => item.id === id);
    if (product) {
        const existInBasket = userBasket.find(item => item.id === id);
        if (existInBasket) {
            existInBasket.count++;
        } else {
            userBasket.push({
                id: product.id,
                image: product.image,
                name: product.name,
                price: product.price,
                stock: product.stock,
                count: 1,
            });
        }
        showProductsInBasket(userBasket);
        updateUserBasket(loggedUserId, { basket: userBasket })
    }
}

const showProductsInBasket = arr => {
    const basket_container_body = document.querySelector('.basket-container-body');
    basket_container_body.innerHTML = '';
    const totalPrice = arr.length > 0 ? arr.reduce((toplam, mehsul) => toplam + (mehsul.price * mehsul.count), 0) : 0

    arr.forEach(item => {
        basket_container_body.innerHTML += `
            <div class="basket-container-body-items">
                <div class="basket-container-body-items-item">
                <div class="basket-container-body-items-item-img">
                    <img
                    src="${item.image}"
                    alt=""
                    style="width: 70px; height: 70px"
                    >
                </div>
                <div class="d-flex justify-content-between align-items-center my-4">
                    <span>${item.name}</span>
                    <button type="button" onclick='deleteProductFromBasket("${item.id}")' class="btn btn-danger">X</button>
                </div>
                <div class="d-flex justify-content-between align-items-center my-5">
                    <div class="d-flex align-items-center gap-3">
                    <button type="button" onclick='mehsulSayiAzalt("${item.id}")' class="btn btn-danger">-</button>
                    <span>${item.count}</span>
                    <button type="button" onclick='mehsulSayiArtir("${item.id}")' class="btn btn-success">+</button>
                    </div>
                    <span>${item.price}</span>
                </div>
                </div>
            </div>`
    })
    document.getElementById('totalPrice').innerText = totalPrice
}


const mehsulSayiAzalt = id => {
    const product = userBasket.find(item => item.id === id);
    if (product) {
        if (product.count > 1) {
            product.count--;
            const totalPrice = userBasket.length > 0 ? userBasket.reduce((toplam, mehsul) => toplam + (mehsul.price * mehsul.count), 0) : 0
            document.getElementById('totalPrice').innerText = totalPrice
        } else if (product.count === 1) {
            userBasket = userBasket.filter(item => item.id !== id);
            const totalPrice = userBasket.length > 0 ? userBasket.reduce((toplam, mehsul) => toplam + (mehsul.price * mehsul.count), 0) : 0
            document.getElementById('totalPrice').innerText = totalPrice
        }
    }
    showProductsInBasket(userBasket);
    updateUserBasket(loggedUserId, { basket: userBasket })
}

const mehsulSayiArtir = id => {


    const product = userBasket.find(item => item.id === id);


    if (product) {
        product.count++;
        const totalPrice = userBasket.length > 0
            ? userBasket.reduce((toplam, mehsul) => toplam + (mehsul.price * mehsul.count), 0)
            : 0
        document.getElementById('totalPrice').innerText = totalPrice
    }
    showProductsInBasket(userBasket);
    updateUserBasket(loggedUserId, { basket: userBasket })
}

const deleteProductFromBasket = id => {
    userBasket = userBasket.filter(item => item.id !== id);
    const totalPrice = userBasket.length > 0
        ? userBasket.reduce((toplam, mehsul) => toplam + (mehsul.price * mehsul.count), 0)
        : 0
    document.getElementById('totalPrice').innerText = totalPrice;
    showProductsInBasket(userBasket);
    updateUserBasket(loggedUserId, { basket: userBasket })
}


const addToWishlist = (id, e) => {
    const product = productList.find(item => item.id === id);
    if (product) {
        const existInWishlist = userWishlist.find(item => item.id === id);
        if (existInWishlist) {
            userWishlist = userWishlist.filter(item => item.id !== id);
            e.style.color = 'black'
        } else {
            e.style.color = 'red'
            userWishlist.push({
                id: product.id,
                image: product.image,
                name: product.name,
                price: product.price,
                stock: product.stock,
            });
        };
        updateUserWishlist(loggedUserId, { favorites: userWishlist })
    }
}


const updateUserBasket = async (id, data) => {
    try {
        const req = await fetch(`http://localhost:3010/istifadeciler/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

    } catch (error) {
        console.error(error);

    }
}
const updateUserWishlist = async (id, data) => {
    try {
        const req = await fetch(`http://localhost:3010/istifadeciler/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error(error);

    }
}

closeBasketBtn.addEventListener('click', () => {
    basketModal.classList.remove('d-block');
    basketModal.classList.add('d-none');
})


signUpBtn.addEventListener('click', signUpUser)
signInBtn.addEventListener('click', signInUser)
logoutBtn.addEventListener('click', logoutAccount);

// document.addEventListener('DOMContentLoaded', checkUserLogin)
document.addEventListener('DOMContentLoaded', fetchProducts)