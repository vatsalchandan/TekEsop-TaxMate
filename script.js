document
  .getElementById("tax-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    event.stopPropagation();

    const exercisePrice = parseFloat(
      document.getElementById("exercise-price").value
    );
    const fmv = parseFloat(document.getElementById("fmv").value);
    const sellingPrice = parseFloat(
      document.getElementById("selling-price").value
    );
    const totalShares = parseInt(document.getElementById("total-shares").value);
    const otherFees = parseFloat(document.getElementById("other-fees").value);
    const administrativeFees = parseFloat(
      document.getElementById("administrative-fees").value
    );
    const perquisitesTaxRate = parseFloat(
      document.getElementById("perquisites-tax-rate").value
    );
    const term = document.getElementById("term").value; // Get short or long term
    const exercised = document.getElementById("exercised").value; // Check if already exercised

    // Perquisites
    const perquisites = (fmv - exercisePrice) * totalShares;

    // Capital Gain
    const capitalGain = (sellingPrice - fmv) * totalShares;

    // Taxable Capital Gain
    const taxableCapitalGain = capitalGain - otherFees - administrativeFees;

    // Paid and Actual Perquisites Tax
    const paidPerquisitesTax = perquisites * (perquisitesTaxRate / 100);
    const actualPerquisitesTax = perquisites * 0.3;

    // Capital Gain Tax based on term
    let capitalGainTax;
    if (term === "short") {
      capitalGainTax = taxableCapitalGain * 0.3;
    } else {
      capitalGainTax = taxableCapitalGain * 0.125;
    }

    // Total Payable Tax based on if stocks were exercised
    let totalPayableTax;
    if (exercised === "yes" || term === "long") {
      totalPayableTax = capitalGainTax; // If already exercised or long-term
    } else {
      totalPayableTax =
        capitalGainTax + actualPerquisitesTax - paidPerquisitesTax; // If not exercised
    }

    // Cess (4% on total payable tax)
    const cess = totalPayableTax * 0.04;

    // Total Payable Tax including cess
    const totalPayableTaxWithCess = totalPayableTax + cess;

    // Display the results
    let resultsHtml = `
        <p>Capital Gain: $${capitalGain.toFixed(2)}</p>
        <p>Taxable Capital Gain: $${taxableCapitalGain.toFixed(2)}</p>
        <p>Capital Gain Tax: $${capitalGainTax.toFixed(2)} (${
      term === "short" ? "Short-term" : "Long-term"
    })</p>
    `;

    // If not exercised and not long-term, include perquisites tax details
    if (exercised === "no" && term === "short") {
      resultsHtml += `
            <p>Paid Perquisites Tax: $${paidPerquisitesTax.toFixed(2)}</p>
            <p>Actual Perquisites Tax: $${actualPerquisitesTax.toFixed(2)}</p>
        `;
    }

    resultsHtml += `<h3>Total Payable Tax: $${totalPayableTax.toFixed(2)}</h3>
        <p>Cess (4%): $${cess.toFixed(2)}</p>
        <h3>Total Payable Tax Including Cess: $${totalPayableTaxWithCess.toFixed(
          2
        )}</h3>`;

    document.getElementById("results").innerHTML = resultsHtml;
  });

// Add event listener to disable/enable the "Were Stocks Already Exercised?" field
document.getElementById("term").addEventListener("change", function () {
  const term = this.value;
  const exercisedField = document.getElementById("exercised");
  const infoIcon = document.getElementById("info-icon");

  if (term === "long") {
    exercisedField.disabled = true; // Disable field for long term
    exercisedField.value = "yes"; // Set value to "yes"
    infoIcon.style.display = "inline"; // Show the info icon
  } else {
    exercisedField.disabled = false; // Enable field for short term
    exercisedField.value = ""; // Reset value
    infoIcon.style.display = "none"; // Hide the info icon
  }
});

console.log("auto deployment is working");
