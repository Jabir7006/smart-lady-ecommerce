import { Button } from '@mui/material';
import NewsLetterImage from '../../../assets/images/newsLetter.webp';
import { IoMailOutline } from 'react-icons/io5';
import { useState } from 'react';

const NewsLetter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email address' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    // Simulate API call
    setTimeout(() => {
      setMessage({ type: 'success', text: 'Thank you for subscribing!' });
      setEmail('');
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <section className='newsLetterSection'>
      <div className='newsletter-container'>
        <div className='newsletter-content'>
          <div className='newsletter-text'>
            <span className='newsletter-badge'>Newsletter</span>
            <h2>Subscribe to our newsletter</h2>
            <p className='newsletter-description'>
              Get 10% off your first purchase and stay updated with our latest
              offers, products, and fashion trends.
            </p>

            <form onSubmit={handleSubmit} className='newsletter-form'>
              <div className='input-wrapper'>
                <IoMailOutline className='mail-icon' />
                <input
                  type='email'
                  placeholder='Enter your email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <Button
                type='submit'
                className='subscribe-btn'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>

            {message.text && (
              <div className={`message ${message.type}`}>{message.text}</div>
            )}

            <div className='newsletter-features'>
              <div className='feature'>
                <span>✓</span> Exclusive Offers
              </div>
              <div className='feature'>
                <span>✓</span> Free Fashion Tips
              </div>
              <div className='feature'>
                <span>✓</span> Latest Updates
              </div>
            </div>
          </div>

          <div className='newsletter-image'>
            <img
              src={NewsLetterImage}
              alt='Subscribe to Newsletter'
              loading='lazy'
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsLetter;
