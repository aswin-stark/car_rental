// Print reservation details
function printReservation() {
  const element = document.getElementById('reservation-card');

  const printWindow = window.open('', '', 'height=700,width=900');
  printWindow.document.write('<html><head><title>Print Reservation</title>');
  printWindow.document.write('<style>');
  printWindow.document.write(`
    body { font-family: Arial, sans-serif; padding:20px; background:#fff; display:flex; justify-content:center; }
    .card { width:100%; max-width:600px; border-radius:10px; padding:30px; box-shadow:none; }
    .card h1 { color:#28a745; text-align:center; margin-bottom:20px; }
    .card p { color:#333; font-size:16px; margin-bottom:15px; line-height:1.4; text-align:left; }
    .details { background:#f7f7f7; padding:20px; border-radius:10px; margin-bottom:20px; }
    .details h3 { font-size:20px; margin-bottom:15px; text-align:left; }
    .details p { margin-bottom:10px; font-size:16px; }
  `);
  printWindow.document.write('</style></head><body>');
  printWindow.document.write(element.outerHTML);
  printWindow.document.write('</body></html>');

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

// Download reservation as PDF
function downloadPDF() {
  const card = document.getElementById('reservation-card');

  if (!card) {
    alert("Reservation details not found!");
    return;
  }

  // Create a temporary container for PDF with inline styles
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = card.innerHTML;
  tempDiv.style.width = '600px';
  tempDiv.style.padding = '30px';
  tempDiv.style.fontFamily = 'Arial, sans-serif';
  tempDiv.style.background = '#fff';
  tempDiv.style.borderRadius = '10px';
  tempDiv.style.margin = 'auto';

  // Add inline styles for headings and details
  const headings = tempDiv.querySelectorAll('h1');
  headings.forEach(h => {
    h.style.color = '#28a745';
    h.style.textAlign = 'center';
    h.style.marginBottom = '20px';
  });

  const detailsDiv = tempDiv.querySelector('.details');
  if (detailsDiv) {
    detailsDiv.style.background = '#f7f7f7';
    detailsDiv.style.padding = '20px';
    detailsDiv.style.borderRadius = '10px';
    detailsDiv.style.marginBottom = '20px';
  }

  const paragraphs = tempDiv.querySelectorAll('p');
  paragraphs.forEach(p => {
    p.style.color = '#333';
    p.style.fontSize = '16px';
    p.style.marginBottom = '10px';
    p.style.lineHeight = '1.4';
  });

  // Generate PDF from tempDiv
  const opt = {
    margin: 10,
    filename: 'Reservation_Details.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(tempDiv).save();
}
document.addEventListener("DOMContentLoaded", function() {
  const bookingData = JSON.parse(localStorage.getItem("bookingData"));

  if (bookingData) {
    document.getElementById("conf-car").textContent = bookingData.carName;
    document.getElementById("conf-pickup").textContent = bookingData.pickupLocation;
    document.getElementById("conf-dropoff").textContent = bookingData.dropoffLocation;
    document.getElementById("conf-dates").textContent =
      `${bookingData.pickupDate} - ${bookingData.dropoffDate}`;
    document.getElementById("conf-price").textContent = bookingData.totalPrice; // <-- fixed
  } else {
    document.getElementById("reservation-card").innerHTML =
      "<h2>⚠️ No booking data found. Please go back and complete your reservation.</h2>";
  }
});
