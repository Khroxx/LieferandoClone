menu = ['Hamburger', 'Double Beef Burger', 'Cheese Burger', 'Bacon Burger', 'Onionrings', 'Pommes', 'Pizza Salami', 'Pizza Diavolo', 'Pizza Margherita'];
menuDesc = ['Saftiger Burger mit lokalem Rindfleisch', 'Doppelt so viel vom Guten!', 'Für Käseliebhaber', 'Nicht genug Fleisch? Dann mit Bacon', 'Innen süß und zart, außen knusprig und hart', 'Der Klassiker der beilagen', 'Dinkelteig, die besten Tomaten und der beste Käse und dazu gute Salami vom Rind', 'Für diejenigen, die es extra Scharf mögen', 'Oder diejenigen, für die wenig auch viel ist']
price = [4.99, 6.99, 4.99, 5.49, 2.49, 3.49, 6.99, 7.49, 5.99 ];
menuBasket = [];
menuPrice = [];
basket = [];

function renderMenu(){
    let mainpage = document.getElementById('itemContainer');
    mainpage.innerHTML = '';
    for (let i = 0; i < menu.length; i++) {
        const menuItem = menu[i];
        const priceItem = price[i];
        const ItemDesc = menuDesc[i];
        mainpage.innerHTML += renderMenuItems(menuItem, priceItem, ItemDesc);
    }

}
function renderMenuItems(menuItem, priceItem, ItemDesc) {
    const formattedPriceItem = priceItem.toFixed(2).replace('.', ',');
    return `
    <div class="menuContainer">
    <h2>${menuItem}<p class="price">${ItemDesc}</p></h2>
    <div class="priceTag"><h2>${formattedPriceItem}€</h2><button class="addBtn" onclick="addToBasket('${menuItem}', '${priceItem}')"><img id="plusimage" src="img/plus.png"></button></div>

    </div>
    `
}

function addToBasket(menuItem, priceItem){
    if (basket[menuItem]) {
        basket[menuItem].quantity++;
    } else {
        basket[menuItem] = {
            price: priceItem,
            quantity: 1
        };
    }
    document.getElementById('items').innerHTML = '';
        for (const item in basket) {
            document.getElementById('items').innerHTML += renderBasket(item, basket[item]);
        }
        document.getElementById('lieferkosten').innerText = `Gesamtpreis: ${calcTotalPrice().toFixed(2).replace('.', ',')}€`;
    save();
}
function renderBasket(basketItems, basketPrice){
    const totalItemPrice = (basketPrice.price * basketPrice.quantity).toFixed(2).replace('.', ',');
    return `
    <div class="basketItem">
    <table><tr>
    <td class="numberAlign">${basketPrice.quantity}x</td>
    <td class="leftAlign"> ${basketItems}</td>
    <td class="tdBtn"><button class="quantityBtn" onclick="delQuantity('${basketItems}')">-</button></td><td class="tdBtn"><button class="quantityBtn" onclick="addQuantity('${basketItems}')">+</button></td>
    <td class="rightAlign"> ${totalItemPrice}€</td>
    </tr></table>
    </div>
    `
}

function calcTotalPrice(){
    let totalPrice = 0;
    for (const item in basket) {
        const price = parseFloat(basket[item].price);
        const quantity = basket[item].quantity;
        if (!isNaN(price) && !isNaN(quantity)) {
            totalPrice += price * quantity;
        }
    }
    return totalPrice;
}

function payBasket() {
    let totalPrice = calcTotalPrice(basket);
    let formattedTotalPrice = totalPrice.toFixed(2).replace('.', ',');
    let confirmed = window.confirm(`Jetzt ${formattedTotalPrice}€ bezahlen und in Auftrag geben?`);
    if (confirmed) {
        basket = {};
        renderBasketItems(basket);
        document.getElementById('lieferkosten').innerText = 'Gesamtpreis: 0,00€';
        updatePayButton(0);
        save();
    }
}

// localstorage 
function save() {
    let basketItems = Object.entries(basket).map(([item, { price, quantity }]) => ({ item, price, quantity }));
    localStorage.setItem('basket', JSON.stringify(basketItems));
    load();
}

function loadBasket() {
    let storedBasket = localStorage.getItem('basket');
    if (storedBasket) {
      let basketItems = JSON.parse(storedBasket);
      basket = {};
      for (let { item, price, quantity } of basketItems) {
        basket[item] = { price, quantity };
      }
      return basket;
    }
    return {};
}
  
function renderBasketItems(basket) {
    let basketItems = document.getElementById('items');
    let basketItemsBasket = document.getElementById('basketItems')
    if (basketItems) {
        basketItems.innerHTML = '';
        for (let item in basket) {
            basketItems.innerHTML += renderBasket(item, basket[item]);
        }
    } if (basketItemsBasket) {
        for (let item in basket) {
            basketItemsBasket.innerHTML += renderOtherBasket(item, basket[item]);
        }
    }
}
  
function calcTotalPrice(basket) {
    let total = 0;
    for (let item in basket) {
      total += basket[item].price * basket[item].quantity;
    }
    return total;
}

function updatePayButton(totalPrice) {
    let payButton = document.getElementById('pay');
  if (totalPrice >= 20) {
    payButton.disabled = false;
    payButton.style.backgroundColor = 'aqua';
    payButton.style.cursor = 'pointer';
  } else {
    payButton.disabled = true;
    payButton.style.backgroundColor = 'rgb(107, 107, 107)';
    payButton.style.cursor = 'default';
    payButton.style
  }
}
function load() {
    let basket = loadBasket();
    renderBasketItems(basket);
    let totalPrice = calcTotalPrice(basket);
    document.getElementById('lieferkosten').innerText = `Gesamtpreis: ${totalPrice.toFixed(2).replace('.', ',')}€`;
    updatePayButton(totalPrice);
}

function delQuantity(menuItem){
    if (basket[menuItem] && basket[menuItem].quantity > 0) {
        basket[menuItem].quantity--;
        if (basket[menuItem].quantity === 0) {
            delete basket[menuItem];
        }
    }
    document.getElementById('items').innerHTML = '';
    for (const item in basket) {
        document.getElementById('items').innerHTML += renderBasket(item, basket[item]);
    }
    document.getElementById('lieferkosten').innerText = `Gesamtpreis: ${calcTotalPrice().toFixed(2).replace('.', ',')}€`;
    save();
}

function addQuantity(menuItem) {
    if (basket[menuItem] && basket[menuItem].quantity >= 0) {
        basket[menuItem].quantity++;
    } else {
        basket[menuItem] = {
            price: menuPrice[menu.indexOf(menuItem)],
            quantity: 1
        };
    }
    document.getElementById('items').innerHTML = '';
    for (const item in basket) {
        document.getElementById('items').innerHTML += renderBasket(item, basket[item]);
    }
    document.getElementById('lieferkosten').innerText = `Gesamtpreis: ${calcTotalPrice().toFixed(2).replace('.', ',')}€`;
    save();
}

function extendBasket() {
    document.getElementById('items').style.display = 'flex';
    document.getElementById('extend').style.display = 'none';
    document.getElementById('retract').style.display = 'flex';
    document.getElementById('basket').style.height = '70%';
}
function retractBasket() {
    document.getElementById('items').style.display = 'none';
    document.getElementById('extend').style.display = 'flex';
    document.getElementById('retract').style.display = 'none';
    document.getElementById('basket').style.height = '180px';
}
function checkWidth() {
    if (window.innerWidth >= 800) {
        document.getElementById('extend').style.display = 'flex';
        document.getElementById('retract').style.display = 'none';
        document.getElementById('basket').style = 'height: 100vh';
        document.getElementById('items').style.display = 'flex';
        transitionScroll();
    } if (window.innerWidth < 800) {
        retractBasket();
    }
}
  
document.addEventListener("DOMContentLoaded", () => {
    checkWidth();
    window.addEventListener("resize", checkWidth);
});

window.onscroll = function () {
    let basket = document.getElementById('basket');
    if (window.innerWidth > 800) {
        transitionScroll();
    } if(window.innerWidth < 800){
        retractBasket();

}
}
function transitionScroll() {
    let basket = document.getElementById('basket');
     if (window.scrollY > 0){
            basket.style = 'top: 0';
        } else {
            basket.style = 'top: 100px'
        }  
}