import SectionTitle from './SectionTitle';

function GallerySection() {
  const images = [
    '/gallery/1.jpg',
    '/gallery/2.jpg',
    '/gallery/3.jpg',
    '/gallery/4.jpg',
    '/gallery/5.jpg',
    '/gallery/6.jpg',
    '/gallery/7.jpg',
    '/gallery/8.jpg',
    '/gallery/9.jpg',
  ];

  return (
    <section>
      <SectionTitle text="Gallery" />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '8px',
          width: '100%',
        }}
      >
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`gallery-${index}`}
            style={{ width: '100%', height: 'auto' }}
          />
        ))}
      </div>
    </section>
  );
}

export default GallerySection;
