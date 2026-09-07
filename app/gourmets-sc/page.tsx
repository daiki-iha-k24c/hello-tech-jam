import { Shop } from "@/types";
 
async function fetchShops(keyword?: string): Promise<Shop[]> {
  // 環境変数が設定されているかチェック
  if (!process.env.NEXT_PUBLIC_API_HOST) {
    console.error("環境変数 NEXT_PUBLIC_API_HOST が設定されていません");
    return [];
  }
 
  const query = new URLSearchParams();
  if (keyword) query.set("keyword", keyword);
 
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/shops?${query.toString()}`
    );
    if (!res.ok) {
      console.error(`Failed to fetch shops: ${res.status} ${res.statusText}`);
      return [];
    }
    return await res.json();
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Fetch error:", errorMessage);
    return [];
  }
}
 
const Shops = ({ shops }: { shops: Shop[] }) => {
  return (
    <ul>
      {shops.map((shop) => (
        <li key={shop.id}>{shop.name}</li>
      ))}
    </ul>
  );
};
 
export default async function GourmetsPage({
  searchParams,
}: {
  searchParams: Promise<{ keyword?: string }>;
}) {
  const { keyword } = await searchParams;
  const shops = await fetchShops(keyword);
 
  return <Shops shops={shops} />;
}