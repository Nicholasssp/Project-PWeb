import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Tab, Nav } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import ReviewCard from './ReviewCard';
import axios from 'axios';

const UserProfile = ({ user, onLogout }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [stats, setStats] = useState({
    posts: 0,
    likesReceived: 0,
    followers: 0,
    following: 0,
    cafesVisited: 0
  });
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
      fetchUserPosts();
      fetchUserStats();
      checkFollowStatus();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`http://localhost/web_reviewco/server/api/get_user_profile.php?user_id=${userId}`);
      if (response.data.success) {
        setProfileUser(response.data.user);
      } else {
        // User not found, redirect to dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      navigate('/dashboard');
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(`http://localhost/web_reviewco/server/api/get_user_posts.php?user_id=${userId}`);
      if (response.data.success) {
        setUserPosts(response.data.posts);
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await axios.get(`http://localhost/web_reviewco/server/api/get_user_stats.php?user_id=${userId}`);
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const checkFollowStatus = async () => {
    if (!user || user.id == userId) return;
    
    try {
      const response = await axios.get(`http://localhost/web_reviewco/server/api/check_follow.php?follower_id=${user.id}&following_id=${userId}`);
      if (response.data.success) {
        setIsFollowing(response.data.is_following);
      }
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const handleFollow = async () => {
    if (!user) return;
    
    try {
      const response = await axios.post('http://localhost/web_reviewco/server/api/follow_user.php', {
        follower_id: user.id,
        following_id: userId
      });
      
      if (response.data.success) {
        setIsFollowing(!isFollowing);
        fetchUserStats(); // Refresh stats
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleLike = async (postId) => {
    if (!user) return;
    
    try {
      const response = await axios.post('http://localhost/web_reviewco/server/api/like_post.php', {
        post_id: postId,
        user_id: user.id
      });
      
      if (response.data.success) {
        fetchUserPosts();
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  if (!profileUser) {
    return (
      <div style={{ backgroundColor: '#FAFAFA', minHeight: '100vh' }}>
        <Container fluid className="py-4">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const isOwnProfile = user && user.id == userId;

  return (
    <div style={{ backgroundColor: '#FAFAFA', minHeight: '100vh' }}>
      <Container fluid className="py-4">
        <Row>
          <Col md={3}>
            <Sidebar user={user} />
          </Col>
          <Col md={6}>
            <Card style={{ border: 'none', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)', marginBottom: '24px' }}>
              <Card.Body style={{ padding: '32px', textAlign: 'center' }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: profileUser.profile_image 
                    ? `url(${profileUser.profile_image})` 
                    : `linear-gradient(135deg, #C69C6D 0%, #B8906A 100%)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  margin: '0 auto 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '48px',
                  fontWeight: '600'
                }}>
                  {!profileUser.profile_image && profileUser.name?.charAt(0).toUpperCase()}
                </div>
                
                <h3 style={{ color: '#4B3F2F', fontWeight: '600', marginBottom: '8px' }}>
                  {profileUser.name}
                </h3>
                <p style={{ color: '#666', marginBottom: '20px' }}>
                  {profileUser.email}
                </p>
                
                <Row className="text-center">
                  <Col>
                    <div style={{ fontWeight: '600', fontSize: '24px', color: '#4B3F2F' }}>
                      {stats.posts || 0}
                    </div>
                    <div style={{ color: '#666', fontSize: '14px' }}>Posts</div>
                  </Col>
                  <Col>
                    <div style={{ fontWeight: '600', fontSize: '24px', color: '#4B3F2F' }}>
                      {stats.likesReceived || 0}
                    </div>
                    <div style={{ color: '#666', fontSize: '14px' }}>Likes</div>
                  </Col>
                  <Col>
                    <div style={{ fontWeight: '600', fontSize: '24px', color: '#4B3F2F' }}>
                      {stats.following || 0}
                    </div>
                    <div style={{ color: '#666', fontSize: '14px' }}>Following</div>
                  </Col>
                  <Col>
                    <div style={{ fontWeight: '600', fontSize: '24px', color: '#4B3F2F' }}>
                      {stats.followers || 0}
                    </div>
                    <div style={{ color: '#666', fontSize: '14px' }}>Followers</div>
                  </Col>
                </Row>
                
                <div className="mt-4">
                  {isOwnProfile ? (
                    <>
                      <Button variant="primary" className="me-2" onClick={() => navigate('/settings')}>
                        Edit Profile
                      </Button>
                      <Button variant="outline-secondary">
                        Share Profile
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        variant={isFollowing ? "outline-primary" : "primary"} 
                        className="me-2"
                        onClick={handleFollow}
                      >
                        {isFollowing ? 'Unfollow' : 'Follow'}
                      </Button>
                      <Button variant="outline-secondary">
                        Message
                      </Button>
                    </>
                  )}
                </div>
              </Card.Body>
            </Card>

            <Tab.Container defaultActiveKey="posts">
              <Card style={{ border: 'none', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
                <Card.Header style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E5E5' }}>
                  <Nav variant="tabs" className="border-0">
                    <Nav.Item>
                      <Nav.Link eventKey="posts" style={{ border: 'none', color: '#666' }}>
                        <i className="fas fa-th-large me-2"></i>
                        Posts ({userPosts.length})
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Header>
                
                <Card.Body style={{ padding: '24px' }}>
                  <Tab.Content>
                    <Tab.Pane eventKey="posts">
                      {loading ? (
                        <div className="text-center py-5">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : userPosts.length === 0 ? (
                        <div className="text-center py-5">
                          <i className="fas fa-camera" style={{ fontSize: '48px', color: '#C69C6D', marginBottom: '20px' }}></i>
                          <h4 style={{ color: '#4B3F2F' }}>
                            {isOwnProfile ? 'Belum ada postingan' : `${profileUser.name} belum ada postingan`}
                          </h4>
                          <p style={{ color: '#666' }}>
                            {isOwnProfile ? 'Mulai bagikan review cafe pertama Anda!' : 'User ini belum membagikan review apapun.'}
                          </p>
                        </div>
                      ) : (
                        <div>
                          {userPosts.map(post => (
                            <ReviewCard 
                              key={post.id} 
                              post={post} 
                              onLike={handleLike}
                              currentUser={user}
                              onPostUpdate={fetchUserPosts}
                            />
                          ))}
                        </div>
                      )}
                    </Tab.Pane>
                  </Tab.Content>
                </Card.Body>
              </Card>
            </Tab.Container>
          </Col>
          <Col md={3}>
            <div className="sidebar">
              <h6 style={{ color: '#4B3F2F', marginBottom: '16px' }}>Profile Info</h6>
              <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.8' }}>
                <div className="d-flex justify-content-between mb-2">
                  <span>Cafes Visited:</span>
                  <strong style={{ color: '#C69C6D' }}>{stats.cafesVisited}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Total Reviews:</span>
                  <strong style={{ color: '#00B894' }}>{stats.posts}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Likes Received:</span>
                  <strong style={{ color: '#E84393' }}>{stats.likesReceived}</strong>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UserProfile; 