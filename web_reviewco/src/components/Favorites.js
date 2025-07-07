import React, { useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Sidebar from './Sidebar';

const Favorites = ({ user, onLogout }) => {
  const [favorites] = useState([]);

  return (
    <div style={{ backgroundColor: '#FAFAFA', minHeight: '100vh' }}>
      <Container fluid className="py-4">
        <Row>
          <Col md={3}>
            <Sidebar user={user} />
          </Col>
          <Col md={6}>
            <Card style={{ border: 'none', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
              <Card.Body style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ marginBottom: '32px' }}>
                  <i className="fas fa-heart" style={{ 
                    fontSize: '64px', 
                    color: '#E84393', 
                    marginBottom: '20px',
                    display: 'block'
                  }}></i>
                  <h3 style={{ color: '#4B3F2F', fontWeight: '600', marginBottom: '12px' }}>
                    Favorites
                  </h3>
                  <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.6' }}>
                    Simpan dan akses review cafe favorit Anda dengan mudah
                  </p>
                </div>

                <div className="text-center py-5">
                  <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    backgroundColor: '#F8F9FA',
                    margin: '0 auto 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="fas fa-bookmark" style={{ fontSize: '48px', color: '#C69C6D' }}></i>
                  </div>
                  
                  <h4 style={{ color: '#4B3F2F', fontWeight: '600', marginBottom: '12px' }}>
                    Belum Ada Favorites
                  </h4>
                  <p style={{ color: '#666', marginBottom: '24px', fontSize: '16px' }}>
                    Mulai tambahkan cafe dan restaurant favorit Anda dengan menekan tombol ❤️ pada postingan
                  </p>
                  
                  <div className="d-flex justify-content-center gap-3">
                    <Button 
                      variant="primary" 
                      href="/dashboard"
                      style={{ padding: '12px 24px' }}
                    >
                      <i className="fas fa-home me-2"></i>
                      Kembali ke Home
                    </Button>
                    <Button 
                      variant="outline-primary" 
                      href="/explore"
                      style={{ padding: '12px 24px' }}
                    >
                      <i className="fas fa-compass me-2"></i>
                      Jelajahi
                    </Button>
                  </div>
                </div>

                <div className="mt-5 pt-4" style={{ borderTop: '1px solid #E5E5E5' }}>
                  <Row className="text-center">
                    <Col>
                      <div style={{ marginBottom: '16px' }}>
                        <i className="fas fa-heart" style={{ fontSize: '24px', color: '#E84393', marginBottom: '8px' }}></i>
                        <h6 style={{ color: '#4B3F2F', fontSize: '14px', fontWeight: '600' }}>
                          Like Posts
                        </h6>
                        <small style={{ color: '#666' }}>
                          Tekan ❤️ untuk menyimpan
                        </small>
                      </div>
                    </Col>
                    <Col>
                      <div style={{ marginBottom: '16px' }}>
                        <i className="fas fa-bookmark" style={{ fontSize: '24px', color: '#00B894', marginBottom: '8px' }}></i>
                        <h6 style={{ color: '#4B3F2F', fontSize: '14px', fontWeight: '600' }}>
                          Save Reviews
                        </h6>
                        <small style={{ color: '#666' }}>
                          Simpan untuk nanti
                        </small>
                      </div>
                    </Col>
                    <Col>
                      <div style={{ marginBottom: '16px' }}>
                        <i className="fas fa-star" style={{ fontSize: '24px', color: '#FFB800', marginBottom: '8px' }}></i>
                        <h6 style={{ color: '#4B3F2F', fontSize: '14px', fontWeight: '600' }}>
                          Rate Places
                        </h6>
                        <small style={{ color: '#666' }}>
                          Beri rating favorit
                        </small>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <div className="sidebar">
              <h6 style={{ color: '#4B3F2F', marginBottom: '16px' }}>Quick Actions</h6>
              <div className="d-grid gap-2">
                <Button variant="outline-primary" size="sm" href="/explore">
                  <i className="fas fa-search me-2"></i>
                  Cari Cafe Baru
                </Button>
                <Button variant="outline-success" size="sm" href="/add-post">
                  <i className="fas fa-plus me-2"></i>
                  Tambah Review
                </Button>
                <Button variant="outline-info" size="sm" href="/profile">
                  <i className="fas fa-user me-2"></i>
                  Lihat Profile
                </Button>
              </div>
              
              <hr className="my-4" />
              
              <h6 style={{ color: '#4B3F2F', marginBottom: '16px' }}>Tips</h6>
              <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                <div className="mb-3">
                  <strong style={{ color: '#C69C6D' }}>💡 Pro Tip:</strong>
                  <p className="mb-0 mt-1">
                    Double-tap postingan untuk like dengan cepat, atau tekan tombol ❤️ untuk save ke favorites!
                  </p>
                </div>
                <div className="mb-3">
                  <strong style={{ color: '#E84393' }}>🔖 Organize:</strong>
                  <p className="mb-0 mt-1">
                    Gunakan fitur bookmark untuk menyimpan cafe yang ingin dikunjungi nanti.
                  </p>
                </div>
                <div>
                  <strong style={{ color: '#00B894' }}>⭐ Share:</strong>
                  <p className="mb-0 mt-1">
                    Bagikan review terbaik Anda kepada teman dan keluarga!
                  </p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Favorites; 