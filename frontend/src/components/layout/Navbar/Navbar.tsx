import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../../redux/features/auth.reducer';
import { RootState } from '../../../redux/store';
import currencies from '../../../utils/currencies';
import Avatar from '../../common/Avatar';
import SearchBar from './SearchBar';

const Navbar = () => {
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

  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      localStorage.setItem('currencyRate', `${rate}`);
    }
  };

  return (
    <div className="h-14 bg-white flex items-center justify-center shadow-md fixed w-full z-30">
      <div className="container max-w-7xl flex items-center justify-between mx-auto h-full">
        <Link to="/" className="text-lg text-primary font-medium ">
          Placeholder
        </Link>
        <div className="w-3/5">
          <SearchBar />
        </div>
        {isAuthenticated ? (
          // <button
          //   onClick={() => {
          //     dispatch(logout());
          //     navigate('/login');
          //   }}
          // >
          //   Logout
          // </button>
          <div className="flex gap-4 items-center">
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
            <Avatar
              name={user?.name}
              img="https://avatars.githubusercontent.com/u/30694445?v=4"
            />
          </div>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
