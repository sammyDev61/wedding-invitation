import React from 'react';

import MainSection from './components/MainSection';
import GallerySection from './components/GallerySection';
import GuestbookSection from './components/GuestbookSection';

import './App.css';

function App() {
  return (
    <div className="App">
      <MainSection />
      <GallerySection />
      <GuestbookSection />
    </div>
  );
}

export default App;
