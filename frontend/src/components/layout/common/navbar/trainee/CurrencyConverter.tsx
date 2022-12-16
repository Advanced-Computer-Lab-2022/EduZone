import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrency } from '../../../../../redux/features/currency.reducer';
import { RootState } from '../../../../../redux/store';
import currencies from '../../../../../utils/currencies';

const CurrencyConverter = () => {
  const [loading, setLoading] = useState(false);

  const { currency: currentCurrency } = useSelector(
    (state: RootState) => state.currency
  );
  const dispatch = useDispatch();

  const handleChangeCurrency = async (currency: string) => {
    if (currentCurrency && currentCurrency !== currency) {
      let rate = 1;
      if (currency !== 'USD') {
        rate = await fetch(
          `https://v6.exchangerate-api.com/v6/796723737c5071fa641e0702/latest/USD`
        )
          .then((res) => res.json())
          .then((data) => data.conversion_rates[currency]);

        dispatch(
          setCurrency({
            currency,
            conversion_rate: rate,
          })
        );
      } else {
        dispatch(
          setCurrency({
            currency,
            conversion_rate: rate,
          })
        );
      }
    }
  };
  return (
    <div>
      <select
        className="bg-gray-100 border border-gray-300 rounded-md px-2 py-1 w-52"
        defaultValue={currentCurrency}
        onChange={(e) => handleChangeCurrency(e.target.value)}
      >
        {!loading &&
          currencies.map((currency) => (
            <option
              key={currency.country}
              value={currency.code}
              className="wrap"
            >
              {currency.country}
            </option>
          ))}
      </select>
    </div>
  );
};

export default CurrencyConverter;
