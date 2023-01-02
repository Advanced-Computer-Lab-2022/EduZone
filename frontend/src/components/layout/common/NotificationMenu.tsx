import React, { useEffect, useState } from 'react';
import { IoNotifications } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { axios } from '../../../utils';
import Menu from './Menu/Menu';

const NotificationMenu = () => {
  const { id } = useSelector((state: RootState) => state.auth.user);
  const [notifications, setNotifications] = useState(
    [] as {
      title: string;
      body: string;
      date: Date;
    }[]
  );
  const getNotifications = async () => {
    const res = await axios({
      url: '/users/' + id + '/notifications',
      method: 'GET',
    });

    console.log(res.data);

    if (res.status == 200) {
      setNotifications(res.data);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <div>
      <Menu action={<IoNotifications className="text-gray-600" size={20} />}>
        <div className="flex flex-col gap-2 p-4">
          {notifications &&
            notifications?.map((notification) => (
              <div className="flex flex-col gap-1 pb-1 border-b">
                <div className="text-sm font-semibold">
                  {notification.title}
                </div>
                <div className="text-xs text-gray-500">{notification.body}</div>
              </div>
            ))}
        </div>
      </Menu>
    </div>
  );
};

export default NotificationMenu;
