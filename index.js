import menuArray from '/data.js'
let ordersArr = []

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

function updateOrder() {
        const orderItems = ordersArr.map(function(orderItem) {
        return `        
        <div class="order-item">
            <h4 class="order-item-title">${orderItem.name}</h4>
            <span class="remove-order-item"
            data-remove=${orderItem.id}>remove</span>
            <span class="order-item-price">&dollar;${orderItem.price}</span>
        </div>
        `
    }).join('')
    document.getElementById("added-items").innerHTML = orderItems
}

//function removeItemFromOrder() removes an item from the ordersArr using the splice method(). This does mutate the original array. 
function handleRemoveClick(orderItemId) {
    const itemIndex = ordersArr.findIndex((orderItem) => orderItemId === orderItem.id.toString());

    // !== -1 means a value has been found
    if (itemIndex !== -1) {
        ordersArr.splice(itemIndex, 1); // Remove the item from the order
    }
}

// function addToOrder handles checking if item matches id on menuArray, then pushes to ordersArr
function handleAddClick(menuItemId) {
    const menuItemObj = menuArray.filter(function(menuItem) {
        // + is outputting a sting so data types are the same. Refactored from toString() method
        return +menuItemId === menuItem.id
    })[0]
    //checking there is an object to push, if not terminates
    if (menuItemObj) {
    ordersArr.push(menuItemObj)
    }
}

function calculateTotalPrice() {
    const totalPrice = ordersArr.reduce((total, orderItem) => {
        return total + orderItem.price
    }, 0)
    return totalPrice.toFixed(2)
}

// checks the calculated price, then checks if the completeBtnContainer is falsy, if so creates this and the button as a child element. 
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

function handleCompleteOrderClick() {
    console.log("Complete irder Clicked")
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
                <span class="remove-order" id="remove-order">Remove Order</span>
                <h4 class="order-total-title">Total price:</h4>
                <span class="order-total-price" id="order-total">&dollar;0</span>
             </div>
        `
}
render()