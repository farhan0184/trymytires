

import ProductList from '@/components/site/product/productList';
import ProductListSkeleton from '@/components/skeletons/productSkeleton';
import React, { Suspense } from 'react';


export default function ProductsPage() {
  return (
    <div className="container mx-auto my-16">
      <Suspense fallback={<ProductListSkeleton/>}>
        <ProductList />
      </Suspense>
    </div>
  );
}