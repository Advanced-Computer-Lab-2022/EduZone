import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RootState } from '../../redux/store';

const FilterBox: React.FC<{ navigate_path: string }> = ({ navigate_path }) => {
  const [searchParams] = useSearchParams();
  const price = searchParams.get('price') || undefined;
  const [priceValue, setPriceValue] = useState(price);
  const initialMinPrice = searchParams.get('minPrice') || undefined;
  const initialMaxPrice = searchParams.get('maxPrice') || undefined;
  const rating = searchParams.get('rating') || undefined;
  const subject = searchParams.get('subject') || undefined;

  const [priceFilter, setPriceFilter] = useState(
    price === '0' ? 'free' : price ? 'exact' : (price as string | undefined)
  );
  const [ratingFilter, setRatingFilter] = useState(
    rating as string | undefined
  );
  const [subjectFilter, setSubjectFilter] = useState(
    subject as string | undefined
  );
  const [filtered, setFiltered] = useState(false);
  const [minPrice, setMinPrice] = useState(
    initialMinPrice ? parseInt(initialMinPrice) : undefined
  );
  const [maxPrice, setMaxPrice] = useState(
    initialMaxPrice ? parseInt(initialMaxPrice) : undefined
  );
  const navigate = useNavigate();
  const { conversion_rate } = useSelector((state: RootState) => state.currency);
  const onApplyFilter = () => {
    const filter = {
      ...(priceFilter &&
        priceFilter === 'exact' &&
        priceValue && {
          price: Number(parseInt(priceValue) / conversion_rate).toFixed(2),
        }),
      ...(priceFilter && priceFilter === 'free' && { price: 0 }),
      ...(priceFilter &&
        priceFilter === 'range' &&
        minPrice && {
          minPrice: Number(minPrice / conversion_rate).toFixed(2),
        }),
      ...(priceFilter &&
        priceFilter === 'range' &&
        maxPrice && {
          maxPrice: Number(maxPrice / conversion_rate).toFixed(2),
        }),
      ...(ratingFilter && { rating: ratingFilter }),
      ...(subjectFilter &&
        subjectFilter !== 'all' && { subject: subjectFilter }),
    };
    console.log(filter);
    navigate(
      `/${navigate_path}?${Object.keys(filter)
        .map((key) => `${key}=${(filter as any)[key]}`)
        .join('&')}`
    );
  };

  return (
    <div className="w-full bg-gray-100 border shadow-md max-h-fit rounded-lg p-4 space-y-5">
      <p> Filter</p>
      <div>
        <p>Subject</p>
        <select
          onChange={(e) => {
            setSubjectFilter(e.target.value || 'all');
            setFiltered(true);
          }}
          defaultValue={subjectFilter || 'all'}
        >
          <option value="all">All</option>
          <option value="eco">Economics</option>
          <option value="science">Science</option>
          <option value="cs">Computer Science</option>
        </select>
      </div>
      <div>
        <p>Price:</p>
        <div className="space-y-1">
          <form
            onChange={(e) => {
              setPriceFilter((e.target as any).value || 'all');
              setFiltered(true);
            }}
            className="flex justify-between w-full"
          >
            <span>
              <input
                type="radio"
                name="price"
                value="all"
                id=""
                defaultChecked={priceFilter ? priceFilter === 'all' : true}
              />
              All
            </span>
            <span>
              <input
                type="radio"
                name="price"
                value="free"
                id=""
                defaultChecked={priceFilter === 'free'}
              />
              Free
            </span>
            <span>
              <input
                type="radio"
                name="price"
                value="exact"
                id=""
                defaultChecked={priceFilter === 'exact'}
              />
              Exact
            </span>

            <span>
              <input
                type="radio"
                name="price"
                value="range"
                id=""
                defaultChecked={priceFilter === 'range'}
              />
              Range
            </span>
          </form>
          {priceFilter === 'exact' && (
            <div>
              <input
                type="number"
                placeholder="Enter price"
                onChange={(e) => {
                  setPriceValue(e.target.value);
                  setFiltered(true);
                }}
              />
            </div>
          )}
          {priceFilter === 'range' && (
            <div className="grid grid-cols-2 gap-2 ">
              <input
                type="number"
                placeholder="Min Price"
                onChange={(e) => setMinPrice(parseInt(e.target.value))}
              />
              <input
                type="number"
                placeholder="Max Price"
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <p>Min Rating:</p>
        <input
          type="number"
          min={0}
          max={5}
          onChange={(e) => {
            setRatingFilter(e.target.value);
            setFiltered(true);
          }}
        />
      </div>

      <button
        className="bg-primary text-white font-medium rounded-lg p-2 w-full disabled:bg-primary/50 disabled:cursor-not-allowed"
        onClick={() => onApplyFilter()}
        disabled={!filtered}
      >
        Apply
      </button>
    </div>
  );
};

export default FilterBox;
