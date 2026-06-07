const HELIUS_API_KEY =
  process.env.HELIUS_API_KEY;

export async function getTokenMetadata(
  mint: string
) {
  try {
    const response = await fetch(
      `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "1",
          method: "getAsset",
          params: {
            id: mint,
          },
        }),
      }
    );

    const data = await response.json();

    return {
      name:
        data.result?.content?.metadata
          ?.name || "Unknown Token",

      symbol:
        data.result?.content?.metadata
          ?.symbol || "UNKNOWN",
    };
  } catch (error) {
    console.error(error);

    return {
      name: "Unknown Token",
      symbol: "UNKNOWN",
    };
  }
}