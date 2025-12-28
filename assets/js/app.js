/****************************************************
 * MENU DATA
 ****************************************************/
const menu = {
  burgers: [
    { id: 1, name: "Chicken Burger", price: 650, image: "assets/img/Burgers/Chicken-Burger.jfif" },
    { id: 2, name: "Classic Chicken Burger", price: 1350, image: "assets/img/Burgers/ClassicChicken-Burger.jfif" },
    { id: 3, name: "Crispy Chicken Burger", price: 1450, image: "assets/img/Burgers/CrispyChicken-Burger.jfif" },
    { id: 4, name: "Cheese Burger", price: 550, image: "assets/img/Burgers/Cheese-Burger.jfif" },
    { id: 5, name: "Zinger Burger", price: 1450, image: "assets/img/Burgers/Zinger-Burger.jfif" },
    { id: 6, name: "Zinger Cheese Burger ", price: 1650, image: "assets/img/Burgers/ZingerCheese-Burger.jfif" },
    { id: 7, name: "Double Decker Burger", price: 2250, image: "assets/img/Burgers/DoubleDecker-Burger.jfif" },
    { id: 8, name: "Veggie Burger", price: 1180, image: "assets/img/Burgers/Veggie-Burger.jfif" },
    { id: 9, name: "Tandoori Burger", price: 1850, image: "assets/img/Burgers/Tanduri-Burger.jfif" },
    { id: 10, name: "Smash Burger", price: 2000, image: "assets/img/Burgers/Smash-Burger.jfif" },
    { id: 11, name: "Beef Burger", price: 1820, image: "assets/img/Burgers/Beef-Burger.jfif" },
    { id: 12, name: "Gourmet Beef Burger", price: 2600, image: "assets/img/Burgers/GourmetBeef-Burger.jfif" }
  ],
  fries: [
    { id: 31, name: "French Fries", price: 300, image: "assets/img/Fries/French-Fry.jfif" },
    { id: 32, name: "Shoe String Fries", price: 1400, image: "assets/img/Fries/Shoestring-Fry.jfif" },
    { id: 33, name: "Crinkle Cut Fries", price: 1800, image: "assets/img/Fries/CrinkleCut-Fry.jfif" },
    { id: 34, name: "Masala Fries", price: 1600, image: "assets/img/Fries/Masala-Fry.jfif" },
    { id: 35, name: "Curly Fries", price: 1450, image: "assets/img/Fries/Curly-Fry.jfif" },
    { id: 36, name: "Chicken Fries", price: 1550, image: "assets/img/Fries/Chicken-Fry.jfif" },
    { id: 37, name: "Straight Cut Fries", price: 1300, image: "assets/img/Fries/StraightCut-Fry.jfif" },
    { id: 38, name: "Tindora Fries", price: 1750, image: "assets/img/Fries/Tindora-Fry.jfif" }
  ],
  drinks: [
    { id: 61, name: "Coke", price: 200, image: "assets/img/Drinks/Coke-Drink.jfif" },
    { id: 62, name: "Pepsi", price: 200, image: "assets/img/Drinks/Pepsi-Drink.jfif" },
    { id: 63, name: "Necto", price: 180, image: "assets/img/Drinks/Necto-Drink.jfif" },
    { id: 64, name: "Cream Soda", price: 220, image: "assets/img/Drinks/CreamSoda-Drink.jfif" },
    { id: 65, name: "Sprite", price: 230, image: "assets/img/Drinks/Sprite-Drink.jfif" },
    { id: 66, name: "Mirinda", price: 200, image: "assets/img/Drinks/Mirinda-Drink.jfif" },
    { id: 67, name: "Ginger Beer", price: 250, image: "assets/img/Drinks/GingerBeer-Drink.jfif" },
    { id: 68, name: "Fanta", price: 220, image: "assets/img/Drinks/Fanta-Drink.jfif" },
    { id: 69, name: "Soda", price: 150, image: "assets/img/Drinks/Soda-Drink.jfif" },
    { id: 70, name: "Tinda", price: 500, image: "assets/img/Drinks/Tinda-Drink.jfif" },
    { id: 71, name: "Fontana", price: 550, image: "assets/img/Drinks/Fontana-Drink.jfif" },
    { id: 72, name: "Kist", price: 520, image: "assets/img/Drinks/Kist-Drink.jfif" },
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

  if (currentOrder.orderId) {
    // 🔄 UPDATE EXISTING ORDER
    const index = orders.findIndex(o => o.orderId === currentOrder.orderId);
    if (index !== -1) {
      orders[index] = { ...currentOrder };
    }
  } else {
    // 🆕 CREATE NEW ORDER
    currentOrder.orderId = Date.now();
    orders.push({ ...currentOrder });
  }

  // Save & refresh
  localStorage.setItem("orders", JSON.stringify(orders));
  renderOrders();
  clearOrder();

  alert("Order saved successfully!");
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
