import React, { useState, useEffect } from 'react';
import { Card, Button, Form, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { databaseService } from '../services/databaseService';
import { icons } from '../utils/base64Icons';

const ReviewCard = ({ post, currentUser, onPostUpdate }) => {
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(post.user_liked || false);
  const [likeCount, setLikeCount] = useState(post.like_count || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [allComments, setAllComments] = useState([]);

  const handleLike = async () => {
    if (!currentUser) {
      alert('Anda harus login untuk memberikan like');
      return;
    }

    try {
      const response = await databaseService.likePost(post.id, currentUser.id);
      
      if (response.success) {
        setIsLiked(response.liked);
        setLikeCount(response.liked ? likeCount + 1 : likeCount - 1);
        
        // Notify parent to refresh posts if callback provided
        if (onPostUpdate) {
          onPostUpdate();
        }
      } else {
        console.error('Like error:', response.message);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Anda harus login untuk menambah komentar');
      return;
    }
    
    if (!newComment.trim()) return;
    
    setIsSubmittingComment(true);
    
    try {
      const response = await databaseService.addComment(post.id, currentUser.id, newComment.trim());
      
      if (response.success) {
        // Reload comments to get the updated list
        loadComments();
        setNewComment('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
    
    setIsSubmittingComment(false);
  };

  const loadComments = async () => {
    try {
      const response = await databaseService.getComments(post.id);
      
      if (response.success) {
        setAllComments(response.comments);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  useEffect(() => {
    if (showComments && allComments.length === 0) {
      loadComments();
    }
  }, [showComments]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <img
          key={i}
          src={i <= rating ? icons.star : icons.starEmpty}
          alt={`Star ${i}`}
          style={{ width: '20px', height: '20px', marginRight: '2px' }}
        />
      );
    }
    return stars;
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffTime = Math.abs(now - postDate);
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours} jam yang lalu`;
    } else {
      const diffDays = Math.ceil(diffHours / 24);
      return `${diffDays} hari yang lalu`;
    }
  };

  return (
    <div className="review-card">
      <div className="d-flex align-items-center mb-3">
        <div
          onClick={() => navigate(`/user/${post.user_id}`)}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: post.user_profile_image 
              ? `url(${post.user_profile_image})` 
              : `linear-gradient(135deg, #C69C6D 0%, #B8906A 100%)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '18px',
            fontWeight: '600',
            marginRight: '12px',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          {!post.user_profile_image && post.user_name?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-grow-1">
          <h6 
            className="mb-0" 
            style={{ 
              color: '#4B3F2F', 
              fontWeight: '600',
              cursor: 'pointer'
            }}
            onClick={() => navigate(`/user/${post.user_id}`)}
          >
            {post.user_name}
          </h6>
          <small style={{ color: '#666' }}>
            {formatTimeAgo(post.created_at)}
          </small>
        </div>
        <div style={{
          backgroundColor: '#C69C6D',
          color: 'white',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '500'
        }}>
          {post.category || 'Coffee Shop'}
        </div>
      </div>

      {post.image && (
        <div className="mb-3">
          <img
            src={post.image}
            alt={post.cafe_name}
            className="cafe-img"
            style={{ width: '100%', height: '350px', objectFit: 'cover', borderRadius: '12px' }}
          />
        </div>
      )}

      <div className="mb-3">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h5 style={{ color: '#4B3F2F', fontWeight: '600', margin: '0' }}>
            {post.cafe_name}
          </h5>
          <div className="d-flex align-items-center">
            {renderStars(post.rating)}
            <span style={{ color: '#666', fontSize: '14px', marginLeft: '8px' }}>
              ({post.rating}/5)
            </span>
          </div>
        </div>

        {/* Display aggregated rating if there are multiple reviews */}
        {post.total_reviews > 1 && (
          <div className="mb-2 p-2" style={{ backgroundColor: '#F8F9FA', borderRadius: '8px' }}>
            <div className="d-flex align-items-center">
              <img src={icons.chartLine} alt="Chart" style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              <span style={{ fontSize: '14px', color: '#666' }}>
                Rating Rata-rata: <strong style={{ color: '#C69C6D' }}>{post.avg_rating}/5</strong> dari {post.total_reviews} review
              </span>
            </div>
          </div>
        )}
        
        <div className="d-flex align-items-center mb-2">
          <img src={icons.mapMarker} alt="Location" style={{ width: '16px', height: '16px', marginRight: '8px' }} />
          <small style={{ color: '#666' }}>{post.location}</small>
        </div>

        <p style={{ color: '#4B3F2F', lineHeight: '1.6', marginBottom: '16px' }}>
          {post.description}
        </p>
      </div>

      <div className="d-flex align-items-center justify-content-between mb-3" style={{ borderTop: '1px solid #F0F0F0', paddingTop: '16px' }}>
        <div className="d-flex align-items-center">
          <button
            className={`like-btn ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              marginRight: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <img 
              src={isLiked ? icons.heart : icons.heartEmpty} 
              alt="Like" 
              style={{ 
                width: '20px', 
                height: '20px',
                filter: isLiked ? 'none' : 'none',
                marginRight: '8px'
              }} 
            />
            <span style={{ fontSize: '14px', color: isLiked ? '#FF6B6B' : '#666' }}>{likeCount}</span>
          </button>
          
          <button
            className="comment-btn"
            onClick={() => setShowComments(!showComments)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              marginRight: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <img src={icons.comment} alt="Comment" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
            <span style={{ fontSize: '14px', color: '#666' }}>
              {post.comment_count || 0}
            </span>
          </button>
          
          <button
            className="share-btn"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              color: '#666',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <i className="far fa-share-square"></i>
            <span style={{ fontSize: '14px', marginLeft: '8px' }}>Share</span>
          </button>
        </div>
      </div>

      {showComments && (
        <div style={{ backgroundColor: '#F8F9FA', padding: '16px', borderRadius: '12px', marginTop: '16px' }}>
          <Form onSubmit={handleComment} className="mb-3">
            <div className="d-flex">
              <Form.Control
                type="text"
                placeholder="Tulis komentar..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                style={{ marginRight: '8px' }}
                disabled={isSubmittingComment}
              />
              <Button 
                variant="primary" 
                type="submit" 
                size="sm"
                disabled={isSubmittingComment || !newComment.trim()}
              >
                {isSubmittingComment ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </Form>
          
          {allComments && allComments.length > 0 ? (
            <ListGroup variant="flush">
              {allComments.map((comment, index) => (
                <ListGroup.Item key={index} style={{ backgroundColor: 'transparent', padding: '8px 0', border: 'none' }}>
                  <div className="d-flex align-items-start">
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: comment.profile_image 
                          ? `url(${comment.profile_image})` 
                          : `linear-gradient(135deg, #C69C6D 0%, #B8906A 100%)`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: '600',
                        marginRight: '8px',
                        flexShrink: 0
                      }}
                    >
                      {!comment.profile_image && comment.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-grow-1">
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#4B3F2F' }}>
                        {comment.name}
                      </div>
                      <div style={{ fontSize: '14px', color: '#333', marginTop: '2px' }}>
                        {comment.content}
                      </div>
                      <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                        {formatTimeAgo(comment.created_at)}
                      </div>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
              Belum ada komentar. Jadilah yang pertama!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewCard; 