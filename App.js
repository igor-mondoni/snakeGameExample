import React, { useRef, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { GameEngine } from "react-native-game-engine";
import Constants from "./Constants";
import Head from "./components/Head";
import Food from "./components/Food";
import Tail from "./components/Tail";
import GameLoop from "./systems/GameLoop";

//Bootstrap Icons
import HandIndexThumb from "react-native-bootstrap-icons/icons/hand-index-thumb";
import Keyboard from "react-native-bootstrap-icons/icons/keyboard";

function App() {
  const [isGameRunning, setIsGameRunning] = useState(true);
  const [controlType, setControlType] = useState(Platform.OS === 'android' ? 'click' : (Platform.OS === 'android' ? 'click' : ''));

  const randomPositions = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  const BoardSize = Constants.GRID_SIZE * Constants.CELL_SIZE;
  const engine = useRef(null);

  const resetGame = () => {
    engine.current.swap({
      head: {
        position: [0, 0],
        size: Constants.CELL_SIZE,
        updateFrequency: 10,
        nextMove: 10,
        xspeed: 0,
        yspeed: 0,
        renderer: <Head />,
      },
      food: {
        position: [
          randomPositions(0, Constants.GRID_SIZE - 1),
          randomPositions(0, Constants.GRID_SIZE - 1),
        ],
        size: Constants.CELL_SIZE,
        updateFrequency: 10,
        nextMove: 10,
        xspeed: 0,
        yspeed: 0,
        renderer: <Food />,
      },
      tail: {
        size: Constants.CELL_SIZE,
        elements: [],
        renderer: <Tail />,
      },
    });
    setIsGameRunning(true);
    setControlType(Platform.OS === 'android' ? 'click' : (Platform.OS === 'android' ? 'click' : ''));
  };

  return (
    <View style={styles.canvas}>
      <GameEngine
        ref={engine}
        style={{
          width: BoardSize,
          height: BoardSize,
          flex: null,
          backgroundColor: "white",
        }}
        entities={{
          head: {
            position: [0, 0],
            size: Constants.CELL_SIZE,
            updateFrequency: 10,
            nextMove: 10,
            xspeed: 0,
            yspeed: 0,
            renderer: <Head />,
          },
          food: {
            position: [
              randomPositions(0, Constants.GRID_SIZE - 1),
              randomPositions(0, Constants.GRID_SIZE - 1),
            ],
            size: Constants.CELL_SIZE,
            renderer: <Food />,
          },
          tail: {
            size: Constants.CELL_SIZE,
            elements: [],
            renderer: <Tail />,
          },
        }}
        systems={[GameLoop]}
        running={isGameRunning}
        onEvent={(e) => {
          switch (e) {
            case "game-over":
              alert("Game over!");
              setIsGameRunning(false);
              return;
          }
        }}
      />
      {controlType == "" ? (
        <View style={styles.controllerRow}>
          <TouchableOpacity
            onPress={() => setControlType("click")}
          >
            <View style={styles.controlTypeBtn}>
              <HandIndexThumb fill="rgb(189, 189, 189)" />
            </View>
          </TouchableOpacity>
          <View style={[styles.controlBtn, { backgroundColor: null }]} />
          <TouchableOpacity
            onPress={() => setControlType("keebord")}
          >
            <View style={styles.controlTypeBtn}>
              <Keyboard fill="rgb(189, 189, 189)" />
            </View>
          </TouchableOpacity>
        </View>
      ) : controlType == "click" ? (
        <View style={styles.controlContainer}>
          <View style={styles.controllerRow}>
            <TouchableOpacity onPress={() => engine.current.dispatch("move-up")}>
              <View style={styles.controlBtn} />
            </TouchableOpacity>
          </View>
          <View style={styles.controllerRow}>
            <TouchableOpacity
              onPress={() => engine.current.dispatch("move-left")}
            >
              <View style={styles.controlBtn} />
            </TouchableOpacity>
            <View style={[styles.controlBtn, { backgroundColor: null }]} />
            <TouchableOpacity
              onPress={() => engine.current.dispatch("move-right")}
            >
              <View style={styles.controlBtn} />
            </TouchableOpacity>
          </View>
          <View style={styles.controllerRow}>
            <TouchableOpacity
              onPress={() => engine.current.dispatch("move-down")}
            >
              <View style={styles.controlBtn} />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TextInput
          autoFocus
          placeholder="clique aqui e use as setas do teclado"
          value=""
          style={styles.input}
          onKeyPress={(keyValue) => {
            switch (keyValue.code) {
              case "ArrowUp": case "KeyW": engine.current.dispatch("move-up")
                break;
              case "ArrowDown": case "KeyS":  engine.current.dispatch("move-down")
                break;
              case "ArrowLeft": case "KeyA":  engine.current.dispatch("move-left")
                break;
              case "ArrowRight": case "KeyD":  engine.current.dispatch("move-right")
                break;
                default: console.log(keyValue.code)
            }
          }} />
      )}
      {!isGameRunning && (
        <TouchableOpacity onPress={resetGame}>
          <Text
            style={{
              color: "white",
              marginTop: 15,
              fontSize: 22,
              padding: 10,
              backgroundColor: "grey",
              borderRadius: 10
            }}
          >
            Start New Game
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    paddingTop: 10,
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  controlContainer: {
    marginTop: 10,
  },
  controllerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  controlBtn: {
    backgroundColor: "yellow",
    width: 100,
    height: 100,
  },
  controlTypeBtn: {
    backgroundColor: "gray",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 40,
    width: 250,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default App;