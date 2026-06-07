export function extractEvents(
  transactions: any[]
) {
  return transactions
    .slice(0, 20)
    .map((tx) => ({
      type: tx.type,
      source: tx.source,
    }));
}