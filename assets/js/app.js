const menu = {
  burgers: [
    { id: 1, name: "Cheese Burger", price: 550, image: "assets/images/cheese-burger.jpg" },
    { id: 2, name: "Chicken Burger", price: 650, image: "assets/images/chicken-burger.jpg" }
  ],
  fries: [{ id: 3, name: "French Fries", price: 300, image: "assets/images/fries.jpg" }],
  drinks: [{ id: 4, name: "Coke", price: 200, image: "assets/images/coke.jpg" }]
};

let activeCategory = "burgers";
let currentOrder = { orderId: null, customerName: "", items: [], total: 0 };
let orders = JSON.parse(localStorage.getItem("orders")) || [];

/* RENDER MENU */
function renderItems(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "menu-card";
    card.innerHTML = `
      <img src="${item.image}">
      <h4>${item.name}</h4>
      <p>Rs. ${item.price}</p>
      <button>Add</button>`;
    card.onclick = () => addToOrder(item.id);
    container.appendChild(card);
  });
}

renderItems(menu.burgers, "burgersList");
renderItems(menu.fries, "friesList");
renderItems(menu.drinks, "drinksList");

/* TAB */
function openTab(e, tab) {
  document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  document.getElementById(tab).classList.add("active");
  e.target.classList.add("active");
  activeCategory = tab;
}

/* SEARCH */
function searchItems() {
  const q = searchInput.value.toLowerCase();
  const filtered = menu[activeCategory].filter(i => i.name.toLowerCase().includes(q));
  renderItems(filtered, activeCategory + "List");
}

/* ORDER */
function addToOrder(id) {
  const all = [...menu.burgers, ...menu.fries, ...menu.drinks];
  const item = all.find(i => i.id === id);
  const existing = currentOrder.items.find(i => i.id === id);
  existing ? existing.qty++ : currentOrder.items.push({ ...item, qty: 1 });
  updateOrderView();
}

function updateOrderView() {
  const list = orderItems;
  list.innerHTML = "";
  let total = 0;

  currentOrder.items.forEach((i, idx) => {
    total += i.price * i.qty;
    list.innerHTML += `
      <div class="order-card">
        <strong>${i.name}</strong>
        <div class="qty">
          <button onclick="iDec(${idx})">-</button>${i.qty}
          <button onclick="iInc(${idx})">+</button>
        </div>
        Rs.${i.price * i.qty}
      </div>`;
  });

  currentOrder.total = total;
  total.innerText = total;
}

function iInc(i){ currentOrder.items[i].qty++; updateOrderView(); }
function iDec(i){ currentOrder.items[i].qty > 1 ? currentOrder.items[i].qty-- : currentOrder.items.splice(i,1); updateOrderView(); }

/* SAVE */
function placeOrder() {
  if (!customerName.value) return alert("Enter customer name");
  currentOrder.orderId = Date.now();
  currentOrder.customerName = customerName.value;
  orders.push({ ...currentOrder });
  localStorage.setItem("orders", JSON.stringify(orders));
  clearOrder();
  alert("Order placed!");
}

function clearOrder() {
  currentOrder = { orderId:null, customerName:"", items:[], total:0 };
  customerName.value="";
  updateOrderView();
}

/* ORDER HISTORY */
function toggleOrderPane() {
  orderPane.classList.toggle("hidden");
}

function searchOrders() {
  orderList.innerHTML="";
  orders.filter(o =>
    o.customerName.toLowerCase().includes(orderSearch.value.toLowerCase())
  ).forEach(o => {
    orderList.innerHTML += `<li>#${o.orderId} - ${o.customerName} - Rs.${o.total}</li>`;
  });
}
