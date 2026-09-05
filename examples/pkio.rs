use std::io;
use std::io::{IsTerminal, Write};

use rust4failures::Session;

/// For this version of reading a string in from the command line, we are going to
/// us Rust's standard library https://doc.rust-lang.org/std/io/#standard-input-and-output module,
/// which handles input, the i, and output, the o.
///
/// Reading and printing live here. What to say back lives in `Session`.
fn main() -> io::Result<()> {
    let mut session = Session::new();
    // Only a person at a terminal needs a prompt. When the input is piped in,
    // a prompt is just noise in the output.
    let interactive = io::stdin().is_terminal();

    loop {
        // Step 1: Prompt the user for his cards:
        if interactive {
            print!("hand> ");
            // OK this is ugly. This is why I use libraries like `clap`.
            io::stdout().flush()?;
        }

        // Step 2: Pass the inpu`t into the variable `input`.
        // Our String is `mut`, which stands for mutable so that we
        // can set a value to it later on. One of Rust's code design philosophies
        // is that things are mutable only when they need to be, which reduces the
        // probability of a whole lot of bugs getting through.
        let mut input = String::new();

        // `read_line` returns how many bytes it read. Zero means the input is
        // over: Ctrl-D at a terminal.
        if io::stdin().read_line(&mut input)? == 0 {
            return Ok(());
        }

        // Step 3: Answer.
        println!("{}", session.eval(&input));
    }
}
