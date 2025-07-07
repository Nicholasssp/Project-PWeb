import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #FAFAFA 0%, #F5F5F5 100%)',
      display: 'flex',
      alignItems: 'center'
    }}>
      <Container>
        <Row className="justify-content-center align-items-center">
          <Col md={6} className="text-center mb-5 mb-md-0">
            <div style={{
              width: '400px',
              height: '300px',
              background: '#E8E8E8',
              borderRadius: '20px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}>
              <i className="fas fa-coffee" style={{ fontSize: '80px', color: '#C69C6D' }}></i>
            </div>
          </Col>
          <Col md={6}>
            <div className="text-center text-md-start">
              <h1 style={{ 
                fontSize: '48px', 
                fontWeight: '700', 
                color: '#4B3F2F',
                marginBottom: '16px',
                letterSpacing: '-1px'
              }}>
                ReviewCo.
              </h1>
              <p style={{ 
                fontSize: '18px', 
                color: '#666', 
                marginBottom: '40px',
                lineHeight: '1.6'
              }}>
                Temukan dan bagikan pengalaman kafe terbaik Anda. 
                Bergabunglah dengan komunitas pencinta kopi dan makanan.
              </p>
              <div className="d-grid gap-3">
                <Link to="/login">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="w-100"
                    style={{
                      height: '56px',
                      fontSize: '16px',
                      fontWeight: '600'
                    }}
                  >
                    Masuk
                  </Button>
                </Link>
                <Link to="/register">
                  <Button 
                    variant="outline-primary" 
                    size="lg" 
                    className="w-100"
                    style={{
                      height: '56px',
                      fontSize: '16px',
                      fontWeight: '600'
                    }}
                  >
                    Daftar
                  </Button>
                </Link>
              </div>
              <div className="mt-4">
                <small style={{ color: '#999' }}>
                  Sudah memiliki akun? <Link to="/login" style={{ color: '#C69C6D', textDecoration: 'none' }}>Masuk di sini</Link>
                </small>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Welcome; 