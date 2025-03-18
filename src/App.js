import React from "react";

import MainSection from "@features/main/MainSection";
import GuestbookSection from "@features/guestbook/GuestbookSection";
import InfoAndGallerySection from "@features/gallery/InfoAndGallerySection";

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
