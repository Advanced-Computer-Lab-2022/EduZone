import { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import { axios } from '../utils';

const useApi = (config: AxiosRequestConfig<any>) => {
  const [data, setdata] = useState(null);
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState('');

  useEffect(() => {
    axios(config)
      .then((res) => {
        setdata(res.data as any);
        setloading(false);
      })
      .catch((err) => {
        seterror(err.message);
        setloading(false);
      });
  }, [config]);

  return { data, loading, error };
};

export default useApi;
