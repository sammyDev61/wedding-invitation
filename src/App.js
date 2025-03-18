import MainSection from "@features/main/MainSection";

import InvitationSection from "@features/invitation/InvitationSection";
import GallerySection from "@features/gallery/GallerySection";
import GuestbookSection from "@features/guestbook/GuestbookSection";

import "./App.css";

function App() {
  return (
    <div className="App">
      <MainSection />
      <div className="space-y-24 py-24">
        <InvitationSection />
        <GallerySection />
        <GuestbookSection />
      </div>
    </div>
  );
}

export default App;
