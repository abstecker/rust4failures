//! One line in, one reply out: the seam every shell drives.
//!
//! The terminal (`examples/pkio.rs`) and the book's web page both drive this
//! one type, so they cannot answer differently. Behind the `wasm` feature it
//! compiles to WebAssembly for the page; without it, it is plain Rust.

/// A conversation about the cards in your hand.
#[cfg_attr(feature = "wasm", wasm_bindgen::prelude::wasm_bindgen)]
#[derive(Debug, Default)]
pub struct Session;

#[cfg_attr(feature = "wasm", wasm_bindgen::prelude::wasm_bindgen)]
impl Session {
    /// A new conversation.
    #[cfg_attr(feature = "wasm", wasm_bindgen::prelude::wasm_bindgen(constructor))]
    #[must_use]
    pub fn new() -> Self {
        Self
    }

    /// Answer one line. No reading, no printing.
    pub fn eval(&mut self, line: &str) -> String {
        format!("Your cards: {}", line.trim())
    }
}

#[cfg(test)]
mod tests {
    use super::Session;

    #[test]
    fn the_hand_is_echoed_back() {
        assert_eq!(Session::new().eval("AS KD\n"), "Your cards: AS KD");
    }
}
