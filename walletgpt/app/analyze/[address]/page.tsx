import AnalysisClient from "./AnalysisClient";

export default async function Page({
  params,
}: {
  params: Promise<{
    address: string;
  }>;
}) {
  const { address } = await params;

  return (
    <AnalysisClient
      address={address}
    />
  );
}