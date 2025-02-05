function getBasePrice(age) {
  if (age >= 0 && age <= 5) {
    return 0;
  } else if (age >= 6 && age <= 12) {
    return 150;
  } else if (age >= 13 && age <= 59) {
    return 350;
  } else if (age >= 60) {
    return 170;
  } else {
    return null;
  }
}

const initialForm = document.getElementById("initialForm");
const agesForm = document.getElementById("agesForm");
const agesContainer = document.getElementById("agesContainer");
const output = document.getElementById("output");

let selectedDay = "";
let numberOfTickets = 0;

initialForm.addEventListener("submit", function (e) {
  e.preventDefault();
  output.innerHTML = "";
  const daySelect = document.getElementById("day");
  selectedDay = daySelect.value;
  numberOfTickets = parseInt(document.getElementById("ticketCount").value, 10);

  if (!selectedDay || numberOfTickets < 1 || numberOfTickets > 6) {
    output.innerHTML =
      '<span class="error">Error: Please select a valid day and number of tickets (1 - 6).</span>';
    return;
  }

  initialForm.style.display = "none";
  agesContainer.innerHTML = "";

  for (let i = 0; i < numberOfTickets; i++) {
    const label = document.createElement("label");
    label.innerText = `Enter Age for Ticket ${i + 1}:`;
    label.setAttribute("for", `age${i}`);

    const input = document.createElement("input");
    input.type = "number";
    input.id = `age${i}`;
    input.placeholder = "Enter age";
    input.min = "0";
    input.required = true;

    agesContainer.appendChild(label);
    agesContainer.appendChild(input);
  }
  agesForm.style.display = "block";
});

agesForm.addEventListener("submit", function (e) {
  e.preventDefault();
  output.innerHTML = "";
  let individualPrices = [];
  let invalidInput = false;

  for (let i = 0; i < numberOfTickets; i++) {
    const ageInput = document.getElementById(`age${i}`);
    const age = parseInt(ageInput.value, 10);
    const basePrice = getBasePrice(age);

    if (basePrice === null) {
      output.innerHTML =
        '<span class="error">Error: Invalid age entered for one or more tickets.</span>';
      invalidInput = true;
      break;
    }
    individualPrices.push(basePrice);
  }
  if (invalidInput) return;

  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  let weekdayDiscountRate = weekdays.includes(selectedDay) ? 0.03 : 0;

  let discountedPrices = individualPrices.map(
    (price) => price * (1 - weekdayDiscountRate)
  );

  let totalPrice = discountedPrices.reduce((acc, curr) => acc + curr, 0);

  let groupDiscountRate = numberOfTickets >= 3 ? 0.05 : 0;

  if (groupDiscountRate) {
    totalPrice *= 1 - groupDiscountRate;
  }
  totalPrice = totalPrice.toFixed(2);

  let outputHtml = `<h2>Ticket Prices</h2><ul>`;
  discountedPrices.forEach((price, index) => {
    let discountPercent = weekdayDiscountRate * 100;

    outputHtml += `<li>Ticket ${index + 1}: php${price.toFixed(2)} (Base: php${
      individualPrices[index]
    }, Weekday Discount: ${discountPercent}%)</li>`;
  });
  outputHtml += `</ul>`;
  if (groupDiscountRate) {
    outputHtml += `<p>Group Discount Applied: ${groupDiscountRate * 100}%</p>`;
  }
  outputHtml += `<p><strong>Total Price: php${totalPrice}</strong></p>`;
  output.innerHTML = outputHtml;
});
