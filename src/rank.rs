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

impl From<char> for Rank {
    fn from(c: char) -> Self {
        match c {
            'A' | 'a' => Rank::ACE,
            'K' | 'k' => Rank::KING,
            'Q' | 'q' => Rank::QUEEN,
            'J' | 'j' => Rank::JACK,
            'T' | 't' | '0' => Rank::TEN,
            '9' => Rank::NINE,
            '8' => Rank::EIGHT,
            '7' => Rank::SEVEN,
            '6' => Rank::SIX,
            '5' => Rank::FIVE,
            '4' => Rank::FOUR,
            '3' => Rank::TREY,
            '2' => Rank::DEUCE,
            _ => Rank::BLANK,
        }
    }
}

#[cfg(test)]
#[allow(non_snake_case)]
mod rank_tests {
    use super::*;
    use rstest::rstest;

    #[rstest]
    #[case('A', Rank::ACE)]
    #[case('a', Rank::ACE)]
    #[case('K', Rank::KING)]
    #[case('k', Rank::KING)]
    #[case('Q', Rank::QUEEN)]
    #[case('q', Rank::QUEEN)]
    #[case('J', Rank::JACK)]
    #[case('j', Rank::JACK)]
    #[case('T', Rank::TEN)]
    #[case('t', Rank::TEN)]
    #[case('0', Rank::TEN)]
    #[case('9', Rank::NINE)]
    #[case('8', Rank::EIGHT)]
    #[case('7', Rank::SEVEN)]
    #[case('6', Rank::SIX)]
    #[case('5', Rank::FIVE)]
    #[case('4', Rank::FOUR)]
    #[case('3', Rank::TREY)]
    #[case('2', Rank::DEUCE)]
    #[case('_', Rank::BLANK)]
    #[case(' ', Rank::BLANK)]
    #[case('z', Rank::BLANK)]
    fn from__char(#[case] input: char, #[case] expected: Rank) {
        assert_eq!(expected, Rank::from(input));
    }
}
