import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Navbar, Nav, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import ReviewCard from './ReviewCard';
import { databaseService } from '../services/databaseService';

const Dashboard = ({ user, onLogout }) => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [user]);

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



  const filteredPosts = posts.filter(post =>
    post.cafe_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: '#FAFAFA', minHeight: '100vh' }}>
      <Navbar expand="lg" className="navbar" sticky="top">
        <Container>
          <Navbar.Brand href="#" style={{ fontWeight: '700', fontSize: '28px', color: '#4B3F2F' }}>
            ReviewCo.
          </Navbar.Brand>
          <Nav className="ms-auto d-flex align-items-center">
            <Form className="d-flex me-4" style={{ width: '300px' }}>
              <Form.Control
                type="search"
                placeholder="Cari cafe atau review..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ borderRadius: '25px' }}
              />
            </Form>
            <Link to="/add-post">
              <Button variant="primary" className="me-3">
                <i className="fas fa-plus me-2"></i>
                Tambah Post
              </Button>
            </Link>
            <div className="d-flex align-items-center">
              <span className="me-3" style={{ color: '#4B3F2F', fontWeight: '500' }}>
                Halo, {user?.name}
              </span>
              <Button variant="outline-secondary" size="sm" onClick={onLogout}>
                Keluar
              </Button>
            </div>
          </Nav>
        </Container>
      </Navbar>

      <Container fluid className="mt-4">
        <Row>
          <Col md={3}>
            <Sidebar user={user} />
          </Col>
          <Col md={6}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div className="mb-4 text-center">
                <h2 style={{ color: '#4B3F2F', fontWeight: '600', marginBottom: '8px' }}>
                  Latest Reviews
                </h2>
                <p style={{ color: '#666' }}>
                  Temukan cafe dan restaurant terbaik dari komunitas kami
                </p>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-search" style={{ fontSize: '48px', color: '#C69C6D', marginBottom: '20px' }}></i>
                  <h4 style={{ color: '#4B3F2F' }}>Tidak ada review ditemukan</h4>
                  <p style={{ color: '#666' }}>Coba kata kunci lain atau tambah review pertama Anda!</p>
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
            <div className="sidebar">
              <h5 style={{ color: '#4B3F2F', marginBottom: '20px' }}>Statistik</h5>
              <div className="text-center py-4" style={{ 
                backgroundColor: 'white', 
                borderRadius: '12px', 
                border: '1px solid #E5E5E5' 
              }}>
                <h6 style={{ color: '#4B3F2F', marginBottom: '10px' }}>Total Reviews</h6>
                <h3 style={{ color: '#C69C6D', fontWeight: '700' }}>{posts.length}</h3>
                <small style={{ color: '#666' }}>review dari komunitas</small>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard; 