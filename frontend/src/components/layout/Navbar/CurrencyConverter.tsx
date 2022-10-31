import React, { useEffect, useState } from 'react';
import currencies from '../../../utils/currencies';

const CurrencyConverter = () => {
  const [loading, setLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  useEffect(() => {
    if (window !== undefined && !localStorage.getItem('currency')) {
      localStorage.setItem('currency', 'USD');
      setLoading(false);
    } else if (window !== undefined && localStorage.getItem('currency')) {
      setSelectedCurrency(localStorage.getItem('currency') as string);
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, []);

  const handleChangeCurrency = async (currency: string) => {
    const saved = localStorage.getItem('currency');
    if (saved && saved !== currency) {
      localStorage.setItem('currency', currency);
      let rate = 1;
      if (currency !== 'USD') {
        rate = await fetch(
          `https://v6.exchangerate-api.com/v6/796723737c5071fa641e0702/latest/USD`
        )
          .then((res) => res.json())
          .then((data) => data.conversion_rates[currency]);
      }
      // redis.set(`${currency}`, rate);
      localStorage.setItem('conversionRate', `${rate}`);
    }
  };
  return (
    <div>
      <select
        className="bg-gray-100 border border-gray-300 rounded-md px-2 py-1"
        defaultValue="USD"
        onChange={(e) => handleChangeCurrency(e.target.value)}
      >
        <option value={selectedCurrency}>{selectedCurrency}</option>
        {!loading &&
          currencies
            .filter((currency) => currency.code !== selectedCurrency)
            .map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.code}
              </option>
            ))}
      </select>
    </div>
  );
};

export default CurrencyConverter;
