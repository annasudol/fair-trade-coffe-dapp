import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { FairTradeCoffee } from '../target/types/fair_trade_coffee';

describe('fairTradeCoffee', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.FairTradeCoffee as Program<FairTradeCoffee>;

  it('Is initialized!', async () => {
    // Add your test here.
    const tx = await program.rpc.initialize({});
    console.log("Your transaction signature", tx);
  });
});
