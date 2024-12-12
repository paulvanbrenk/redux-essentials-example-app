import React from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout } from '../features/auth/authSlice';
import { selectCurrentUser } from '../features/users/usersSlice';
import { UserIcon } from './UserIcon';
import {
  fetchNotificationsWebsocket,
  selectUnreadNotificationsCount,
  useGetNotificationsQuery,
} from '../features/notifications/notificationsSlice';

export const Navbar = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);

  // Trigger initial fetch of notifications and keep the websocket open to receive updates
  useGetNotificationsQuery();

  const isLoggedIn = !!user;
  const numUnreadNotifications = useAppSelector(selectUnreadNotificationsCount);

  let navContent: React.ReactNode = null;

  if (isLoggedIn) {
    const onLogoutClicked = () => {
      dispatch(logout());
    };

    const fetchNewNotifications = () => {
      dispatch(fetchNotificationsWebsocket());
    };

    let unreadNotificationsBadge: React.ReactNode | undefined;

    if (numUnreadNotifications > 0) {
      unreadNotificationsBadge = <span className="badge">{numUnreadNotifications}</span>;
    }

    navContent = (
      <div className="navContent">
        <div className="navLinks">
          <Link to="/posts">Posts</Link>
          <Link to="/users">Users</Link>
          <Link to="/notifications">Notifications {unreadNotificationsBadge}</Link>
          <button className="button small" onClick={fetchNewNotifications}>
            Refresh Notifications
          </button>
        </div>
        <div className="userDetails">
          <UserIcon size={32} />
          {user.name}
          <button className="button small" onClick={onLogoutClicked}>
            Log Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <nav>
      <section>
        <h1>Redux Essentials Example</h1>
        {navContent}
      </section>
    </nav>
  );
};
