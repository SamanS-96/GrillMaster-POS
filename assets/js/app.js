/****************************************************
 * MENU DATA
 ****************************************************/
const menu = {
  burgers: [
    { id: 1, name: "Cheese Burger", price: 550, image: "assets/img/cheese-burger.jfif" },
    { id: 2, name: "Chicken Burger", price: 650, image: "assets/img/chicken-burger.jfif" }
  ],
  fries: [
    { id: 3, name: "French Fries", price: 300, image: "assets/img/french-fries.jfif" }
  ],
  drinks: [
    { id: 4, name: "Coke", price: 200, image: "assets/img/coke.jfif" }
  ]
};

/****************************************************
 * APPLICATION STATE
 ****************************************************/
let activeCategory = "burgers"; // default active tab
let currentOrder = { orderId: null, customerName: "", items: [], total: 0 }; // current working order
let orders = JSON.parse(localStorage.getItem("orders")) || []; // all placed orders

/****************************************************
 * RENDER MENU ITEMS
 ****************************************************/
function renderItems(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  if (items.length === 0) {
    container.innerHTML = "<p>No items found</p>";
    return;
  }

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "menu-card";
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <h4>${item.name}</h4>
      <p>Rs. ${item.price} /-</p>
      <button>Add</button>
    `;

    // Clicking card or button adds to order
    card.onclick = () => addToOrder(item.id);
    card.querySelector("button").onclick = e => {
      e.stopPropagation(); // prevent triggering card click twice
      addToOrder(item.id);
    };

    container.appendChild(card);
  });
}

/****************************************************
 * INITIAL RENDER
 ****************************************************/
window.onload = function() {
  // Render only burgers by default
  renderItems(menu.burgers, "burgersList");
  renderItems(menu.fries, "friesList");
  renderItems(menu.drinks, "drinksList");

  // Hide order pane on load
  document.getElementById("orderPane").classList.add("hidden");

  // Render existing orders from localStorage
  renderOrders();
};

/****************************************************
 * TAB SWITCH FUNCTION
 ****************************************************/
function openTab(event, tabId) {
  // Hide all tab contents
  document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
  // Remove active class from all buttons
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));

  // Show selected tab
  document.getElementById(tabId).classList.add("active");
  event.currentTarget.classList.add("active");

  // Update active category for search
  activeCategory = tabId;

  // Clear search input
  document.getElementById("searchInput").value = "";
}

/****************************************************
 * SEARCH ITEMS PER TAB
 ****************************************************/
function searchItems() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const filtered = menu[activeCategory].filter(item => item.name.toLowerCase().includes(query));
  renderItems(filtered, activeCategory + "List");
}

/****************************************************
 * ADD ITEM TO CURRENT ORDER
 ****************************************************/
function addToOrder(id) {
  const allItems = [...menu.burgers, ...menu.fries, ...menu.drinks];
  const item = allItems.find(i => i.id === id);

  // Check if item already exists in order
  const exist = currentOrder.items.find(i => i.id === id);
  if (exist) {
    exist.qty++;
  } else {
    currentOrder.items.push({ ...item, qty: 1 });
  }

  updateOrderView();
}

/****************************************************
 * UPDATE ORDER DETAILS VIEW
 ****************************************************/
function updateOrderView() {
  const container = document.getElementById("orderItems");
  const totalSpan = document.getElementById("total");
  container.innerHTML = "";

  if (currentOrder.items.length === 0) {
    container.innerHTML = `<p class="empty">No items added</p>`;
    totalSpan.textContent = 0;
    return;
  }

  let total = 0;

  currentOrder.items.forEach((item, index) => {
    total += item.price * item.qty;

    const card = document.createElement("div");
    card.className = "order-card";
    card.innerHTML = `
      <strong>${item.name}</strong>
      <div class="qty">
        <button onclick="decreaseQty(${index})">−</button> ${item.qty}
        <button onclick="increaseQty(${index})">+</button>
      </div>
      Rs. ${item.price * item.qty}
    `;

    container.appendChild(card);
  });

  currentOrder.total = total;
  totalSpan.textContent = total+" /-";
}

/****************************************************
 * INCREASE / DECREASE QUANTITY
 ****************************************************/
function increaseQty(index) { currentOrder.items[index].qty++; updateOrderView(); }
function decreaseQty(index) {
  if (currentOrder.items[index].qty > 1) {
    currentOrder.items[index].qty--;
  } else {
    currentOrder.items.splice(index, 1);
  }
  updateOrderView();
}

/****************************************************
 * PLACE ORDER
 ****************************************************/
function placeOrder() {
  const name = document.getElementById("customerName").value.trim();

  if (!name || currentOrder.items.length === 0) {
    alert("Customer name or items missing");
    return;
  }

  currentOrder.customerName = name;
  currentOrder.orderId = Date.now();

  orders.push({ ...currentOrder });
  localStorage.setItem("orders", JSON.stringify(orders));

  clearOrder();
  renderOrders();
  alert("Order placed successfully!");
}

/****************************************************
 * CLEAR CURRENT ORDER
 ****************************************************/
function clearOrder() {
  currentOrder = { orderId: null, customerName: "", items: [], total: 0 };
  document.getElementById("customerName").value = "";
  updateOrderView();
}

/****************************************************
 * TOGGLE ORDER PANE
 ****************************************************/
function toggleOrderPane() {
  document.getElementById("orderPane").classList.toggle("hidden");
}

/****************************************************
 * RENDER ORDER HISTORY
 ****************************************************/
function renderOrders(list = orders) {
  const orderList = document.getElementById("orderList");
  orderList.innerHTML = "";

  if (list.length === 0) {
    orderList.innerHTML = "<li>No orders found</li>";
    return;
  }

  list.forEach(order => {
    const li = document.createElement("li");
    li.innerHTML = `
      #${order.orderId} - ${order.customerName} - Rs.${order.total} /-
      <span>
        <button onclick="editOrder(${order.orderId})">Edit</button>
        <button onclick="deleteOrder(${order.orderId})">Delete</button>
      </span>
    `;
    orderList.appendChild(li);
  });
}

/****************************************************
 * SEARCH ORDERS (BY NAME OR ID)
 ****************************************************/
function searchOrders() {
  const query = document.getElementById("orderSearch").value.toLowerCase();
  const filtered = orders.filter(o =>
    o.customerName.toLowerCase().includes(query) || o.orderId.toString().includes(query)
  );
  renderOrders(filtered);
}

/****************************************************
 * EDIT / DELETE ORDER
 ****************************************************/
function editOrder(orderId) {
  const order = orders.find(o => o.orderId === orderId);
  if (!order) return;

  currentOrder = JSON.parse(JSON.stringify(order));
  document.getElementById("customerName").value = order.customerName;
  updateOrderView();

  toggleOrderPane(); // open order pane for editing
}

function deleteOrder(orderId) {
  if (!confirm("Delete this order?")) return;

  orders = orders.filter(o => o.orderId !== orderId);
  localStorage.setItem("orders", JSON.stringify(orders));
  renderOrders();
}
