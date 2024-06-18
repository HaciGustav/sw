const scrollers = document.querySelectorAll('.h-scroll-container');

if(!window.matchMedia('(prefers-reduces-motion: reduced)').matches){
    initAnimations();
}

function initAnimations(){
    scrollers.forEach(scroller => {
        scroller.setAttribute('data-animated', true);
        const scroller_inner = scroller.querySelector('.h-scroll-wrapper');
        const scroller_content = Array.from(scroller_inner.children);
        scroller_content.forEach(elmnt => {
            const duplicate = elmnt.cloneNode(true);
            duplicate.setAttribute('aria-hidden', true);
            scroller_inner.appendChild(duplicate);
        });
    })
}

function filter(elmnt, category){
    Array.from(elmnt.parentElement.querySelectorAll('li')).forEach(filter => {
        filter.classList.remove('active');
    });
    elmnt.classList.add('active');
    Array.from(elmnt.parentElement.parentElement.querySelector('.filter-container-items').children).forEach(item => {
        if(category !== 'all' && !Array.from(item.classList).includes(category)){ item.classList.add('hidden'); }
        else{ item.classList.remove('hidden'); }
    });
}
    async function addCredits(userId, credits) {
        try {
            const response = await fetch('http://localhost:8080/api/users/add-credits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, credits }),
            });
            const data = await response.json();
            console.log(data); // Handle response as needed
            // Optionally update UI or show a message indicating success/failure
        } catch (error) {
            console.error('Error adding credits:', error);
            // Handle error scenario, show error message to user, etc.
        }
    }
    
    // Function to purchase product with credits
    async function purchaseProduct(userId, productId) {
        try {
            const response = await fetch('http://localhost:8080/api/users/purchase-product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, productId }),
            });
            const data = await response.json();
            console.log(data); // Handle response as needed
            // Optionally update UI or show a message indicating success/failure
        } catch (error) {
            console.error('Error purchasing product:', error);
            // Handle error scenario, show error message to user, etc.
        }
    }



    // FORMS

    const validate_login = () => {
        if(document.forms['login-form']['email'].value === '' || document.forms['login-form']['password'].value === ''){
            alert('Please fill in all fields');
            return false;
        }
    }

    const validate_register = () => {
        if(document.forms['register-form']['email'].value === ''
            || document.forms['register-form']['password'].value === ''
            || document.forms['register-form']['firstname'].value === ''
            || document.forms['register-form']['lastname'].value === ''
            || document.forms['register-form']['address'].value === ''
        ){
            alert('Please fill in all fields');
            return false;
        }
        if(document.forms['register-form']['password'].value != document.forms['register-form']['password2'].value
        ){
            alert('The passwords do not match!');
            return false;
        }
    }

    const login = () => {
        fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: document.forms['login-form']['email'].value,
                password: document.forms['login-form']['password'].value,
            }),
        }).then((response) => {
            console.log(response);
            if(!response.ok){
                alert("The login attempt has failed!");
            }
        }).catch(error => {
            console.error(error);
            alert("There has been an error!");
        })
    }

    const register = () => {
        fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: document.forms['register-form']['email'].value,
                password: document.forms['register-form']['password'].value,
                firstname: document.forms['register-form']['firstname'].value,
                lastname: document.forms['register-form']['lastname'].value,
                address: document.forms['register-form']['address'].value,
            }),
        }).then((response) => {
            console.log(response);
            if(!response.ok){
                alert("The signup attempt has failed!");
            }
        }).catch(error => {
            console.error(error);
            alert("There has been an error!");
        })
    }

    window.onload = () => {
        const grid = document.querySelector("#grid .grid-container")
        const scroll = document.querySelector("#scroll .h-scroll-wrapper")
        fetch('/api/products').then((resp) => {
            if(!resp.ok){
                alert("There has been an error!");
            }
            return resp.json();
        }).then((products) => {
            console.log(products);
            products.forEach((product, index) => {
                grid.innerHTML += `
                <button popovertarget="product_${index}">
                    <div class="grid-item grid-item-xl">
                        <img src="${product.images[0]}" alt="${product.title}">
                        <div class="overlay">${product.title}</div>
                    </div>
                    <div id="product_${index}" class="product_popover" popover>${product.title}</div>
                </button>
                `
                scroll.innerHTML += `
                    <li class="grid-item grid-item-m">
                        <img src="${product.images[0]}" alt="${product.title}">
                        <div class="overlay">${product.title}</div>
                    </li>`
            })
        })
    }