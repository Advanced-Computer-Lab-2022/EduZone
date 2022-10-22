import React from 'react';
import { InputFieldProps } from './../../types';

const InputField: React.FC<InputFieldProps> = ({
  type,
  placeholder,
  icon,
  name,
}) => {
  return (
    <div className="relative mb-6">
      <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
        {icon}
      </div>
      <input
        type={type || 'text'}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 p-3 "
        placeholder={placeholder}
        name={name}
      />
    </div>
  );
};

export default InputField;
