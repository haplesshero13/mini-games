import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import { Layout } from "./Layout";
import WordUp from "./word-up/WordUp";

const Router: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/word-up-5" element={<WordUp size={5} maxGuesses={6} />} />
        <Route path="/word-up-6" element={<WordUp size={6} maxGuesses={6} />} />
        <Route path="/word-up-7" element={<WordUp size={7} maxGuesses={6} />} />
        <Route
          path="/word-up-gacha"
          element={<WordUp size={5} maxGuesses={6} gacha />}
        />

        <Route path="/" element={<HomePage />} />
      </Route>
    </Routes>
  );
};

export default Router;
