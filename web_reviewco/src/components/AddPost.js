import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { databaseService } from '../services/databaseService';
import { icons } from '../utils/base64Icons';

const AddPost = ({ user, onLogout }) => {
  const [formData, setFormData] = useState({
    cafe_name: '',
    location: '',
    rating: 0,
    category: 'Coffee Shop',
    description: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const categories = [
    'Coffee Shop',
    'Restaurant',
    'Fast Food',
    'Bakery',
    'Dessert',
    'Asian Food',
    'Western Food',
    'Cafe & Bar'
  ];

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size should be less than 5MB');
        return;
      }
      setFormData({ ...formData, image: file });
      
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await databaseService.addPost(user.id, {
        cafe_name: formData.cafe_name,
        location: formData.location,
        rating: parseInt(formData.rating),
        category: formData.category,
        description: formData.description,
        image: formData.image
      });
      
      if (response.success) {
        setSuccess('Review berhasil ditambahkan!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError(response.error || 'Gagal menambahkan review');
      }
    } catch (error) {
      console.error('Error adding post:', error);
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <img
          key={i}
          src={i <= formData.rating ? icons.star : icons.starEmpty}
          alt={`Star ${i}`}
          onClick={() => setFormData({ ...formData, rating: i })}
          style={{ 
            width: '24px', 
            height: '24px', 
            marginRight: '4px',
            cursor: 'pointer' 
          }}
        />
      );
    }
    return stars;
  };

  return (
    <div style={{ backgroundColor: '#FAFAFA', minHeight: '100vh' }}>
      <Container fluid className="py-4">
        <Row>
          <Col md={3}>
            <Sidebar user={user} />
          </Col>
          <Col md={6}>
            <Card style={{ border: 'none', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
              <Card.Header style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E5E5', borderRadius: '16px 16px 0 0' }}>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h4 style={{ color: '#4B3F2F', fontWeight: '600', margin: '0' }}>
                      Tambah Review Baru
                    </h4>
                    <small style={{ color: '#666' }}>
                      Bagikan pengalaman cafe atau restaurant Anda
                    </small>
                  </div>
                  <Link to="/dashboard">
                    <Button variant="outline-secondary" size="sm">
                      <img src={icons.times} alt="Close" style={{ width: '16px', height: '16px' }} />
                    </Button>
                  </Link>
                </div>
              </Card.Header>
              
              <Card.Body style={{ padding: '32px' }}>
                {error && (
                  <Alert variant="danger" className="mb-3">
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert variant="success" className="mb-3">
                    {success}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: '500', color: '#4B3F2F' }}>
                      Nama Cafe/Restaurant
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="cafe_name"
                      placeholder="Masukkan nama cafe atau restaurant"
                      value={formData.cafe_name}
                      onChange={handleChange}
                      required
                      style={{ height: '50px' }}
                    />
                  </Form.Group>

                  <Row>
                    <Col md={8}>
                      <Form.Group className="mb-4">
                        <Form.Label style={{ fontWeight: '500', color: '#4B3F2F' }}>
                          Lokasi
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="location"
                          placeholder="Contoh: Jakarta Selatan, Bandung"
                          value={formData.location}
                          onChange={handleChange}
                          required
                          style={{ height: '50px' }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-4">
                        <Form.Label style={{ fontWeight: '500', color: '#4B3F2F' }}>
                          Kategori
                        </Form.Label>
                        <Form.Select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          style={{ height: '50px' }}
                        >
                          {categories.map((category, index) => (
                            <option key={index} value={category}>
                              {category}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: '500', color: '#4B3F2F' }}>
                      Rating ({formData.rating}/5)
                    </Form.Label>
                    <div className="d-flex align-items-center">
                      {renderStars()}
                      <span style={{ marginLeft: '12px', color: '#666', fontSize: '14px' }}>
                        Klik bintang untuk memberikan rating
                      </span>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: '500', color: '#4B3F2F' }}>
                      Upload Foto
                    </Form.Label>
                    <div className="upload-section">
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        style={{ display: 'none' }}
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="upload-btn">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            style={{
                              width: '100%',
                              height: '200px',
                              objectFit: 'cover',
                              borderRadius: '8px'
                            }}
                          />
                        ) : (
                          <div className="upload-placeholder">
                            <img src={icons.camera} alt="Upload" style={{ width: '32px', height: '32px', marginBottom: '8px' }} />
                            <span>Click to upload photo</span>
                          </div>
                        )}
                      </label>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: '500', color: '#4B3F2F' }}>
                      Review & Experience
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      name="description"
                      rows={4}
                      placeholder="Share your experience..."
                      value={formData.description}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <div className="text-end">
                    <Link to="/dashboard">
                      <Button variant="secondary" className="me-2">
                        <img src={icons.times} alt="Cancel" style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                        Cancel
                      </Button>
                    </Link>
                    <Button 
                      variant="primary" 
                      type="submit"
                      disabled={loading}
                    >
                      <img src={icons.paperPlane} alt="Submit" style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                      {loading ? 'Posting...' : 'Post Review'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <div className="sidebar">
              <h6 style={{ color: '#4B3F2F', marginBottom: '16px' }}>Tips Review yang Baik</h6>
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
                <div className="mb-2">
                  • Cantumkan kisaran harga jika memungkinkan
                </div>
                <div>
                  • Upload foto yang menarik dan berkualitas
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AddPost; 