import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { databaseService } from '../services/databaseService';

const Sidebar = ({ user }) => {
  const location = useLocation();
  const [userStats, setUserStats] = useState({
    posts: 0,
    followers: 0,
    following: 0,
    likesReceived: 0,
    cafesVisited: 0
  });

  useEffect(() => {
    if (user?.id) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const response = await databaseService.getUserStats(user.id);
      if (response.success) {
        setUserStats(response.stats);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const menuItems = [
    { path: '/dashboard', icon: 'fas fa-home', label: 'Home Feed', color: '#C69C6D' },
    { path: '/profile', icon: 'fas fa-user', label: 'Profile', color: '#6C5CE7' },
    { path: '/explore', icon: 'fas fa-compass', label: 'Explore', color: '#00B894' },
    { path: '/favorites', icon: 'fas fa-heart', label: 'Favorites', color: '#E84393' },
    { path: '/add-post', icon: 'fas fa-plus-circle', label: 'Add Post', color: '#00CEC9' },
    { path: '/settings', icon: 'fas fa-cog', label: 'Settings', color: '#636E72' }
  ];

  return (
    <div className="sidebar">
      <div className="text-center mb-4 pb-4" style={{ borderBottom: '1px solid #E5E5E5' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, #C69C6D 0%, #B8906A 100%)`,
          margin: '0 auto 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '32px',
          fontWeight: '600'
        }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <h5 style={{ color: '#4B3F2F', marginBottom: '4px', fontWeight: '600' }}>
          {user?.name}
        </h5>
        <p style={{ color: '#666', fontSize: '14px', margin: '0' }}>
          {user?.email}
        </p>
        <div className="mt-3" style={{ display: 'flex', justifyContent: 'space-around', fontSize: '14px' }}>
          <div className="text-center">
            <div style={{ fontWeight: '600', color: '#4B3F2F' }}>{userStats.posts || 0}</div>
            <div style={{ color: '#666', fontSize: '12px' }}>Posts</div>
          </div>
          <div className="text-center">
            <div style={{ fontWeight: '600', color: '#4B3F2F' }}>{userStats.following || 0}</div>
            <div style={{ color: '#666', fontSize: '12px' }}>Following</div>
          </div>
          <div className="text-center">
            <div style={{ fontWeight: '600', color: '#4B3F2F' }}>{userStats.followers || 0}</div>
            <div style={{ color: '#666', fontSize: '12px' }}>Followers</div>
          </div>
        </div>
      </div>

      <nav>
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={index}
              to={item.path}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              style={{
                backgroundColor: isActive ? item.color : 'transparent',
                color: isActive ? 'white' : '#666'
              }}
            >
              <i className={item.icon} style={{ marginRight: '12px', width: '20px' }}></i>
              <span style={{ fontWeight: isActive ? '600' : '400' }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 pt-4" style={{ borderTop: '1px solid #E5E5E5' }}>
        <div style={{ padding: '16px', backgroundColor: '#F8F9FA', borderRadius: '12px' }}>
          <h6 style={{ color: '#4B3F2F', marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>
            Quick Stats
          </h6>
          <div className="mb-2" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span style={{ color: '#666' }}>Reviews Posted</span>
            <span style={{ color: '#C69C6D', fontWeight: '600' }}>{userStats.posts || 0}</span>
          </div>
          <div className="mb-2" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span style={{ color: '#666' }}>Likes Received</span>
            <span style={{ color: '#E84393', fontWeight: '600' }}>{userStats.likesReceived || 0}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span style={{ color: '#666' }}>Cafes Visited</span>
            <span style={{ color: '#00B894', fontWeight: '600' }}>{userStats.cafesVisited || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 