import backgroundImg from '../images/mainImage.jpg';

function MainSection() {
  const sectionStyle = {
    width: '100%',
    minHeight: '100vh',
    backgroundImage: `url(${backgroundImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  return (
    <section style={sectionStyle}>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h1 style={{ color: '#fff' }}>2025.07.05</h1>
        <h1 style={{ color: '#fff' }}>Our Wedding Day</h1>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#fff' }}>Jaewon</h2>
        <h2 style={{ color: '#fff' }}>Saemi</h2>
      </div>
    </section>
  );
}

export default MainSection;
