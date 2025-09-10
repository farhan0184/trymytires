'use client'
import { fetchAdminProducts } from '@/app/helper/backend';
import { flattenObjectNames } from '@/app/helper/helper';
import { useFetch } from '@/app/helper/hooks'
import ProductForm from '@/components/admin/productForm';

import { useParams } from 'next/navigation';
import React from 'react'

export default function UpdateProductPage() {
    const { _id } = useParams()
    const [data, getData, { loading }] = useFetch(fetchAdminProducts, { _id });

    // const validateData = flattenObjectNames(data); 

    if (loading) return <div>Loading...</div>;
    return (
        <div>
            <ProductForm
                defaultValues={data}
            />
        </div>
    )
}
