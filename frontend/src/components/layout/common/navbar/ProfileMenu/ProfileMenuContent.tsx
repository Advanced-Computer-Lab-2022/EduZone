import React, { LegacyRef } from 'react';
import {
  FaUserAlt,
  FaUserEdit,
  FaChevronRight,
  FaFolder,
  FaWallet,
} from 'react-icons/fa';
import { IoNotificationsSharp } from 'react-icons/io5';
import { RiProfileFill } from 'react-icons/ri';
import { AiFillProfile, AiTwotoneSetting } from 'react-icons/ai';
import { CgOrganisation } from 'react-icons/cg';
import { IoMdLogOut, IoMdClose } from 'react-icons/io';
import { TbLogout } from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';
import ProfileMenuItem from './ProfileMenuItem';
import { deleteCookie, getCookie } from 'cookies-next';
import { axios } from '../../../../../utils';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../../../redux/features/auth.reducer';
import Divider from '../../../../common/Divider';
import IconText from '../../../../common/IconText';
import { RootState } from '../../../../../redux/store';
import { MdError } from 'react-icons/md';

// import { getCookie, deleteCookie } from 'cookies-next';
// // import { useRouter } from 'next/router';
// // import { logout } from '../../../redux/reducers/auth.reducer';

const ProfileMenuContent = React.forwardRef<HTMLDivElement, any>((any, ref) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    console.log('Logout');
    const res = await axios({
      url: '/auth/logout',
      headers: {
        Authorization: 'Bearer ' + getCookie('access-token'),
        'Content-type': 'application/json',
      },
      method: 'POST',
      data: {},
    });
    if (res.status == 200) {
      deleteCookie('access-token');
      deleteCookie('refresh-token');
      dispatch(logout());
      navigate('/login');
    }
  };
  return (
    <div
      className="bg-white shadow-lg rounded-md absolute right-0 top-14 z-50 w-72 flex flex-col overflow-hidden"
      ref={ref}
    >
      {/*Profile Menu options */}
      {user?.role == 'instructor' ? (
        <div>
          <ProfileMenuItem>
            <IconText
              text={'Instructor Dashboard'}
              leading={
                <CgOrganisation className="w-6 text-gray-400 group-hover:text-primary" />
              }
              link={'internal'}
              trailing={<FaChevronRight size={12} className="ml-auto" />}
              url={`/instructor/${user.id}`}
            />
          </ProfileMenuItem>
        </div>
      ) : null}
      {user?.role == 'admin' ? (
        <div>
          <ProfileMenuItem>
            <IconText
              text={'Admin Dashboard'}
              leading={
                <CgOrganisation className="w-6 text-gray-400 group-hover:text-primary" />
              }
              link={'internal'}
              trailing={<FaChevronRight size={12} className="ml-auto" />}
              url={`/admin`}
            />
          </ProfileMenuItem>
        </div>
      ) : null}
      {user?.role == 'trainee' || user?.role == 'corp_trainee' ? (
        <ProfileMenuItem>
          <IconText
            text={'My Courses'}
            leading={
              <FaFolder className="w-6 text-gray-400 group-hover:text-primary" />
            }
            link={'internal'}
            trailing={<FaChevronRight size={12} className="ml-auto" />}
            url={`/trainee/${user.id}/courses`}
          />
        </ProfileMenuItem>
      ) : null}

      {user.role !== 'instructor' && user.role !== 'admin ' && (
        <ProfileMenuItem>
          <IconText
            text={user.name}
            leading={
              <FaUserAlt className="w-6 text-gray-400 group-hover:text-primary" />
            }
            trailing={<FaChevronRight size={12} className="ml-auto" />}
            link={'internal'}
            url={
              user.role === 'instructor'
                ? `/instructor/${user.id}/profile`
                : `/trainee/${user.id}/profile`
            }
          />
        </ProfileMenuItem>
      )}

      <Divider />
      <ProfileMenuItem>
        <IconText
          text="Settings"
          leading={
            <AiTwotoneSetting
              size={20}
              className="w-6 text-gray-400 group-hover:text-primary"
            />
          }
          // trailing={<FaChevronRight size={12} className='ml-auto' />}
        />
      </ProfileMenuItem>
      <ProfileMenuItem>
        <IconText
          text={'Reported Problems'}
          leading={
            <MdError className="w-6 text-gray-400 group-hover:text-primary" />
          }
          trailing={<FaChevronRight size={12} className="ml-auto" />}
          link={'internal'}
          url={
            user.role === 'instructor'
              ? `/instructor/${user.id}/reported-problems`
              : `/trainee/${user.id}/reported-problems`
          }
        />
      </ProfileMenuItem>
      <Divider />
      <ProfileMenuItem>
        <IconText
          text="Logout"
          onClick={() => handleLogout()}
          leading={
            <TbLogout
              size={20}
              className="w-6 text-gray-400 group-hover:text-primary"
            />
          }
          // trailing={<FaChevronRight size={12} className='ml-auto' />}
        />
      </ProfileMenuItem>
    </div>
  );
});

ProfileMenuContent.displayName = 'ProfileMenuContent';
export default ProfileMenuContent;
