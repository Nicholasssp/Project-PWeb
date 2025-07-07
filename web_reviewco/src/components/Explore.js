import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import ReviewCard from './ReviewCard';
import { databaseService } from '../services/databaseService';

const Explore = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  const categories = [
    'All',
    'Coffee Shop',
    'Restaurant',
    'Fast Food',
    'Bakery',
    'Dessert',
    'Asian Food',
    'Western Food',
    'Cafe & Bar'
  ];

  const sortOptions = [
    { value: 'newest', label: 'Terbaru' },
    { value: 'oldest', label: 'Terlama' },
    { value: 'rating_high', label: 'Rating Tertinggi' },
    { value: 'rating_low', label: 'Rating Terendah' },
    { value: 'most_liked', label: 'Paling Disukai' }
  ];

  useEffect(() => {
    fetchPosts();
    fetchUsers();
  }, [user]);

  useEffect(() => {
    filterAndSortPosts();
  }, [posts, searchTerm, selectedCategory, sortBy]);

  const fetchPosts = async () => {
    try {
      const response = await databaseService.getPosts(user?.id);
      if (response.success) {
        setPosts(response.posts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await databaseService.getUsers();
      if (response.success) {
        // Filter out current user
        const otherUsers = response.users.filter(u => u.id !== user?.id);
        setUsers(otherUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const filterAndSortPosts = () => {
    let filtered = [...posts];

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.cafe_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'rating_high':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating_low':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case 'most_liked':
        filtered.sort((a, b) => (b.like_count || 0) - (a.like_count || 0));
        break;
      default:
        break;
    }

    setFilteredPosts(filtered);
  };

  const handleLike = async (postId) => {
    try {
      const response = await databaseService.likePost(postId, user.id);
      
      if (response.success) {
        fetchPosts();
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
              <Card.Body style={{ padding: '24px' }}>
                <div className="text-center mb-4">
                  <h3 style={{ color: '#4B3F2F', fontWeight: '600', marginBottom: '8px' }}>
                    <i className="fas fa-compass me-2" style={{ color: '#C69C6D' }}></i>
                    Jelajahi Cafe & Restaurant
                  </h3>
                  <p style={{ color: '#666', marginBottom: '24px' }}>
                    Temukan tempat makan dan minum terbaik dari komunitas kami
                  </p>
                </div>

                <Row className="mb-4">
                  <Col md={12}>
                    <InputGroup className="mb-3">
                      <InputGroup.Text style={{ backgroundColor: '#F8F9FA', border: '2px solid #E5E5E5' }}>
                        <i className="fas fa-search" style={{ color: '#C69C6D' }}></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Cari cafe, restaurant, atau lokasi..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ border: '2px solid #E5E5E5', borderLeft: 'none' }}
                      />
                    </InputGroup>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Label style={{ fontWeight: '500', color: '#4B3F2F', fontSize: '14px' }}>
                      Kategori
                    </Form.Label>
                    <Form.Select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      style={{ height: '45px' }}
                    >
                      {categories.map((category, index) => (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={6}>
                    <Form.Label style={{ fontWeight: '500', color: '#4B3F2F', fontSize: '14px' }}>
                      Urutkan
                    </Form.Label>
                    <Form.Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      style={{ height: '45px' }}
                    >
                      {sortOptions.map((option, index) => (
                        <option key={index} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                </Row>

                <div className="d-flex justify-content-between align-items-center">
                  <small style={{ color: '#666' }}>
                    Menampilkan {filteredPosts.length} dari {posts.length} review
                  </small>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                      setSortBy('newest');
                    }}
                  >
                    Reset Filter
                  </Button>
                </div>
              </Card.Body>
            </Card>

            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-search" style={{ fontSize: '48px', color: '#C69C6D', marginBottom: '20px' }}></i>
                  <h4 style={{ color: '#4B3F2F' }}>Tidak ada hasil ditemukan</h4>
                  <p style={{ color: '#666' }}>
                    Coba kata kunci lain atau ubah filter pencarian Anda
                  </p>
                </div>
              ) : (
                filteredPosts.map(post => (
                  <ReviewCard 
                    key={post.id} 
                    post={post} 
                    currentUser={user}
                    onPostUpdate={fetchPosts}
                  />
                ))
              )}
            </div>
          </Col>
          <Col md={3}>
            <Card style={{ border: 'none', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)', marginBottom: '24px' }}>
              <Card.Body style={{ padding: '20px' }}>
                <h6 style={{ color: '#4B3F2F', marginBottom: '16px', fontWeight: '600' }}>
                  <i className="fas fa-users me-2" style={{ color: '#C69C6D' }}></i>
                  Reviewer Lainnya
                </h6>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {users.slice(0, 8).map((otherUser, index) => (
                    <div
                      key={otherUser.id}
                      onClick={() => navigate(`/user/${otherUser.id}`)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        marginBottom: '8px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#F8F9FA';
                        e.target.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.transform = 'translateX(0)';
                      }}
                      className="user-item"
                    >
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: otherUser.profile_image 
                            ? `url(${otherUser.profile_image})` 
                            : `linear-gradient(135deg, #C69C6D 0%, #B8906A 100%)`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: '600',
                          marginRight: '12px',
                          flexShrink: 0
                        }}
                      >
                        {!otherUser.profile_image && otherUser.name?.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ 
                          fontWeight: '500', 
                          color: '#4B3F2F', 
                          fontSize: '14px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {otherUser.name}
                        </div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: '#666',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          @{otherUser.name?.toLowerCase().replace(/\s+/g, '')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
            
            <Card style={{ border: 'none', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
              <Card.Body style={{ padding: '20px' }}>
                <h6 style={{ color: '#4B3F2F', marginBottom: '16px', fontWeight: '600' }}>
                  <i className="fas fa-chart-bar me-2" style={{ color: '#C69C6D' }}></i>
                  Statistik Explore
                </h6>
                <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.8' }}>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Total Reviews:</span>
                    <strong style={{ color: '#C69C6D' }}>{posts.length}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Total Users:</span>
                    <strong style={{ color: '#00B894' }}>{users.length + 1}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Filter Aktif:</span>
                    <strong style={{ color: '#E84393' }}>
                      {selectedCategory !== 'All' || searchTerm ? 'Ya' : 'Tidak'}
                    </strong>
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

export default Explore; 