import React, { LegacyRef, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import useOutsideClickHandler from '../../../../../hooks/useOutsideClickHandler';
// import { getUser, isLoggedIn } from '../../../redux/hooks/auth.hook';
import { RootState } from '../../../../../redux/store';
import Avatar from './Avatar';
import ProfileMenuContent from './ProfileMenuContent';
// import Avatar from '../../common/atoms/Avatar';
// import ProfileMenuContent from './ProfileMenuContent';

const ProfileMenu = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const [localUser, setLocalUser] = useState({} as any);

  useEffect(() => {
    setLocalUser(user);
  }, [isAuthenticated, user]);

  const [openMenu, setOpenMenu] = useState({ open: false, type: '' } as {
    open: boolean;
    type: 'hover' | 'click' | '';
  });

  const menuRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  useOutsideClickHandler(
    menuRef,
    () => setOpenMenu({ open: false, type: '' }),
    avatarRef
  );
  if (!isAuthenticated) return <div>Loading...</div>;
  return (
    <div className="relative">
      {isAuthenticated}
      <Avatar
        name={user?.name ?? 'Name'}
        img={user?.img}
        onClick={() =>
          setOpenMenu((state) => ({ open: !state.open, type: 'click' }))
        }
        ref={avatarRef}
      />
      {openMenu.open && <ProfileMenuContent ref={menuRef} />}
    </div>
  );
};

export default ProfileMenu;
