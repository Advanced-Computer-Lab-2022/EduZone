import React, { useEffect, useState } from 'react';
import { Elements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripeCheckout, { Token } from 'react-stripe-checkout';
import { AxiosResponse } from 'axios';
import { axios } from '../../utils';
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.

const CoursePayment = () => {
  const [amount, setAmount] = useState(0);

  const handleToken = (token: Token) => {
    console.log(token);
    fetch('/payment/donate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, amount }),
    })
      .then((res) => res.json())
      .then((_) => {
        window.alert('Transaction Successful.');
      })
      .catch((_) => window.alert('Transaction Failed.'));
  };

  return (
    <div>
      <div>
        <label htmlFor="outlined-adornment-amount">Amount</label>
        <input
          id="outlined-adornment-amount"
          className="py-2 px-4 border"
          value={amount}
          type="number"
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>
      <StripeCheckout
        stripeKey={import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY}
        token={handleToken}
        name=""
        panelLabel={`Donate`}
        currency="USD"
        amount={amount * 100}
        ComponentClass="div"
      >
        <button className="bg-primary text-white">Pay for course</button>
      </StripeCheckout>
    </div>
  );
};

export default CoursePayment;
