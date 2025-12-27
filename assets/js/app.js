console.log("js loaded..");


/***********************
 * MENU DATA
 ***********************/
const menu = {
  burgers: [
    { id: 1, name: "Cheese Burger", price: 550 },
    { id: 2, name: "Chicken Burger", price: 650 },
    { id: 3, name: "Veg Burger", price: 450 }
  ],
  fries: [
    { id: 4, name: "French Fries", price: 300 },
    { id: 5, name: "Cheese Fries", price: 350 }
  ],
  drinks: [
    { id: 6, name: "Coke", price: 200 },
    { id: 7, name: "Sprite", price: 180 }
  ]
};

/***********************
 * STATE
 ***********************/
let activeCategory = "burgers";
let order = [];

/***********************
 * RENDER ITEMS
 ***********************/
function renderItems(items, listId) {
  const list = document.getElementById(listId);
  list.innerHTML = "";

  if (items.length === 0) {
    list.innerHTML = "<p>No items found</p>";
    return;
  }

  items.forEach(item => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p>
        ${item.name} - Rs.${item.price}
        <button onclick="addToOrder(${item.id})">Add</button>
      </p>
    `;
    list.appendChild(div);
  });
}

/***********************
 * INITIAL LOAD
 ***********************/
renderItems(menu.burgers, "burgerList");
renderItems(menu.fries, "friesList");
renderItems(menu.drinks, "drinksList");

/***********************
 * TAB SWITCH
 ***********************/
function openTab(event, tabId) {
  document.querySelectorAll(".tab-content").forEach(tab =>
    tab.classList.remove("active")
  );
  document.querySelectorAll(".tab-btn").forEach(btn =>
    btn.classList.remove("active")
  );

  document.getElementById(tabId).classList.add("active");
  event.currentTarget.classList.add("active");

  activeCategory = tabId;
  document.getElementById("searchInput").value = "";

  renderItems(menu[activeCategory], `${activeCategory}List`);
}

/***********************
 * SEARCH ITEMS
 ***********************/
function searchItems() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const items = menu[activeCategory];

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(query)
  );

  renderItems(filteredItems, `${activeCategory}List`);
}

/***********************
 * ORDER FUNCTIONS
 ***********************/
function addToOrder(id) {
  const allItems = [
    ...menu.burgers,
    ...menu.fries,
    ...menu.drinks
  ];

  const item = allItems.find(i => i.id === id);
  order.push(item);
  renderOrder();
}

function renderOrder() {
  const list = document.getElementById("orderItems");
  const totalSpan = document.getElementById("total");

  list.innerHTML = "";
  let total = 0;

  order.forEach((item, index) => {
    total += item.price;
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} - Rs.${item.price}
      <button onclick="removeItem(${index})">❌</button>
    `;
    list.appendChild(li);
  });

  totalSpan.textContent = total;
}

function removeItem(index) {
  order.splice(index, 1);
  renderOrder();
}

function cancelOrder() {
  if (confirm("Cancel the order?")) {
    order = [];
    renderOrder();
  }
}

function placeOrder() {
  if (order.length === 0) {
    alert("No items in the order!");
    return;
  }
  alert("Order placed successfully!");
  order = [];
  renderOrder();
}

