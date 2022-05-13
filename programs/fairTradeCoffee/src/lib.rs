use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;
declare_id!("ALkFKN5djQHHsJ5SYAG9KkUYDDgryLXpG79d6t2e8GPe");

#[program]
pub mod fair_trade_coffee {
    use super::*;
    pub fn init_trade(ctx: Context<InitTrade>) -> ProgramResult {
        let trade_account = &mut ctx.accounts.trade_account;
        let genesis_trade_account = &mut ctx.accounts.genesis_trade_account;
        let authority = &mut ctx.accounts.authority;

        trade_account.authority = authority.key();
        trade_account.current_id = genesis_trade_account.key();

        Ok(())
    }

    pub fn create_user(ctx: Context<CreateAccount>, role: String) -> ProgramResult {
        let user_account = &mut ctx.accounts.user_account;
        let authority = &mut ctx.accounts.authority;
        
        user_account.authority = authority.key();

        let user_role = match role.to_lowercase().as_str()  {
            "consumer" => AccountType::Consumer,
            "farmer" => AccountType::Farmer,
            "retailer" => AccountType::Retailer,
            _ => panic!("UserRoleDoNotMatch")
        };

        user_account.account_type = user_role;
        Ok(())
    }

    pub fn harvest_coffee(ctx: Context<RegisterTrade>, role: String) -> anchor_lang::Result<()> {
        if role.to_lowercase().as_str() != "farmer" {
            return Err(error!(ErrorCode::OnlyFarmerCanHarvestCoffee));
        };
        let trade_account = &mut ctx.accounts.trade_account;
        let product_account = &mut ctx.accounts.product_account;
        let user_account = &mut ctx.accounts.user_account;
        let authority = &mut ctx.accounts.authority;

        product_account.status = ProductStatus::Harvested;
        product_account.user =  user_account.key();
        product_account.authority = authority.key();
        product_account.pre_id = trade_account.current_id;
        trade_account.current_id = product_account.key();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitTrade<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 32 + 32 + 32)]
    pub trade_account: Account<'info, TradeState>,
    #[account(init, payer = authority, space = 8 + 32 + 32 + 32 + 32 + 8)]
    pub genesis_trade_account: Account<'info, ProductState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateAccount<'info> {
    #[account(init, payer = authority, space = 300)]
    pub user_account: Account<'info, UserState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct RegisterTrade<'info> {
    #[account(init, payer = authority, space = 8 + 50 + 500 + 32 + 32 + 32)]
    pub product_account: Account<'info, ProductState>,
    #[account(mut, has_one = authority)]
    pub user_account: Account<'info, UserState>,
    #[account(mut)]
    pub trade_account: Account<'info, TradeState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct TradeState {
    pub current_id: Pubkey,
    pub authority: Pubkey,
}

#[account]
pub struct ProductState {
    pub status: ProductStatus,
    pub authority: Pubkey,
    pub pre_id: Pubkey,
    pub user: Pubkey,
}

#[derive(AnchorDeserialize, AnchorSerialize, Clone, PartialEq, Eq)]
pub enum ProductStatus {
    Harvested, // Farmer 1
    Processed, // Farmer 2
    ForSale, // Retailer 3
    Sold, // Retailer 4
    Packed, // Retailer 5
    Purchased, //customer 6
    Shipped, //Retailer 7
    Received, //customer 8
}

#[account]
pub struct UserState {
    pub account_type: AccountType,
    pub authority: Pubkey
}

#[derive(AnchorDeserialize, AnchorSerialize, Clone, PartialEq, Eq)]
pub enum AccountType {
    Consumer,
    Farmer,
    Retailer,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Wrong user role, only farmer can harvest coffee")]
    OnlyFarmerCanHarvestCoffee,
}