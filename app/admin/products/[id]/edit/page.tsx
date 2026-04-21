interface AdminProductEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminProductEditPage({ params }: AdminProductEditPageProps) {
  const { id } = await params;
  return <main className="p-6">관리자 제품 수정 페이지 준비중 (ID: {id})</main>;
}
