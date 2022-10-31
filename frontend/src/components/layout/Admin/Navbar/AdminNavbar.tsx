import axios from 'axios';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import React from 'react';

const AdminNavbar: React.FC<{ sidebarWidth: number; windowWidth: number }> = ({
  sidebarWidth,
  windowWidth,
}) => {
  // const handleRefresh = async () => {
  //   axios
  //     .get(process.env.NEXT_PUBLIC_CORE_BASE_URL + '/auth/refresh', {
  //       headers: {
  //         Authorization: 'Bearer ' + getCookie('refresh-token'),
  //         'content-type': 'application/json',
  //       },
  //     })
  //     .then((response) => {
  //       console.log(response);
  //       setCookie('access-token', response.data.accessToken);
  //       setCookie('refresh-token', response.data.refreshToken);
  //     });
  // };
  // async function handleFetchUsers() {
  //   axios
  //     .patch(process.env.NEXT_PUBLIC_CORE_BASE_URL + '/users/1', {
  //       headers: {
  //         Authorization: 'Bearer ' + getCookie('access-token'),
  //         'content-type': 'application/json',
  //       },
  //     })
  //     .then((response) => {
  //       console.table(response.data);
  //     });
  // }
  return (
    <div
      className="h-14 border-b bg-zinc-00 bg-white shadow-sm flex justify-between items-center px-6 fixed z-30 "
      style={{
        width: windowWidth - sidebarWidth,
      }}
    ></div>
  );
};

export default AdminNavbar;
