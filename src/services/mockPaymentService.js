// Sandbox payment simulator. No real network calls or money movement — it exists
// purely to exercise the JazzCash / EasyPaisa / Card checkout UX during the prototype.

const METHODS = ["JAZZCASH", "EASYPAISA", "CARD"];
const NAYAPAY_SETTLEMENT_ACCOUNT = "NP-MERAWARDROBE-00417";

function randomTransactionId() {
  const digits = Math.floor(100000 + Math.random() * 900000);
  return `NYP-${digits}`;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function logSettlement(payload) {
  // Stand-in for a settlement webhook landing in the NayaPay virtual account ledger.
  console.log("[mockPaymentService] settlement →", NAYAPAY_SETTLEMENT_ACCOUNT, JSON.stringify(payload));
}

/**
 * Simulates a JazzCash / EasyPaisa / Card transaction handshake.
 * @param {{ method: 'JAZZCASH'|'EASYPAISA'|'CARD', amount: number, accountNumber: string }} params
 * @returns {Promise<{status: 'SUCCESS'|'FAILED', transactionId?: string, message?: string}>}
 */
export async function processPayment({ method, amount, accountNumber }) {
  if (!METHODS.includes(method)) {
    throw new Error(`Unsupported payment method: ${method}`);
  }

  const normalized = (accountNumber || "").replace(/\s+/g, "");
  const isFailureCase = normalized.endsWith("0000");

  if (isFailureCase) {
    await delay(2000);
    const payload = {
      status: "FAILED",
      message: "Insufficient funds in wallet",
      method,
      amount,
    };
    logSettlement(payload);
    return payload;
  }

  await delay(1200);
  const payload = {
    status: "SUCCESS",
    transactionId: randomTransactionId(),
    method,
    amount,
    settlementAccount: NAYAPAY_SETTLEMENT_ACCOUNT,
    timestamp: new Date().toISOString(),
  };
  logSettlement(payload);
  return payload;
}

/** User-initiated cancellation — resolves locally, no handshake attempted. */
export function cancelPayment() {
  const payload = { status: "CANCELLED", message: "Transaction user aborted" };
  logSettlement(payload);
  return payload;
}

export const PAYMENT_METHODS = METHODS;
