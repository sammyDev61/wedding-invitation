import React from "react";
import InvitationSection from "@features/invitation/InvitationSection";
import GallerySection from "./GallerySection";
import styles from "./styles/InfoAndGallerySection.module.css";

function InfoAndGallerySection() {
  return (
    <section>
      <InvitationSection />
      <GallerySection />
    </section>
  );
}

export default InfoAndGallerySection;
