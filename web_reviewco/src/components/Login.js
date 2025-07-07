import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(formData.email, formData.password);
      
      if (response.success) {
        onLogin(response.user);
        navigate('/dashboard');
      } else {
        setError(response.message || 'Login gagal');
      }
    } catch (error) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
      <Container fluid>
        <Row style={{ minHeight: '100vh' }}>
          <Col md={6} className="d-flex align-items-center justify-content-center" style={{ backgroundColor: '#F8F9FA' }}>
            <div style={{
              width: '80%',
              maxWidth: '400px',
              background: '#E8E8E8',
              borderRadius: '20px',
              height: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}>
              <div className="text-center">
                <i className="fas fa-store" style={{ fontSize: '80px', color: '#C69C6D', marginBottom: '20px' }}></i>
                <h3 style={{ color: '#4B3F2F', fontWeight: '600' }}>Welcome Back</h3>
                <p style={{ color: '#666' }}>Masuk untuk melanjutkan</p>
              </div>
            </div>
          </Col>
          <Col md={6} className="d-flex align-items-center justify-content-center">
            <div style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
              <div className="text-center mb-4">
                <h2 style={{ 
                  fontSize: '32px', 
                  fontWeight: '700', 
                  color: '#4B3F2F',
                  marginBottom: '8px'
                }}>
                  Masuk
                </h2>
                <p style={{ color: '#666', fontSize: '16px' }}>
                  Masuk ke akun ReviewCo Anda
                </p>
              </div>

              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: '500', color: '#4B3F2F' }}>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Masukkan email Anda"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{ height: '50px' }}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label style={{ fontWeight: '500', color: '#4B3F2F' }}>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Masukkan password Anda"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={{ height: '50px' }}
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-3"
                  disabled={loading}
                  style={{ height: '50px', fontSize: '16px', fontWeight: '600' }}
                >
                  {loading ? 'Memproses...' : 'Masuk'}
                </Button>
              </Form>

              <div className="text-center">
                <p style={{ color: '#666', fontSize: '14px' }}>
                  Belum memiliki akun? {' '}
                  <Link to="/register" style={{ color: '#C69C6D', textDecoration: 'none', fontWeight: '500' }}>
                    Daftar di sini
                  </Link>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login; 