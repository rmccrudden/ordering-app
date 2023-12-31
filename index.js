import menuArray from '/data.js'
let ordersArr = []
let displayPaymentModal = false
const paymentModal = document.getElementById('checkout-modal')
//adds event listeners to buttons using data attributes
document.addEventListener(`click`, (e) => {
    if (e.target.dataset.add) {
        handleAddClick(e.target.dataset.add)
        runOrderCalls()
    }
    else if (e.target.dataset.remove) {
        handleRemoveClick(e.target.dataset.remove)
        runOrderCalls()
        }
    else if (e.target.dataset.complete) {
        handleCompleteOrderClick(e.target.dataset.complete)
        displayPaymentModal = !displayPaymentModal
    }
    else if (e.target.dataset.close) {
        handleCompleteOrderClick(e.target.dataset.close)
        displayPaymentModal = !displayPaymentModal //resets the boolean variable displalPaymentModal to false after closing to 
        //prevent the Complete Order button having to be clicked twice to flip the boolean to allow the modal to be displayed again
    }
    else if (e.target.dataset.pay) {
        handlePayNowClick(e.target.dataset.pay)
    }
})

function runOrderCalls() {
    updateOrder()
    getOrderTotal()
    checkoutBtn()
    
}

function createMenu() {
const menuOption = menuArray.map(function(menuItem) {
    return `
    <div id="menu-option" class="menu-item">
        <span class="menu-item-icon">${menuItem.emoji}</span>
        <div class="menu-item-details">
            <h4 class="menu-item-title" 
            data-menu-item-title=${menuItem.name}>${menuItem.name}</h4>
            <p class="menu-item-ingredients" 
            data-menu-item-ingredients=${menuItem.ingredients}>${menuItem.ingredients}</p>
            <span class="menu-item-price"
            data-price=${menuItem.price}>&dollar;${menuItem.price}</span>
        </div>
        <ion-icon id="add-button" size="large" 
        data-add=${menuItem.id} name="add-circle"></ion-icon>
    </div>
        <div class="divider"></div>
        `
}).join('')

return menuOption
}

// Adds the order items to the item summary. Originally all on single lines, refactored to provide a counter of each item.
function updateOrder() {
    const orderItems = ordersArr.map(function(orderItem) {
        return `        
        <div class="order-item">
            <h4 class="order-item-title">${orderItem.name}</h4>
            <div class="quantity-wrapper">
            <ion-icon class="quantity-update" name="remove-circle-outline"
            data-remove=${orderItem.id}></ion-icon>
            <span class="order-item-count">${orderItem.quantity}</span>
            <ion-icon class="quantity-update" name="add-circle-outline" 
            data-add=${orderItem.id}></ion-icon>
            </div>
            <span class="order-item-price">&dollar;${(orderItem.price * orderItem.quantity).toFixed(2)}</span>
        </div>
        `
    }).join('') 
    document.getElementById("added-items").innerHTML = orderItems
}

//function handleRemoveClick() removes an item from the ordersArr using the splice method(). This does mutate the original array. 
function handleRemoveClick(orderItemId) {
    const orderItemObj = ordersArr.filter(orderItem => orderItem.id === +orderItemId)[0]
    orderItemObj.quantity--
    const itemIndex = ordersArr.findIndex(orderItem => orderItem.quantity === 0)

    if (itemIndex >= 0) {
        ordersArr.splice(itemIndex, 1); // Remove the item from the order
    }
}
// function handleAddClick() handles checking if item matches id on menuArray, then pushes to ordersArr
function handleAddClick(menuItemId) {
    const menuItemObj = ordersArr.filter(orderItem => orderItem.id === +menuItemId)
    //     // + symbol is short hand for outputting a sting so data types are the same. Refactored from using the toString() method
    //     return +menuItemId === menuItem.id
    // })[0]

    //using a ternary operator to check the length of ordersArr. Checks if the ordersArr is truthy, then increment the quantity,
    //or if it's empty i,e. falsy, push the matching object with a quantity of 1.  
    menuItemObj.length ? menuItemObj[0].quantity++
        : ordersArr.push({
            id: +menuItemId,
            quantity: 1,
            name: menuArray[menuItemId].name,
            price: menuArray[menuItemId].price
        })
}

function calculateTotalPrice() {
    const totalPrice = ordersArr.reduce((total, orderItem) => {
        return total + (orderItem.price * orderItem.quantity)
    }, 0)
    return totalPrice.toFixed(2)
}

// checks the calculated price, then checks if the completeBtnContainer is falsy i.e. doesn't exist, if so creates 
// this and the button as a child element. 
function checkoutBtn() {
  const totalPrice = calculateTotalPrice()
  const completeBtnContainer = document.querySelector(".complete-btn-container")
  if (totalPrice > 0) {
      if(!completeBtnContainer) {
      const div = document.createElement("div")
      const completeOrderBtn = document.createElement("button")
      completeOrderBtn.textContent = "Complete Order"
      completeOrderBtn.classList.add("green-btn")
      completeOrderBtn.id = "completeBtn"
      completeOrderBtn.dataset.complete = "complete" //Adding a data attribute for the event listener when creating the button
      div.classList.add("complete-btn-container")
      document.getElementById('order-summary').append(div)
      div.appendChild(completeOrderBtn)
    }
 } 
 else if (completeBtnContainer) {
      completeBtnContainer.remove()
  }
}

function render() {
    document.getElementById("menu").innerHTML = createMenu()
    document.getElementById("order-summary").innerHTML = orderSummary()
}

function getOrderTotal() {
    const totalOrderPrice = calculateTotalPrice()
    const totalPriceEl = document.getElementById("order-total")
    if (ordersArr.length > 0) {
        totalPriceEl.textContent = `$${totalOrderPrice}`
    }
    else {
        totalPriceEl.textContent = `$0`
    }
}

// function to handle what happens when the complete order button is clicked. 
// boolean variable is flipped from false to true when the button is clicked, which in turn updated the hiddenClass variable to be blank and displays the payment modal. 
function handleCompleteOrderClick() {
    let hiddenClass = 'hidden'

   if(!displayPaymentModal) {
    hiddenClass = ''
   }
    let paymentHtml = `
    <div class="modal-window" data-modal='modal' ${hiddenClass}>
    <div class="modal-wrapper" >
    <ion-icon name="close-circle" data-close="close" class="modal-close-icon"></ion-icon>
        <div class="modal-container ">
            <h4>Enter Payment Details</h4>
                <form id="payment-form">
                    <input name="name" placeholder="Enter your name" type="text" required /> 
                    <input name="card" placeholder="Enter card number" type="text" required /> 
                    <input name="cvv" placeholder="Enter CVV number" type="text" required /> 
                    <button id="complete-payment" type="submit" class="green-btn" name="pay-btn" data-pay="pay">Pay Now</button>
                </form>
                
        </div>
    </div>
    </div>
    `
    paymentModal.innerHTML = paymentHtml
}

//function to handle when the Pay Now button is clicked. Form is validated and button disbaled to prevent repeated form submissions. POST method removed from form.
function handlePayNowClick() {
    const paymentForm = document.getElementById('payment-form')    
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault()

    const paymentFormData = new FormData(paymentForm)
    const name = paymentFormData.get('name')
    
    let paymentHtml = `
        <div class="modal-window" data-modal='modal'>
        <div class="modal-wrapper" >
        <ion-icon name="close-circle" data-close="close" class="modal-close-icon"></ion-icon>
            <div class="modal-container">
                <h4>${name}, your order being processed...</h4>
                <img src="/icons8-loading.gif" class="payment-process">
            </div>
        </div>
        </div>
        `
        paymentModal.innerHTML = paymentHtml
    

    setTimeout(function(){
        let paymentHtml = `
        <div class="modal-window" data-modal='modal'>
        <div class="modal-wrapper">
        <ion-icon name="close-circle" data-close="close" class="modal-close-icon"></ion-icon>
            <div class="modal-container">
                <h4>Thanks, ${name}! Your order has been processed.</h4>
                <img src="/payment-processing.gif" class="payment-process">
            </div>
        </div>
        </div>
        `
        paymentModal.innerHTML = paymentHtml
    }, 2000) 
})
    }

    

// orderSummary() returns the HTML template to be populated with order items when added
function orderSummary() {
        return `
        <h4 class="order-summary-title">Your Order</h4>
        <div class="order-items-container" id="added-items">      
            <!--Order Items will populate here-->
        </div>
        <div class="order-divider"></div>
            <div class="order-price-summary" id="order-summary">
                <h4 class="order-total-title">Total price:</h4>
                <span class="order-total-price" id="order-total">&dollar;0</span>
             </div>
        `
}
render()