import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const cards = [
  { id: 1, type: 'plastic', matched: false },
  { id: 2, type: 'plastic', matched: false },
  { id: 3, type: 'glass', matched: false },
  { id: 4, type: 'glass', matched: false },
  { id: 5, type: 'paper', matched: false },
  { id: 6, type: 'paper', matched: false },
  { id: 7, type: 'metal', matched: false },
  { id: 8, type: 'metal', matched: false },
  { id: 9, type: 'contaminant', matched: false },
  { id: 10, type: 'contaminant', matched: false }
];

export default function App() {
  const [screen, setScreen] = useState('Home'); // Home, Game, Result
  const [flippedCards, setFlippedCards] = useState([]);
  const [gameCards, setGameCards] = useState((cards));
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60); // 60 seconds time limit
  const [recyclingRush, setRecyclingRush] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    if (screen === 'Game') {
      const timer = setInterval(() => {
        setTime(prev => {
          if (prev <= 0) {
            clearInterval(timer);
            setScreen('Result');
          }
          return prev - 1;
        });
      }, recyclingRush ? 500 : 1000);

      // Activate Recycling Rush when 20 seconds left
      if (time <= 20 && !recyclingRush) {
        setRecyclingRush(true);
      }

      return () => clearInterval(timer);
    }
  }, [screen, time, recyclingRush]);

  const handleCardFlip = (card) => {
    if (flippedCards.length === 2 || card.matched || flippedCards.includes(card)) return;

    setFlippedCards([...flippedCards, card]);

    if (flippedCards.length === 1) {
      const [firstCard] = flippedCards;

      // Match Check
      if (firstCard.type === card.type) {
        if (card.type === 'contaminant') {
          setScore(score - 1); // Contaminant Penalty
        } else {
          setScore(score + 2);
        }

        setGameCards(gameCards.map(c => c.type === card.type ? { ...c, matched: true } : c));
      }

      setTimeout(() => {
        setFlippedCards([]);
      }, 1000);
    }
  };

  const handleGameOver = () => {
    setLeaderboard([...leaderboard, { score, time }]);
    setScreen('Result');
  };

  const shuffle = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  if (screen === 'Home') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to the Recycling Challenge!</Text>
        <Button title="Start Recycling" onPress={() => setScreen('Game')} />
      </View>
    );
  }

  if (screen === 'Game') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Recycling Points: {score}</Text>
        <Text style={styles.title}>Time Left: {time}s</Text>
        <View style={styles.grid}>
          {gameCards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={styles.card}
              onPress={() => handleCardFlip(card)}
            >
              <Text>{flippedCards.includes(card) || card.matched ? card.type : '?'}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button title="End Game" onPress={handleGameOver} />
      </View>
    );
  }

  if (screen === 'Result') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Game Over! Recycling Points: {score}</Text>
        <Button title="Recycle More" onPress={() => {
          setGameCards(shuffle(cards));
          setScore(0);
          setTime(60);
          setRecyclingRush(false);
          setScreen('Game');
        }} />
        <Button title="Back to Home" onPress={() => setScreen('Home')} />
        <Text style={styles.title}>Leaderboard:</Text>
        {leaderboard.map((entry, index) => (
          <Text key={index}>Score: {entry.score}, Time Left: {entry.time}s</Text>
        ))}
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    width: 70,
    height: 100,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  }
});
