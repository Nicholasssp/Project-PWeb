import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Tab, Nav } from 'react-bootstrap';
import Sidebar from './Sidebar';
import ReviewCard from './ReviewCard';
import { databaseService } from '../services/databaseService';

const Profile = ({ user, onLogout }) => {
  const [userPosts, setUserPosts] = useState([]);
  const [stats, setStats] = useState({
    posts: 0,
    likesReceived: 0,
    followers: 0,
    following: 0,
    cafesVisited: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserPosts();
    fetchUserStats();
  }, []);

  const fetchUserPosts = async () => {
    try {
      const response = await databaseService.getUserPosts(user.id);
      if (response.success) {
        setUserPosts(response.posts);
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await databaseService.getUserStats(user.id);
      if (response.success) {
        setStats(response.stats);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleLike = async (postId) => {
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
                  background: `linear-gradient(135deg, #C69C6D 0%, #B8906A 100%)`,
                  margin: '0 auto 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '48px',
                  fontWeight: '600'
                }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                
                <h3 style={{ color: '#4B3F2F', fontWeight: '600', marginBottom: '8px' }}>
                  {user?.name}
                </h3>
                <p style={{ color: '#666', marginBottom: '20px' }}>
                  {user?.email}
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
                  <Button variant="primary" className="me-2">
                    Edit Profile
                  </Button>
                  <Button variant="outline-secondary">
                    Share Profile
                  </Button>
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
                    <Nav.Item>
                      <Nav.Link eventKey="liked" style={{ border: 'none', color: '#666' }}>
                        <i className="fas fa-heart me-2"></i>
                        Liked
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="saved" style={{ border: 'none', color: '#666' }}>
                        <i className="fas fa-bookmark me-2"></i>
                        Saved
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
                          <h4 style={{ color: '#4B3F2F' }}>Belum ada postingan</h4>
                          <p style={{ color: '#666' }}>Mulai bagikan review cafe pertama Anda!</p>
                        </div>
                      ) : (
                        <div>
                          {userPosts.map(post => (
                            <ReviewCard 
                              key={post.id} 
                              post={post} 
                              onLike={handleLike}
                              currentUser={user}
                            />
                          ))}
                        </div>
                      )}
                    </Tab.Pane>
                    
                    <Tab.Pane eventKey="liked">
                      <div className="text-center py-5">
                        <i className="fas fa-heart" style={{ fontSize: '48px', color: '#E84393', marginBottom: '20px' }}></i>
                        <h4 style={{ color: '#4B3F2F' }}>Posts yang Disukai</h4>
                        <p style={{ color: '#666' }}>Fitur ini akan segera tersedia!</p>
                      </div>
                    </Tab.Pane>
                    
                    <Tab.Pane eventKey="saved">
                      <div className="text-center py-5">
                        <i className="fas fa-bookmark" style={{ fontSize: '48px', color: '#00B894', marginBottom: '20px' }}></i>
                        <h4 style={{ color: '#4B3F2F' }}>Posts yang Disimpan</h4>
                        <p style={{ color: '#666' }}>Fitur ini akan segera tersedia!</p>
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                </Card.Body>
              </Card>
            </Tab.Container>
          </Col>
          <Col md={3}>
            <div className="sidebar">
              <h6 style={{ color: '#4B3F2F', marginBottom: '16px' }}>Statistik Anda</h6>
              <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.8' }}>
                <div className="d-flex justify-content-between mb-2">
                  <span>Total Reviews:</span>
                  <strong style={{ color: '#C69C6D' }}>{stats.posts}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Total Likes:</span>
                  <strong style={{ color: '#E84393' }}>{stats.likes}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Cafe Dikunjungi:</span>
                  <strong style={{ color: '#00B894' }}>{stats.posts}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Member Sejak:</span>
                  <strong style={{ color: '#666' }}>2024</strong>
                </div>
              </div>
            </div>
          </Col>
          <Col md={3}>
            <Card style={{ border: 'none', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)', marginBottom: '24px' }}>
              <Card.Header style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E5E5' }}>
                <h6 style={{ color: '#4B3F2F', margin: '0', fontWeight: '600' }}>
                  Statistik Anda
                </h6>
              </Card.Header>
              <Card.Body style={{ padding: '20px' }}>
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span style={{ color: '#666', fontSize: '14px' }}>Total Reviews</span>
                    <span style={{ color: '#C69C6D', fontWeight: '600', fontSize: '16px' }}>
                      {stats.posts || 0}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span style={{ color: '#666', fontSize: '14px' }}>Total Likes</span>
                    <span style={{ color: '#E84393', fontWeight: '600', fontSize: '16px' }}>
                      {stats.likesReceived || 0}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span style={{ color: '#666', fontSize: '14px' }}>Cafe Dikunjungi</span>
                    <span style={{ color: '#00B894', fontWeight: '600', fontSize: '16px' }}>
                      {stats.cafesVisited || 0}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span style={{ color: '#666', fontSize: '14px' }}>Member Sejak</span>
                    <span style={{ color: '#636E72', fontWeight: '600', fontSize: '16px' }}>
                      2024
                    </span>
                  </div>
                </div>
              </Card.Body>
            </Card>
            
            <Card style={{ border: 'none', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
              <Card.Header style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E5E5' }}>
                <h6 style={{ color: '#4B3F2F', margin: '0', fontWeight: '600' }}>
                  Tips Review
                </h6>
              </Card.Header>
              <Card.Body style={{ padding: '20px' }}>
                <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                  <div className="mb-2">
                    • Berikan detail tentang makanan dan minuman
                  </div>
                  <div className="mb-2">
                    • Jelaskan suasana dan ambience tempat
                  </div>
                  <div className="mb-2">
                    • Sebutkan kualitas pelayanan
                  </div>
                  <div>
                    • Upload foto yang menarik dan berkualitas
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile; 