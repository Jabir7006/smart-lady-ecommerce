const HeaderWarn = ({ message }) => {
  return (
    <div className='top-strip bg-purple'>
      <div className='container'>
        <p className='mb-0 mt-0 text-center delivery-message'>
          <span className='delivery-icon'>🚚</span>
          <span className='delivery-text'>
            {message || 'All Bangladesh Delivery Only 100 TK'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default HeaderWarn;
