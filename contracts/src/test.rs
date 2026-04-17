#![cfg(test)]
use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, Symbol};

#[test]
fn test_create_wish() {
    let env = Env::default();
    let contract_id = env.register_contract(None, WishPoolContract);
    let client = WishPoolContractClient::new(&env, &contract_id);

    let creator = Address::generate(&env);
    let id = Symbol::new(&env, "wish1");
    let goal = 1000;
    let deadline = 10000;

    env.mock_all_auths();
    client.create_wish(&creator, &id, &goal, &deadline);

    let wish = client.get_wish(&id);
    assert_eq!(wish.creator, creator);
    assert_eq!(wish.goal, goal);
    assert_eq!(wish.pledged, 0);
    assert_eq!(wish.claimed, false);
}

#[test]
fn test_pledge() {
    let env = Env::default();
    let contract_id = env.register_contract(None, WishPoolContract);
    let client = WishPoolContractClient::new(&env, &contract_id);

    let creator = Address::generate(&env);
    let contributor = Address::generate(&env);
    let id = Symbol::new(&env, "wish1");
    
    env.mock_all_auths();
    client.create_wish(&creator, &id, &1000, &10000);
    
    client.pledge(&contributor, &id, &500);
    
    let wish = client.get_wish(&id);
    assert_eq!(wish.pledged, 500);
    
    let user_contrib = client.get_user_pledge(&id, &contributor);
    assert_eq!(user_contrib, 500);
}

#[test]
fn test_withdraw_success() {
    let env = Env::default();
    let contract_id = env.register_contract(None, WishPoolContract);
    let client = WishPoolContractClient::new(&env, &contract_id);

    let creator = Address::generate(&env);
    let contributor = Address::generate(&env);
    let id = Symbol::new(&env, "wish1");
    
    env.mock_all_auths();
    client.create_wish(&creator, &id, &1000, &10000);
    client.pledge(&contributor, &id, &1000); // Hit the goal
    
    client.withdraw(&creator, &id);
    
    let wish = client.get_wish(&id);
    assert_eq!(wish.claimed, true);
}

#[test]
#[should_panic(expected = "Goal not reached yet")]
fn test_withdraw_insufficient_funds() {
    let env = Env::default();
    let contract_id = env.register_contract(None, WishPoolContract);
    let client = WishPoolContractClient::new(&env, &contract_id);

    let creator = Address::generate(&env);
    let id = Symbol::new(&env, "wish1");
    
    env.mock_all_auths();
    client.create_wish(&creator, &id, &1000, &10000);
    client.pledge(&Address::generate(&env), &id, &500); // Goal is 1000
    
    client.withdraw(&creator, &id); // Should panic
}
