import { NextResponse } from "next/server";
import { getWalletTransactions } from "@/lib/helius";
import { generateWalletSummary } from "@/lib/summarize";

export async function POST(req: Request) {
  try {
    console.log("STEP 1");

    const { address } = await req.json();

    console.log("STEP 2", address);

    const transactions =
      await getWalletTransactions(address);

    console.log(
      "STEP 3",
      transactions.length
    );
      const summary =
  await generateWalletSummary(
    address,
    transactions
  );

const cleanSummary = summary
  ?.replace(/\*\*/g, "")
  ?.replace(/#/g, "");

console.log("STEP 4");

return NextResponse.json({
  summary: cleanSummary,
});
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: String(error),
      },
      {
        status: 500,
      }
    );
  }
}