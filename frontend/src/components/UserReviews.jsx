import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Star, User, PlusCircle, X } from 'lucide-react';

export const UserReviews = ({ user }) => {
  const [reviews, setReviews] = useState([
    { id: 1, user_name: 'john', rating: 5, comment: 'good' },
    { id: 2, user_name: 'richa', rating: 4, comment: 'good' }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadReviews = () => {
    api.getReviews().then(res => {
      if (res.reviews && res.reviews.length > 0) {
        setReviews(res.reviews);
      }
    }).catch(err => console.error(err));
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to submit a review.');
      return;
    }
    if (!comment.trim()) {
      alert('Please enter your review text.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.submitReview(rating, comment);
      if (res.message) {
        alert('Thank you for your review!');
        setShowModal(false);
        setComment('');
        loadReviews();
      } else {
        alert(res.error || 'Failed to submit review');
      }
    } catch (err) {
      alert('Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section 
      id="reviews"
      style={{
        backgroundColor: '#f0f7ff',
        padding: '80px 20px',
        textAlign: 'center'
      }}
    >
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px', flexWrap: 'wrap', gap: '20px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#00296b', margin: 0 }}>
            User Reviews
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
            style={{ backgroundColor: '#0077b6' }}
          >
            <PlusCircle size={18} /> ADD YOUR REVIEW
          </button>
        </div>

        {/* Reviews Grid matching 06_user_reviews_section.png */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '30px'
        }}>
          {reviews.map((rev) => (
            <div 
              key={rev.id}
              className="card"
              style={{
                padding: '32px 24px',
                textAlign: 'center',
                backgroundColor: 'white',
                borderRadius: '16px'
              }}
            >
              {/* User Circle Avatar matching screenshot 6 */}
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                border: '3px solid #0077b6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                backgroundColor: '#e0f2fe'
              }}>
                <User size={36} color="#0077b6" />
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0077b6', marginBottom: '8px' }}>
                {rev.user_name}
              </h3>

              {/* Star Rating */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '12px' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star 
                    key={s} 
                    size={18} 
                    fill={s <= rev.rating ? '#ffb703' : 'none'} 
                    color={s <= rev.rating ? '#ffb703' : '#cbd5e1'} 
                  />
                ))}
              </div>

              <p style={{ fontSize: '0.95rem', color: '#475569' }}>
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>

        {/* Add Review Modal matching 05_add_review_form.png */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '36px', maxWidth: '480px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0077b6' }}>
                  Add your Review
                </h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={24} color="#64748b" />
                </button>
              </div>

              <form onSubmit={handleSubmitReview}>
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={user ? (user.full_name || user.email) : ''} 
                    placeholder="Your Name"
                    disabled
                  />
                </div>

                {/* Interactive Star Picker */}
                <div className="form-group" style={{ textAlign: 'center', margin: '20px 0' }}>
                  <label className="form-label">Rating</label>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star 
                        key={s} 
                        size={28} 
                        onClick={() => setRating(s)}
                        fill={s <= rating ? '#ffb703' : 'none'} 
                        color={s <= rating ? '#ffb703' : '#cbd5e1'} 
                      />
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Your Review</label>
                  <textarea 
                    className="form-control" 
                    rows={4} 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your experience..."
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="btn-primary" 
                  style={{ width: '100%', marginTop: '10px' }}
                >
                  {submitting ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
