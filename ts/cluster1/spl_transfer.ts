import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "../wba-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("9yhZSzPW9ZhTisLYvBGtrfjt5nLp24KXDJEnBYfjE34D");

// Recipient address
const to = new PublicKey("77J6PRPjXUD2TsjYTQt35gwtiU3Xa8uMFjtoKT55JU3r");

(async () => {
  try {
    // Get the token account of the fromWallet address, and if it does not exist, create it
    const from_ata = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      keypair.publicKey
    );
    console.log("from ata: ", from_ata.address.toBase58());

    // Get the token account of the toWallet address, and if it does not exist, create it
    const to_ata = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      to
    );
    console.log("to_ata address: ", to_ata.address.toBase58());

    // Transfer the new token to the "toTokenAccount" we just created
    const result = await transfer(
      connection,
      keypair,
      from_ata.address,
      to_ata.address,
      keypair.publicKey,
      1 * LAMPORTS_PER_SOL
    );

    console.log("your transfer id: ", result);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();