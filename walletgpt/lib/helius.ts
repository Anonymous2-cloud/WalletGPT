const API_KEY = process.env.HELIUS_API_KEY;

export async function getWalletTransactions(address: string) {
  const response = await fetch(
    `https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }

  const data = await response.json();

console.log(
  JSON.stringify(data[0], null, 2)
);

return data;
}