#![no_std]
mod test;
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Symbol, symbol_short};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Wish {
    pub creator: Address,
    pub goal: i128,
    pub pledged: i128,
    pub deadline: u64,
    pub claimed: bool,
}

#[contract]
pub struct WishPoolContract;

#[contractimpl]
impl WishPoolContract {
    /// Initialize a new wish campaign
    pub fn create_wish(env: Env, creator: Address, id: Symbol, goal: i128, deadline: u64) {
        creator.require_auth();
        
        let wish = Wish {
            creator: creator.clone(),
            goal,
            pledged: 0,
            deadline,
            claimed: false,
        };
        
        env.storage().instance().set(&id, &wish);
        
        // Emit an event
        env.events().publish((symbol_short!("wish_crt"), id), creator);
    }

    /// Pledge funds to a wish
    pub fn pledge(env: Env, contributor: Address, id: Symbol, amount: i128) {
        contributor.require_auth();
        
        let mut wish: Wish = env.storage().instance().get(&id).expect("Wish not found");
        
        // In a real production contract, we would use the token SDK to transfer XLM/tokens
        // from the contributor to this contract address.
        
        wish.pledged += amount;
        env.storage().instance().set(&id, &wish);
        
        // Record contribution per user for potential refunds
        let key = (symbol_short!("pledges"), id.clone(), contributor.clone());
        let current_contrib: i128 = env.storage().instance().get(&key).unwrap_or(0);
        env.storage().instance().set(&key, &(current_contrib + amount));

        env.events().publish((symbol_short!("pledged"), id), amount);
    }

    /// Get details of a wish
    pub fn get_wish(env: Env, id: Symbol) -> Wish {
        env.storage().instance().get(&id).expect("Wish not found")
    }

    /// Get how much a specific user pledged to a wish
    pub fn get_user_pledge(env: Env, id: Symbol, user: Address) -> i128 {
        let key = (symbol_short!("pledges"), id, user);
        env.storage().instance().get(&key).unwrap_or(0)
    }

    /// Withdraw funds if goal is met
    pub fn withdraw(env: Env, creator: Address, id: Symbol) {
        creator.require_auth();
        
        let mut wish: Wish = env.storage().instance().get(&id).expect("Wish not found");
        
        assert!(wish.creator == creator, "Only creator can withdraw");
        assert!(wish.pledged >= wish.goal, "Goal not reached yet");
        assert!(!wish.claimed, "Funds already claimed");
        
        wish.claimed = true;
        env.storage().instance().set(&id, &wish);
        
        env.events().publish((symbol_short!("withdwn"), id), wish.pledged);
    }
}
