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
function navigateToPurchaseList() {
    document.getElementById('homePage').classList.add('hidden');
    document.getElementById('purchaseListPage').classList.remove('hidden');
}

function navigateToHome() {
    document.getElementById('homePage').classList.remove('hidden');
    document.getElementById('purchaseListPage').classList.add('hidden');
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

    // Enable the Export as PDF and Add Item buttons
    document.getElementById('exportPdf').disabled = false;
    document.getElementById('addItemButton').classList.remove('hidden');
}

function editCalculatedItem(ingredient) {
    const newQuantity = prompt(`Enter new quantity for ${ingredient}:`, calculatedIngredients[ingredient].quantity);
    if (newQuantity && !isNaN(newQuantity)) {
        calculatedIngredients[ingredient].quantity = parseFloat(newQuantity).toFixed(2);
        renderCalculatedItems(); // Re-render the list
    }
}

function deleteCalculatedItem(ingredient) {
    delete calculatedIngredients[ingredient];
    renderCalculatedItems(); // Re-render the list
}

function addItemAfterCalculation() {
    const itemName = prompt("Enter the name of the item to add:");
    const itemQuantity = prompt("Enter the quantity of the item:");
    const itemUnit = prompt("Enter the unit of the item (kg, g, L, mL):");

    if (itemName && itemQuantity && itemUnit && !isNaN(itemQuantity)) {
        calculatedIngredients[itemName] = { quantity: parseFloat(itemQuantity).toFixed(2), unit: itemUnit };
        renderCalculatedItems(); // Re-render the list
    } else {
        alert("Please enter valid item details.");
    }
}

function renderCalculatedItems() {
    const calculatedItemsList = document.getElementById('calculatedItems');
    calculatedItemsList.innerHTML = '';

    for (const [ingredient, details] of Object.entries(calculatedIngredients)) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${ingredient}: ${details.quantity} ${details.unit}</span>
            <button onclick="editCalculatedItem('${ingredient}')">Edit</button>
            <button onclick="deleteCalculatedItem('${ingredient}')">Delete</button>
        `;
        calculatedItemsList.appendChild(li);
    }
}

function exportToPdf() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Base64-encoded Noto Sans Malayalam font
    const malayalamFontBase64 = `
        /* Paste the base64-encoded font here */
    `;

    const malayalamFontName = 'NotoSansMalayalam';

    // Add the font to jsPDF
    doc.addFileToVFS('NotoSansMalayalam.ttf', malayalamFontBase64);
    doc.addFont('NotoSansMalayalam.ttf', malayalamFontName, 'normal');
    doc.setFont(malayalamFontName); // Set the font

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
