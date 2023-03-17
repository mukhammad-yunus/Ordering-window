import { menuArray } from "./data.js"
const formWindow = document.getElementById('form-window')
let isOrdered = false

document.addEventListener("submit", function(e){
    e.preventDefault()

    const dataFromForm = new FormData(formWindow)
    const name = dataFromForm.get('name')
    isOrdered = true

    formWindow.innerHTML = `
    <div class="modal-inner-loading">
        <img src="img/loading.svg" class="loading">
        <p>Dear <b>${name}</b>! Registering your order, please hold on a second ...</p>
    </div>`

    setTimeout(() => {
        formWindow.innerHTML = `
        <button class="close-form-btn" id="close-form-btn">x</button>
    <div class="modal-inner-loading">
        <img src="img/done.svg" class="done">
        <p>Thank you for your order. It will be delivered within a half an hour!<br> <b>${name}</b>, we love you, we're happy to serve you!</p>
    </div>`
    }, 1500);
})

document.addEventListener('click', function(e){
    if(e.target.dataset.add){
        handleAddClick(e.target.dataset.add)
    }
    else if(e.target.dataset.remove){
        handleRemoveClick(e.target.dataset.remove)
    }
    else if(e.target.id === 'order-btn'){
        handlePaymentDisplayClick()
    }
    else if(e.target.id === 'close-form-btn'){
        handleClosePaymentDisplayClick()
    }
    else if(e.target.id === "pay-btn"){
        handlePayBtnCLick()
    }
})


function handleAddClick(foodId){
    const targetMenuObj = menuArray.filter(function(menu){
        return menu.id === foodId
    })[0]
    targetMenuObj.order ++
    render()
    window.scrollTo(0, document.body.scrollHeight)
}

function handleRemoveClick(foodId){
    const targetMenuObj = menuArray.filter(function(menu){
        return menu.id === foodId
    })[0]
    targetMenuObj.order --
    render()
}

function handlePaymentDisplayClick(){
    formWindow.style.display = 'block'
    formWindow.innerHTML = `
    <h3 class="color-dark">Enter card details</h3>
    <button class="close-form-btn" id="close-form-btn">x</button>
    <input type="text" name="name" id="name" placeholder="Enter your name" required>
    <input type="text" name="card-number" id="card-number" placeholder="Enter your card number" required>
    <input type="text" name="cvv" id="cvv" placeholder="Enter your CVV" required>

    <button class="order-btn" id="pay-btn">Pay</button>`
}

function handleClosePaymentDisplayClick(){
    formWindow.style.display = 'none'
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.value = '';
    });

    if(isOrdered){
        menuArray.forEach(function(menu) {
            menu.order = 0;
          });
        render()
        isOrdered = false
    }
}


function render(){
    const orderWindow = document.getElementById('order-window')
    let menuHtml = ''
    let orderHtml = ''
    let totalPriceHtml = ''
    let totalPrice = 0
    menuArray.forEach(function(menu){
        const disableMinus = menu.order < 1;
        menuHtml += `
        <div class="center-container" id="render-menu">
            <h1 class="food-image">${menu.emoji}</h1>
            <div class="menu-details">
                <h3 class="color-dark">${menu.name}</h3>
                <p class="color-grey">${menu.ingredients}</p>
                <p class="color-dark">$${menu.price}</p>
            </div>
            <div class="small-btn-container">
            <button class="small-circle-btn" data-remove="${menu.id}" ${disableMinus ? "disabled" : ""}>-</button>
            <button class="small-circle-btn" data-add="${menu.id}">+</button>
            </div>
        </div>`

        if(menu.order > 0){
            orderWindow.style.display = 'block'
            let priceHtml = menu.order*menu.price
            orderHtml += `
            <div class="display-flex">
            <h3 class="color-dark">${menu.name} <span class="color-grey">x ${menu.order}</span></h3>
            <h3 class="color-dark"> $${priceHtml}</h3>
            </div>`
            totalPrice += priceHtml
        } 
        if(!totalPrice){
            orderWindow.style.display = 'none'
        }
        if(totalPrice) {
            totalPriceHtml =`
            <h3 class="color-dark">Total price</h3>
            <h3 class="color-dark">$${totalPrice}</h3>`

        }
        
        })
        document.getElementById('menu-window').innerHTML = menuHtml
        document.getElementById('order-items').innerHTML = orderHtml
        document.getElementById('total-price').innerHTML = totalPriceHtml
}

render()