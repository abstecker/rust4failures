use std::env;
fn main() {
    let args: Vec<String> = env::args().collect();
    let cards = args.get(1).expect("please provide cards");
    println!("Your cards: {cards}");
}
