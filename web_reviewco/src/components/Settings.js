import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Modal } from 'react-bootstrap';
import Sidebar from './Sidebar';
import { databaseService } from '../services/databaseService';

const Settings = ({ user, onLogout, onUserUpdate }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userStats, setUserStats] = useState({ posts: 0 });
  const fileInputRef = useRef(null);

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setMessage('Ukuran file maksimal 2MB');
        return;
      }
      
      setProfileImage(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const updateData = {
        name: formData.name,
        email: formData.email
      };

      if (profileImage) {
        updateData.profile_image = profileImage;
      }

      const response = await databaseService.updateUserProfile(user.id, updateData);
      
      if (response.success) {
        setMessage('Profile berhasil diperbarui!');
        
        // Update user data in local storage and parent component
        const updatedUser = { ...user, ...updateData };
        if (profileImage) {
          updatedUser.profile_image = await databaseService.fileToBase64(profileImage);
        }
        
        if (onUserUpdate) {
          onUserUpdate(updatedUser);
        }
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setProfileImage(null);
        setPreviewImage(null);
        setShowModal(false);
      } else {
        setMessage(response.error || 'Gagal memperbarui profile');
      }
    } catch (error) {
      setMessage('Terjadi kesalahan saat memperbarui profile');
      console.error('Error:', error);
    }

    setLoading(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const resetImageSelection = () => {
    setProfileImage(null);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
            <Card style={{ border: 'none', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
              <Card.Header style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E5E5' }}>
                <h4 style={{ color: '#4B3F2F', fontWeight: '600', margin: '0' }}>
                  <i className="fas fa-cog me-2" style={{ color: '#C69C6D' }}></i>
                  Pengaturan Akun
                </h4>
              </Card.Header>
              
              <Card.Body style={{ padding: '32px' }}>
                {message && (
                  <Alert variant={message.includes('berhasil') ? 'success' : 'danger'} className="mb-4">
                    {message}
                  </Alert>
                )}

                <div className="text-center mb-4">
                  <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: user?.profile_image 
                      ? `url(${user.profile_image})` 
                      : `linear-gradient(135deg, #C69C6D 0%, #B8906A 100%)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    margin: '0 auto 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '36px',
                    fontWeight: '600',
                    border: '3px solid #fff',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)'
                  }}>
                    {!user?.profile_image && user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    onClick={triggerFileInput}
                  >
                    <i className="fas fa-camera me-2"></i>
                    Ubah Foto
                  </Button>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                </div>

                <Button
                  variant="primary"
                  onClick={() => setShowModal(true)}
                  style={{ height: '50px', width: '100%', marginBottom: '24px' }}
                >
                  <i className="fas fa-edit me-2"></i>
                  Edit Profile
                </Button>

                <hr />

                <div className="mb-4">
                  <h6 style={{ color: '#4B3F2F', marginBottom: '16px' }}>Pengaturan Notifikasi</h6>
                  <Form.Check
                    type="switch"
                    id="email-notifications"
                    label="Notifikasi Email"
                    defaultChecked
                    className="mb-2"
                  />
                  <Form.Check
                    type="switch"
                    id="push-notifications"
                    label="Notifikasi Push"
                    defaultChecked
                    className="mb-2"
                  />
                </div>

                <div className="mb-4">
                  <h6 style={{ color: '#4B3F2F', marginBottom: '16px' }}>Privasi</h6>
                  <Form.Check
                    type="switch"
                    id="public-profile"
                    label="Profil Publik"
                    defaultChecked
                    className="mb-2"
                  />
                  <Form.Check
                    type="switch"
                    id="show-location"
                    label="Tampilkan Lokasi"
                    defaultChecked
                    className="mb-2"
                  />
                </div>
              </Card.Body>
            </Card>

            <Card style={{ border: 'none', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)', marginTop: '24px' }}>
              <Card.Body style={{ padding: '24px' }}>
                <h6 style={{ color: '#DC3545', marginBottom: '16px' }}>
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  Danger Zone
                </h6>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>
                  Tindakan ini tidak dapat dibatalkan.
                </p>
                <Button variant="outline-danger" size="sm">
                  Hapus Akun
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <div className="sidebar">
              <h6 style={{ color: '#4B3F2F', marginBottom: '16px' }}>Info Akun</h6>
              <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.8' }}>
                <div className="d-flex justify-content-between mb-2">
                  <span>Member Sejak:</span>
                  <strong style={{ color: '#C69C6D' }}>2024</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Status:</span>
                  <strong style={{ color: '#28A745' }}>Aktif</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Total Review:</span>
                  <strong style={{ color: '#E84393' }}>{userStats.posts}</strong>
                </div>
              </div>
              
              <hr className="my-4" />
              
              <div className="d-grid gap-2">
                <Button variant="outline-danger" size="sm" onClick={onLogout}>
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Logout
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Edit Profile Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <div className="text-center mb-4">
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: previewImage 
                  ? `url(${previewImage})` 
                  : user?.profile_image 
                    ? `url(${user.profile_image})` 
                    : `linear-gradient(135deg, #C69C6D 0%, #B8906A 100%)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                margin: '0 auto 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
                fontWeight: '600'
              }}>
                {!previewImage && !user?.profile_image && user?.name?.charAt(0).toUpperCase()}
              </div>
              {previewImage && (
                <Button variant="outline-secondary" size="sm" onClick={resetImageSelection}>
                  Reset Foto
                </Button>
              )}
            </div>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: '500', color: '#4B3F2F' }}>
                Nama Lengkap
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{ height: '50px' }}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label style={{ fontWeight: '500', color: '#4B3F2F' }}>
                Email
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{ height: '50px' }}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button 
                variant="secondary" 
                onClick={() => setShowModal(false)}
                className="me-2"
              >
                Batal
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Settings; 