// Standard ingredients for 100 people
let standardIngredients = {
    biriyani: {
        rice: { quantity: 10, unit: 'kg' },
        chicken: { quantity: 8, unit: 'kg' },
        spices: { quantity: 0.5, unit: 'kg' },
        oil: { quantity: 1, unit: 'L' },
        onions: { quantity: 3, unit: 'kg' },
        tomatoes: { quantity: 2, unit: 'kg' },
        yogurt: { quantity: 2, unit: 'L' },
    },
    rice: {
        rice: { quantity: 8, unit: 'kg' },
        oil: { quantity: 0.5, unit: 'L' },
        salt: { quantity: 0.2, unit: 'kg' },
    }
};

let calculatedIngredients = {};

// Navigation functions
function navigateToEditItems() {
    document.getElementById('homePage').classList.add('hidden');
    document.getElementById('editItemsPage').classList.remove('hidden');
    renderItemsList();
}

function navigateToPurchaseList() {
    document.getElementById('homePage').classList.add('hidden');
    document.getElementById('purchaseListPage').classList.remove('hidden');
}

function navigateToHome() {
    document.getElementById('homePage').classList.remove('hidden');
    document.getElementById('editItemsPage').classList.add('hidden');
    document.getElementById('purchaseListPage').classList.add('hidden');
}

// Edit Items functions
function addItem() {
    const dishType = document.getElementById('editDishType').value;
    const itemName = document.getElementById('itemName').value;
    const itemQuantity = parseFloat(document.getElementById('itemQuantity').value);
    const itemUnit = document.getElementById('itemUnit').value;

    if (itemName && !isNaN(itemQuantity)) {
        standardIngredients[dishType][itemName] = { quantity: itemQuantity, unit: itemUnit };
        renderItemsList();
        document.getElementById('editItemsForm').reset();
    } else {
        alert("Please enter valid item details.");
    }
}

function deleteItem(dishType, itemName) {
    delete standardIngredients[dishType][itemName];
    renderItemsList();
}

function renderItemsList() {
    const dishType = document.getElementById('editDishType').value;
    const itemsList = document.getElementById('items');
    itemsList.innerHTML = '';
    for (const [item, details] of Object.entries(standardIngredients[dishType])) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${item}: ${details.quantity} ${details.unit}</span>
            <button onclick="deleteItem('${dishType}', '${item}')">Delete</button>
        `;
        itemsList.appendChild(li);
    }
}

// Purchase List functions
function calculateIngredients() {
    const numPeople = parseInt(document.getElementById('numPeople').value);
    const dishType = document.getElementById('dishType').value;

    if (isNaN(numPeople) || numPeople <= 0) {
        alert("Please enter a valid number of people.");
        return;
    }

    const ingredients = standardIngredients[dishType];
    const calculatedItemsList = document.getElementById('calculatedItems');
    calculatedItemsList.innerHTML = '';

    calculatedIngredients = {}; // Reset calculated ingredients

    for (const [ingredient, details] of Object.entries(ingredients)) {
        const calculatedQuantity = (details.quantity / 100) * numPeople;
        calculatedIngredients[ingredient] = { quantity: calculatedQuantity.toFixed(2), unit: details.unit };

        const li = document.createElement('li');
        li.innerHTML = `
            <span>${ingredient}: ${calculatedQuantity.toFixed(2)} ${details.unit}</span>
            <button onclick="editCalculatedItem('${ingredient}')">Edit</button>
            <button onclick="deleteCalculatedItem('${ingredient}')">Delete</button>
        `;
        calculatedItemsList.appendChild(li);
    }

    // Enable the Export as PDF button
    document.getElementById('exportPdf').disabled = false;
}

function editCalculatedItem(ingredient) {
    const newQuantity = prompt(`Enter new quantity for ${ingredient}:`, calculatedIngredients[ingredient].quantity);
    if (newQuantity && !isNaN(newQuantity)) {
        calculatedIngredients[ingredient].quantity = parseFloat(newQuantity).toFixed(2);
        calculateIngredients(); // Re-render the list
    }
}

function deleteCalculatedItem(ingredient) {
    delete calculatedIngredients[ingredient];
    calculateIngredients(); // Re-render the list
}

function exportToPdf() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Catering Purchase List", 10, 10);

    // Add ingredients in two columns
    doc.setFontSize(12);
    let yPosition = 20;
    let xPosition1 = 10; // First column
    let xPosition2 = 110; // Second column

    for (const [ingredient, details] of Object.entries(calculatedIngredients)) {
        doc.text(`${ingredient}`, xPosition1, yPosition);
        doc.text(`${details.quantity} ${details.unit}`, xPosition2, yPosition);
        yPosition += 10;
    }

    // Save the PDF
    doc.save("purchase_list.pdf");
}