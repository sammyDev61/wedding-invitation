import React from "react";

import MainSection from "./components/MainSection";
import GuestbookSection from "./components/GuestbookSection";
import InfoAndGallerySection from "./components/InfoAndGallerySection";

import "./App.css";

function App() {
  return (
    <div className="App">
      <MainSection />
      <InfoAndGallerySection />
      <GuestbookSection />
    </div>
  );
}

export default App;
