import { openai } from "./openai";
import { extractEvents } from "./parser";
import { getTokenMetadata } from "./token";
export async function generateWalletSummary(
  address: string,
  transactions: any[]
) {
const trimmed = transactions.slice(0, 5);

const simplifiedTransactions =
  await Promise.all(
    trimmed.map(async (tx) => {
      const tokenTransfers =
        await Promise.all(
          (tx.tokenTransfers || []).map(
            async (transfer: any) => {
              const metadata =
                await getTokenMetadata(
                  transfer.mint
                );

              return {
                token:
                  metadata.name,
                symbol:
                  metadata.symbol,
                mint:
                  transfer.mint,
                amount:
                  transfer.tokenAmount,
              };
            }
          )
        );

      return {
        type: tx.type,
        source: tx.source,
        timestamp: tx.timestamp,
        description:
          tx.description,
        tokenTransfers,
      };
    })
  );

const prompt = `
You are WalletGPT.

Analyze this Solana wallet.

Transactions:

${JSON.stringify(
  simplifiedTransactions,
  null,
  2
)}

Requirements:

- Mention token names.
- Mention token symbols.
- Mention contract addresses when relevant.
- Explain activity in simple language.
- Keep the response concise.
- Do not use markdown.
- Do not use bold text.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an expert Solana wallet analyst.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return completion.choices[0].message.content;
}