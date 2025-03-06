import { Skeleton } from '@mui/material';
import { css } from '@emotion/react';

const ProductCardSkeleton = () => {
    return (
        <div className="productItem" css={css`padding: 16px;`}>
            <Skeleton variant="rectangular" width="100%" height={150} />
            <Skeleton variant="text" width="80%" height={20} css={css`margin-top: 8px;`} />
            <Skeleton variant="text" width="60%" height={20} css={css`margin-top: 4px;`} />
            <Skeleton variant="text" width="40%" height={20} css={css`margin-top: 4px;`} />
            <Skeleton variant="rectangular" width="100%" height={36} css={css`margin-top: 8px;`} />
        </div>
    );
};

export default ProductCardSkeleton; 