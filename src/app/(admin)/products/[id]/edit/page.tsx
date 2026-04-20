import EditProduct from '@/components/product/EditProduct';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Edit Product - Dashboard | Feel Safe",
  description: "Edit product details",
};

const Page = () => {
  return (
    <>
      <EditProduct />
    </>
  );
};

export default Page;

