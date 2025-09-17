import React from 'react';

const ShippingPolicy = () => {
  return (
    <div class="w-full px-4 py-10">
      <div class="max-w-5xl mx-auto">
        <div class="bg-white shadow-md rounded-lg p-6 md:p-10">

          <h3 class="text-3xl font-bold mb-6">Shipping Policy</h3>

          <p class="mb-4">
            Thank you for choosing <span class="font-semibold">crepculture</span> for your men’s wear needs!
            We are committed to providing you with the best shopping experience, including prompt and efficient shipping.
            Please review our shipping policy below for more information:
          </p>

          <h4 class="text-xl font-semibold mt-6 mb-2">Shipping Location:</h4>
          <ul class="list-disc pl-6 mb-4 space-y-1">
            <li><strong>Within India:</strong> We currently ship only within India. International shipping is not available at this time.</li>
          </ul>

          <h4 class="text-xl font-semibold mt-6 mb-2">Shipping Methods:</h4>
          <ul class="list-disc pl-6 mb-4 space-y-1">
            <li><strong>Standard Shipping:</strong> We offer standard shipping on all orders, which typically takes 5–7 business days for delivery. Delivery times may vary depending on your location.</li>
          </ul>

          <h4 class="text-xl font-semibold mt-6 mb-2">Shipping Timeframe:</h4>
          <ul class="list-disc pl-6 mb-4 space-y-1">
            <li><strong>Processing Time:</strong> All orders are processed within 1–2 business days after placement.</li>
            <li><strong>Shipping Confirmation:</strong> Once your order is processed and shipped, you will receive a confirmation email with a tracking number.</li>
          </ul>

          <h4 class="text-xl font-semibold mt-6 mb-2">Delivery:</h4>
          <ul class="list-disc pl-6 mb-4 space-y-1">
            <li><strong>Logistics Partners:</strong> We work with reliable logistics partners to ensure timely and safe delivery.
              Please ensure someone is available to receive the package at your shipping address.
              If there are any delivery issues, we will assist in resolving them quickly.</li>
          </ul>

          <h4 class="text-xl font-semibold mt-6 mb-2">Order Tracking:</h4>
          <ul class="list-disc pl-6 mb-4 space-y-1">
            <li><strong>Tracking Information:</strong> You can track your order via the link in the shipping confirmation email.
              You may also log into your <span class="font-semibold">crepculture</span> account to check order status.</li>
          </ul>

          <h4 class="text-xl font-semibold mt-6 mb-2">Returns and Exchanges:</h4>
          <ul class="list-disc pl-6 mb-4 space-y-1">
            <li><strong>Policy:</strong> If your product is damaged, you can return or exchange it within 7 days of receipt.
              Please refer to our return and exchange policy for full details.</li>
          </ul>

          <p class="mt-6">
            We hope this shipping policy provides all the information you need.
            If you have any further questions or concerns, please feel free to contact us.
            <br /><br />
            Thank you again for choosing <span class="font-semibold">crepculture</span> for your men’s wear needs!
          </p>

        </div>
      </div>
    </div>

  );
};

export default ShippingPolicy;
