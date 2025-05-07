import styles from "./styles/GallerySection.module.css";

function GallerySection() {
  const images = [
    {
      src: "/images/gallery1.jpg",
      alt: "갤러리 이미지 1",
    },
    {
      src: "/images/gallery2.jpg",
      alt: "갤러리 이미지 2",
    },
    {
      src: "/images/gallery3.jpg",
      alt: "갤러리 이미지 3",
    },
    {
      src: "/images/gallery4.jpg",
      alt: "갤러리 이미지 4",
    },
    {
      src: "/images/gallery5.jpg",
      alt: "갤러리 이미지 5",
    },
    {
      src: "/images/gallery6.jpg",
      alt: "갤러리 이미지 6",
    },
    {
      src: "/images/gallery7.jpg",
      alt: "갤러리 이미지 7",
    },
    {
      src: "/images/gallery8.jpg",
      alt: "갤러리 이미지 8",
    },
    {
      src: "/images/gallery9.jpg",
      alt: "갤러리 이미지 9",
    },
    {
      src: "/images/gallery10.jpg",
      alt: "갤러리 이미지 10",
    },
    {
      src: "/images/gallery11.jpg",
      alt: "갤러리 이미지 11",
    },
    {
      src: "/images/gallery12.jpg",
      alt: "갤러리 이미지 12",
    },
    {
      src: "/images/gallery13.jpg",
      alt: "갤러리 이미지 13",
    },
    {
      src: "/images/gallery14.jpg",
      alt: "갤러리 이미지 14",
    },
    {
      src: "/images/gallery15.jpg",
      alt: "갤러리 이미지 15",
    },
    {
      src: "/images/gallery16.jpg",
      alt: "갤러리 이미지 16",
    },
    {
      src: "/images/gallery17.jpg",
      alt: "갤러리 이미지 17",
    },
    {
      src: "/images/gallery18.jpg",
      alt: "갤러리 이미지 18",
    },
    {
      src: "/images/gallery19.jpg",
      alt: "갤러리 이미지 19",
    },
    {
      src: "/images/gallery20.jpg",
      alt: "갤러리 이미지 20",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>갤러리</h2>
        <div className={styles.galleryContainer}>
          <div className={styles.gallery}>
            {images.map((image, index) => (
              <div key={index} className={styles.imageWrapper}>
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="eager"
                  decoding="sync"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GallerySection;
