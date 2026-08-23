const fs = require('fs');
let content = fs.readFileSync('src/components/CheckoutModal.tsx', 'utf-8');

const newSubmit = `  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.paymentMethod !== 'COD') {
      if (!receiptImage) {
        alert("Please upload your transfer receipt screenshot. (ငွေလွှဲပြေစာ ပုံတင်ပေးပါရန်)");
        return;
      }
      if (!formData.transactionId) {
        alert("Please enter your Phone Number or Transaction ID. (ငွေလွှဲသူဖုန်းနံပါတ် သို့မဟုတ် TxID ဖြည့်ပေးပါရန်)");
        return;
      }
    }
    setIsProcessing(true);`;

content = content.replace(
  /const handlePaymentSubmit = \(e: React\.FormEvent\) => \{\s*e\.preventDefault\(\);\s*setIsProcessing\(true\);/,
  newSubmit
);

content = content.replace(
  /ORDER CONFIRMED & QUEUED!/g,
  "ORDER RECEIVED - PENDING VERIFICATION!"
);

content = content.replace(
  /Status: Order Placed & Live Production Queued/g,
  "Status: Pending Payment Verification"
);

fs.writeFileSync('src/components/CheckoutModal.tsx', content);
console.log("Patched CheckoutModal");
