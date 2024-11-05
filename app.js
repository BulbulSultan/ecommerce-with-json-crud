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

localStorage.setItem('isLogged', "false")
const isLogged = localStorage.getItem('isLogged');
const loggedUserId = null;
console.log(isLogged);


const checkUserLogin = ()=>{
    if(isLogged !== null || isLogged !== 'false'){
        products.classList.remove('d-none');
        not_show.classList.add('d-none');
        not_show.classList.remove('d-block');
    }else{
        products.classList.add('d-none');
        not_show.classList.add('d-none');
        not_show.classList.remove('d-block');
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
                console.log('email duzdur');
                if (axtar.password === password_login.value) {
                    console.log('parolda duzdur');
                    localStorage.setItem('isLogged', "true");
                    loginBtn.classList.add('d-none')
                    logoutBtn.classList.remove('d-none')
                    registerBtn.classList.add('d-none')
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

signUpBtn.addEventListener('click', signUpUser)
signInBtn.addEventListener('click', signInUser)
logoutBtn.addEventListener('click', logoutAccount);

document.addEventListener('DOMContentLoaded', checkUserLogin)