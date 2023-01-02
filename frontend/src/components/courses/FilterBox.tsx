import React, { useState } from 'react';
import { AiFillDollarCircle } from 'react-icons/ai';
import { BiCategoryAlt } from 'react-icons/bi';
import { FaStar } from 'react-icons/fa';
import { MdCategory } from 'react-icons/md';
import { RiMoneyDollarCircleFill } from 'react-icons/ri';
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
    <div className="w-full bg-white border shadow-md max-h-fit rounded-lg p-5 space-y-5">
      <p className="text-lg font-medium  text-center"> Filters</p>
      <div>
        <div className="flex items-center gap-1 mb-2 text-gray-600 font-medium">
          <MdCategory size={20} />
          <p>Subject</p>
        </div>
        <select
          onChange={(e) => {
            setSubjectFilter(e.target.value || 'all');
            setFiltered(true);
          }}
          defaultValue={subjectFilter || 'all'}
          className="w-full p-2 border"
        >
          <option value="all">All</option>
          <option value="eco">Economics</option>
          <option value="science">Science</option>
          <option value="cs">Computer Science</option>
        </select>
      </div>

      <div>
        <div className="flex items-center gap-1 mb-2 text-gray-600 font-medium">
          <AiFillDollarCircle size={20} />
          <p>Price</p>
        </div>
        <div className="space-y-1">
          <form
            onChange={(e) => {
              setPriceFilter((e.target as any).value || 'all');
              setFiltered(true);
            }}
            className="flex space-x-2 w-full flex-wrap"
          >
            <span>
              <input
                type="radio"
                name="price"
                value="all"
                id="all"
                className="hidden peer"
                required
                defaultChecked={priceFilter ? priceFilter === 'all' : true}
              />
              <label
                htmlFor={'all'}
                className="inline-flex justify-between items-center px-5 rounded-full w-full text-gray-500  border border-gray-200 cursor-pointer  peer-checked:text-white peer-checked:bg-primary hover:text-gray-600 hover:bg-gray-100 bg-gray-200 "
              >
                <div className="w-full flex items-center gap-4">
                  <span>All</span>
                </div>
              </label>
            </span>

            <span>
              <input
                type="radio"
                name="price"
                value="free"
                id="free"
                defaultChecked={priceFilter === 'free'}
                className="hidden peer"
                required
              />
              <label
                htmlFor={'free'}
                className="inline-flex justify-between items-center px-3 rounded-full w-full text-gray-500  border border-gray-200 cursor-pointer  peer-checked:text-white peer-checked:bg-primary hover:text-gray-600 hover:bg-gray-100 bg-gray-200 "
              >
                <div className="w-full flex items-center gap-4">
                  <span>Free</span>
                </div>
              </label>
            </span>
            <span>
              <input
                type="radio"
                name="price"
                value="exact"
                id="exact"
                defaultChecked={priceFilter === 'exact'}
                className="hidden peer"
                required
              />
              <label
                htmlFor={'exact'}
                className="inline-flex justify-between items-center px-3 rounded-full w-full text-gray-500  border border-gray-200 cursor-pointer  peer-checked:text-white peer-checked:bg-primary hover:text-gray-600 hover:bg-gray-100 bg-gray-200 "
              >
                <div className="w-full flex items-center gap-4">
                  <span>Exact</span>
                </div>
              </label>
            </span>

            <span>
              <input
                type="radio"
                name="price"
                value="range"
                id="range"
                defaultChecked={priceFilter === 'range'}
                className="hidden peer"
                required
              />
              <label
                htmlFor={'range'}
                className="inline-flex justify-between items-center px-3 rounded-full w-full text-gray-500  border border-gray-200 cursor-pointer  peer-checked:text-white peer-checked:bg-primary hover:text-gray-600 hover:bg-gray-100 bg-gray-200 "
              >
                <div className="w-full flex items-center gap-4">
                  <span>Range</span>
                </div>
              </label>
            </span>
          </form>
          {priceFilter === 'exact' && (
            <div>
              <input
                type="number"
                placeholder="Enter price"
                className="w-full p-2 border rounded-md mt-3"
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
                className="w-full p-2 border rounded-md mt-3"
                onChange={(e) => setMinPrice(parseInt(e.target.value))}
              />
              <input
                type="number"
                placeholder="Max Price"
                className="w-full p-2 border rounded-md mt-3"
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              />
            </div>
          )}
        </div>
      </div>

      <div className="">
        <div className="flex items-center gap-1 mb-2 text-gray-600 font-medium">
          <FaStar size={20} />
          <p>Min Rating</p>
        </div>
        <input
          type="number"
          min={0}
          max={5}
          placeholder="Enter rating"
          className="w-full p-2 border rounded-md"
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
