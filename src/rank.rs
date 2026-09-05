/// The rank of a playing card.
///
/// The discriminants are the card's value in play, which is why the ace is
/// fourteen rather than one. `BLANK` is the zero value: it is what you get
/// when a rank is asked for and none is there.
#[derive(Clone, Copy, Debug, Default, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum Rank {
    ACE = 14,
    KING = 13,
    QUEEN = 12,
    JACK = 11,
    TEN = 10,
    NINE = 9,
    EIGHT = 8,
    SEVEN = 7,
    SIX = 6,
    FIVE = 5,
    FOUR = 4,
    TREY = 3,
    DEUCE = 2,
    #[default]
    BLANK = 0,
}

