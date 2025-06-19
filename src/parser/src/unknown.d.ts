import { PublicKey, TransactionInstruction } from '@solana/web3.js';

interface TxContext {
    signature: string;
    slot: number;
    blocktime: number;
    err: any;
    fee: number;
    enhancedDescription?: string;
    enhancedType?: string;
    enhancedSource?: string;
    enhancedFeePayer?: string;
    owner: string;
    allBalanceChanges: BalanceChange[];
    allTokenBalanceChanges: TokenBalanceChange[];
    ownerBalanceChanges: BalanceChange;
    ownerTokenBalanceChanges: TokenBalanceChange[];
    signers: PublicKey[];
}

interface BalanceChange {
    pubkey: string;
    isOwner: boolean;
    isSigner: boolean;
    preBalance: number;
    postBalance: number;
    changeBalance: number;
}

interface TokenBalanceChange {
    isOwner: boolean;
    isSigner: boolean;
    accountIndex: number;
    mint: string;
    preBalance: number;
    postBalance: number;
    changeBalance: number;
}

interface ParsedInstruction {
    program: string;
    programId: string;
    type?: string;
    error?: string;
}

export function parseUnknownInstruction(
    txContext: TxContext,
    disc: number | Buffer,
    instruction: TransactionInstruction,
    ix: Buffer,
    program?: string,
    programId?: PublicKey
): Promise<ParsedInstruction>;