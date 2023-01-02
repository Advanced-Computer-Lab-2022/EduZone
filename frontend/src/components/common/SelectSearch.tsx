import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';

const SelectSearch: React.FC<{
  items: { _id: string; name: string }[];
  multiple: undefined | boolean;
  selected: string | string[];
  onSelect: (value: string) => void;
  onRemove?: (value: string) => void;
}> = ({
  items,
  multiple,
  selected,
  onSelect,
  onRemove = (value: string) => {
    return;
  },
}) => {
  const [useSearch, setUseSearch] = useState(true);
  const [selectOpen, setSelectOpen] = useState(false);
  const [initialValues, _] = useState(items);
  const [values, setValues] = useState(initialValues);

  const [search, setSearch] = useState('');
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUseSearch(true);
    console.log(e.target.value);
    setSearch(e.target.value);
    if (e.target.value === '') {
      setValues(initialValues);
    } else {
      setValues(
        initialValues.filter((item) =>
          item.name.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    }
    setUseSearch(true);
  };
  // const handleSelect = (value: string) => {
  //   setUseSearch(false);
  //   if (multiple) {
  //     if (selected.includes(value)) {
  //       onSelect((selected as string[]).filter((item) => item !== value));
  //     } else {
  //       onSelect([...selected, value]);
  //     }
  //   } else {
  //     onSelect(value);
  //     setSelectOpen(false);
  //   }
  // };
  return (
    <div className="relative">
      <div className="flex items-center px-2 border">
        <div className="flex flex-wrap w-full">
          {multiple && (
            <div className="flex flex-wrap items-center">
              {(selected as string[]).map((value) => (
                <div
                  className="bg-gray-400 text-sm  text-white px-2 py-1 rounded-md mr-2 flex items-center gap-1"
                  key={value}
                >
                  {
                    initialValues.find((item) => item._id.toString() === value)
                      ?.name
                  }
                  <span
                    className="cursor-pointer"
                    onClick={() => onRemove(value)}
                  >
                    <MdClose size={16} />{' '}
                  </span>
                </div>
              ))}
            </div>
          )}
          <input
            type="text"
            placeholder="Search"
            className="p-2 grow focus:outline-none"
            onFocus={() => setSelectOpen(true)}
            value={
              multiple
                ? search
                : useSearch
                ? search
                : values.find((item) => item._id.toString() === selected)?.name
            }
            onChange={handleSearch}
          />
        </div>
        <div
          onClick={() => setSelectOpen(!selectOpen)}
          className="text-gray-500"
        >
          {selectOpen ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </div>
      {selectOpen && (
        <div className="border absolute w-full bg-gray-50 z-40 max-h-[20rem] overflow-scroll">
          {values.map((value) => (
            <div
              className={`px-2 py-2  cursor-pointer ${
                multiple
                  ? selected.includes(value._id.toString())
                    ? 'bg-primary text-white'
                    : 'hover:bg-gray-200'
                  : selected === value._id.toString()
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-200'
              }`}
              key={value._id}
              onClick={() => onSelect(value._id.toString())}
            >
              {value.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectSearch;
