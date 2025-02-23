import { BiSolidDiscount } from 'react-icons/bi';
import { CiBadgeDollar } from 'react-icons/ci';
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa6';
import { LuShirt } from 'react-icons/lu';
import { TbTruck } from 'react-icons/tb';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className='container'>
        <div className='topInfo row'>
          <div className='col d-flex align-items-center '>
            <span>
              <LuShirt />
            </span>
            <span className='ml-2'> Everyday fresh products</span>
          </div>{' '}
          <div className='col d-flex align-items-center'>
            <span>
              <TbTruck />
            </span>
            <span className='ml-2'>Free delivery for order over $70</span>
          </div>
          <div className='col d-flex align-items-center'>
            <span>
              <BiSolidDiscount />
            </span>
            <span className='ml-2'>Daily Mega Discounts</span>
          </div>
          <div className='col d-flex align-items-center'>
            <span>
              <CiBadgeDollar />
            </span>
            <span className='ml-2'>Best price on the market</span>
          </div>
        </div>
        <div className='row mt-5 linksWrap'>
          <div className='col'>
            <h5>FRUIT & VEGETABLES</h5>
            <ul>
              <li>
                <Link to='#'>Fresh Vegetables</Link>
              </li>
              <li>
                <Link to='#'>Herbs & Seasonings</Link>
              </li>
              <li>
                <Link to='#'>Fresh Fruits</Link>
              </li>
              <li>
                <Link to='#'>Cuts & Sprouts</Link>
              </li>
              <li>
                <Link to='#'>Exotic Fruits & Veggies</Link>
              </li>
              <li>
                <Link to='#'>Packaged Produce</Link>
              </li>
              <li>
                <Link to='#'>Party Trays</Link>
              </li>
            </ul>
          </div>{' '}
          <div className='col'>
            <h5>FRUIT & VEGETABLES</h5>
            <ul>
              <li>
                <Link to='#'>Fresh Vegetables</Link>
              </li>
              <li>
                <Link to='#'>Herbs & Seasonings</Link>
              </li>
              <li>
                <Link to='#'>Fresh Fruits</Link>
              </li>
              <li>
                <Link to='#'>Cuts & Sprouts</Link>
              </li>
              <li>
                <Link to='#'>Exotic Fruits & Veggies</Link>
              </li>
              <li>
                <Link to='#'>Packaged Produce</Link>
              </li>
              <li>
                <Link to='#'>Party Trays</Link>
              </li>
            </ul>
          </div>{' '}
          <div className='col'>
            <h5>FRUIT & VEGETABLES</h5>
            <ul>
              <li>
                <Link to='#'>Fresh Vegetables</Link>
              </li>
              <li>
                <Link to='#'>Herbs & Seasonings</Link>
              </li>
              <li>
                <Link to='#'>Fresh Fruits</Link>
              </li>
              <li>
                <Link to='#'>Cuts & Sprouts</Link>
              </li>
              <li>
                <Link to='#'>Exotic Fruits & Veggies</Link>
              </li>
              <li>
                <Link to='#'>Packaged Produce</Link>
              </li>
              <li>
                <Link to='#'>Party Trays</Link>
              </li>
            </ul>
          </div>{' '}
          <div className='col'>
            <h5>FRUIT & VEGETABLES</h5>
            <ul>
              <li>
                <a href='mailto:smartlady7005@gmail.com'>
                  smartlady7005@gmail.com
                </a>
              </li>
              <li>
                <Link to='#'>Herbs & Seasonings</Link>
              </li>
              <li>
                <Link to='#'>Fresh Fruits</Link>
              </li>
              <li>
                <Link to='#'>Cuts & Sprouts</Link>
              </li>
              <li>
                <Link to='#'>Exotic Fruits & Veggies</Link>
              </li>
              <li>
                <Link to='#'>Packaged Produce</Link>
              </li>
              <li>
                <Link to='#'>Party Trays</Link>
              </li>
            </ul>
          </div>{' '}
        </div>

        <div className='copyright d-flex'>
          <p className='mb-0 d-flex align-items-center'>
            Copyright 2025.Smart Lady All rights reserved
          </p>
          <ul className='list list-inline ml-auto mb-8'>
            <li className='list-inline-item'>
              <a href='https://www.facebook.com/smartladyclothing/'>
                <FaFacebookF />
              </a>
            </li>
            <li className='list-inline-item'>
              <a
                href='https://www.youtube.com/@SmartLady-sg9jy
'
              >
                <FaYoutube />
              </a>
            </li>
            <li className='list-inline-item'>
              <Link to='#'>
                <FaInstagram />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
