import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

/** Deck of cards component: shows new deck */

const BASE_URL = "https://deckofcardsapi.com/api/deck/";

function DeckViewer() {
    const [deckId, setDeckId] = useState(null);
    const [card, setCard] = useState(null);
    const [cardsLeft, setCardsLeft] = useState(null);

    //btn refs
    const drawCardBtn = useRef();
    const shuffleDeckBtn = useRef();

    if (cardsLeft === 0) {
        alert("Error: no cards remaining!");
        return;
    }

    useEffect(function fetchDeckWhenMounted() {
        async function fetchDeck() {
            try {
                if (drawCardBtn.current) drawCardBtn.current.disabled = true;
                if (shuffleDeckBtn.current) shuffleDeckBtn.current.disabled = true;

                const newDeck = await axios.get(`${BASE_URL}/new/`);
                setDeckId(newDeck.data.deck_id);
                setCardsLeft(newDeck.data.remaining);
            } catch (err) {
                console.error("Error fetching deck:", err);
            } finally {
                // Enable buttons after shuffle
                if (drawCardBtn.current) drawCardBtn.current.disabled = false;
                if (shuffleDeckBtn.current) shuffleDeckBtn.current.disabled = false;
            }
        }
        fetchDeck();
    }, []);

    const drawCard = async () => {
        if (!deckId) return;

        try {
            const res = await axios.get(`${BASE_URL}/${deckId}/draw/?count=1`); //https://deckofcardsapi.com/api/deck/<<deck_id>>/draw/?count=2
            const newCard = res.data.cards[0];
            setCard(newCard);
            setCardsLeft(res.data.remaining);
        } catch (err) {
            console.error("Error drawing card:", err);
        }
    }

    const shuffleDeck = async () => {
        if (!deckId) return;

        setCard(null);

        try {
            const res = await axios.get(`${BASE_URL}/${deckId}/shuffle/`); //https://deckofcardsapi.com/api/deck/<<deck_id>>/shuffle/
            setCardsLeft(res.data.remaining);
        } catch (err) {
            console.error("Error shuffling deck:", err);
        } finally {
            // Enable buttons after reshuffle
            if (drawCardBtn.current) drawCardBtn.current.disabled = false;
            if (shuffleDeckBtn.current) shuffleDeckBtn.current.disabled = false;
        }
    }

    return (
        <div>
            {card ? (
                <div>
                    <img src={card.image} alt={card.value} />
                </div>
            ) : (
                <p>No card drawn yet</p>
            )}
            <p>Cards remaining: {cardsLeft}</p>
            <button onClick={drawCard}>Draw a card!</button>
            <button onClick={shuffleDeck}>Shuffle deck</button>
        </div>
    );
}

export default DeckViewer