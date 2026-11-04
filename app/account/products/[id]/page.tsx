import { AccountProductDetail } from '@/components/account/ProductDetail'

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <AccountProductDetail productId={id} />
}
