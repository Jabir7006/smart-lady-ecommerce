import { Button } from '@mui/material';
import NewsLetterImage from '../../../assets/images/newsLetter.webp';
import { IoMailOutline } from 'react-icons/io5';

const NewsLetter = () => {
  return (
    <section className='newsLetterSection mt-3 mb-3 d-flex align-items-center'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-6'>
            <p className='text-white mb-1'>
              Subscribe to our newsletter and get 10% off your first purchase
            </p>
            <h3>Join our newsletter and get...</h3>
            <p className='text-light'>
              Join our email subscription now to get <br /> updates on sales and
              coupons.
            </p>

            <form>
              <IoMailOutline />
              <input type='text' placeholder='Enter your email' />
              <Button>Subscribe</Button>
            </form>
          </div>
          <div className='col-md-6'>
            <img src={NewsLetterImage} alt='NewsLetter' />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsLetter;
