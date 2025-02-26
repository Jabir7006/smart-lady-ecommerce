import { Button, Rating, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';

const ProductDetailsTabs = ({ product }) => {
  const [activeTabs, setActiveTabs] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <div className='detailsPageTabs'>
      <div className='customTabs p-3'>
        <ul className='list list-inline'>
          <li className='list-inline-item'>
            <Button
              className={`${activeTabs === 0 && 'activeTab'}`}
              onClick={() => setActiveTabs(0)}
            >
              Description
            </Button>
          </li>
          {/* <li className='list-inline-item'>
            <Button
              className={`${activeTabs === 1 && 'activeTab'}`}
              onClick={() => setActiveTabs(1)}
            >
              Additional info
            </Button>
          </li> */}
          <li className='list-inline-item'>
            <Button
              className={`${activeTabs === 1 && 'activeTab'}`}
              onClick={() => setActiveTabs(1)}
            >
              Reviews (3)
            </Button>
          </li>
        </ul>

        {activeTabs === 0 && (
          <div className='tabContent'>
            <div dangerouslySetInnerHTML={{ __html: product?.description }} />
          </div>
        )}
{/* 
        {activeTabs === 1 && (
          <div className='tabContent'>
            <div className='table-responsive'>
              <table className='table table-bordered'>
                <tbody>
                  <tr className='stand-up'>
                    <th>Stand Up</th>
                    <td>
                      <p>35"L x 24"W x 37-45"H(front to back wheel)</p>
                    </td>
                  </tr>
                  <tr className='folded-wo-wheels'>
                    <th>Folded (w/o wheels)</th>
                    <td>
                      <p>32.5"L x 18.5"W x 16.5"W</p>
                    </td>
                  </tr>
                  <tr className='folded-w-wheels'>
                    <th>Folded (w/ wheels)</th>
                    <td>
                      <p>32.5"L x 24"W x 18.5"W</p>
                    </td>
                  </tr>
                  <tr className='door-pass-through'>
                    <th>Door Pass Through</th>
                    <td>
                      <p>24</p>
                    </td>
                  </tr>
                  <tr className='frame'>
                    <th>Frame</th>
                    <td>
                      <p>Aluminium</p>
                    </td>
                  </tr>
                  <tr className='weight-wo-wheels'>
                    <th>Weight (w/o wheels)</th>
                    <td>
                      <p>20 LBS</p>
                    </td>
                  </tr>
                  <tr className='weight-capacity'>
                    <th>Weight Capacity</th>
                    <td>
                      <p>60 LBS</p>
                    </td>
                  </tr>
                  <tr className='width'>
                    <th>Width</th>
                    <td>
                      <p>24"</p>
                    </td>
                  </tr>
                  <tr className='handle-height-ground-to-handle'>
                    <th>Handle height (ground to handle)</th>
                    <td>
                      <p>37-45"</p>
                    </td>
                  </tr>
                  <tr className='wheels'>
                    <th>Wheels</th>
                    <td>
                      <p>12" air / wide track slick tread</p>
                    </td>
                  </tr>
                  <tr className='seat-back-height'>
                    <th>Seat Back Height</th>
                    <td>
                      <p>21.5"</p>
                    </td>
                  </tr>
                  <tr className='head-room-inside-canopy'>
                    <th>Head room (inside canopy)</th>
                    <td>
                      <p>25"</p>
                    </td>
                  </tr>
                  <tr className='pa_color'>
                    <th>Color</th>
                    <td>
                      <p>Back, Blue, Red, White</p>
                    </td>
                  </tr>
                  <tr className='pa_size'>
                    <th>Size</th>
                    <td>
                      <p>M, S</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )} */}

        {activeTabs === 1 && (
          <div className='tabContent'>
            <div className='row'>
              <div className={`${isMobile ? 'col-12' : 'col-md-8'}`}>
                <h3 className='reviews-title'>Customer questions & reviews</h3>

                <div className='reviewsCard'>
                  <div className='d-flex'>
                    <div className='image'>
                      <div className='rounded-circle'>
                        <img
                          src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-xnGLZJFli6FRyXSlm8-QnpJb9hh30HffEA&s'
                          alt='user image'
                          className='rounded-circle'
                        />
                      </div>
                      <span className='text-g d-block text-center font-weight-bold mt-2'>
                        Jabir Ahmad
                      </span>
                    </div>

                    <div className='info pl-3'>
                      <div className='d-flex align-items-center justify-content-between w-100 flex-wrap'>
                        <h5 className='text-dark mb-2'>19/02/2025</h5>
                        <Rating
                          name='half-rating-read'
                          value={4.5}
                          precision={0.5}
                          readOnly
                          size={isMobile ? 'small' : 'medium'}
                        />
                      </div>
                      <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Expedita aliquid similique dolorem doloremque laudantium
                        quos cupiditate quaerat esse perferendis, harum nostrum
                        qui tenetur, molestiae temporibus
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='mt-4'>
              <form className='reviewForm'>
                <h4>Add a review</h4>
                <div className='form-group'>
                  <textarea
                    className='form-control'
                    placeholder='Write a Review'
                    name='review'
                    rows={isMobile ? 3 : 4}
                  ></textarea>
                </div>
                <div className='row'>
                  <div className={`${isMobile ? 'col-12' : 'col-md-6'} mb-3`}>
                    <div className='form-group'>
                      <input
                        type='text'
                        className='form-control'
                        placeholder='Name'
                        name='userName'
                      />
                    </div>
                  </div>

                  <div className={`${isMobile ? 'col-12' : 'col-md-6'} mb-3`}>
                    <div className='form-group'>
                      <Rating
                        name='rating'
                        value={4.5}
                        precision={0.5}
                        size={isMobile ? 'medium' : 'large'}
                      />
                    </div>
                  </div>
                </div>
                <div className='form-group'>
                  <Button
                    type='submit'
                    className='btn-blue btn-lg btn-big btn-round'
                    fullWidth={isMobile}
                  >
                    Submit Review
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsTabs;
