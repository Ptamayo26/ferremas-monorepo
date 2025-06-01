import './App.css'
import { useState } from 'react'

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const products = [
    { id: 1, name: 'Martillo', price: 15000, image: 'data:image/jpeg;base64,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' },
    { id: 2, name: 'Destornillador', price: 8000, image: 'https://media.istockphoto.com/id/466428630/es/foto/destornillador.jpg?s=612x612&w=0&k=20&c=quNAtTQJct8zsq6qfKoSzZ8wwfcRKME8YOukJ9S8iPw=' },
    { id: 3, name: 'Taladro', price: 45000, image: 'https://media.istockphoto.com/id/184639599/es/foto/taladros-con-punta-grande.jpg?s=612x612&w=0&k=20&c=25IxpMs7J2Yb8XQ-5SCwPGmicEM3lq0MWjjEeeFd6w0=' },
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '2rem',
      backgroundColor: '#f5f5f5'
    }}>
      <h1 style={{ marginBottom: '2rem', color: '#333' }}>Ferremas</h1>
      
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          overflow: 'hidden',
          position: 'relative',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                minWidth: '100%',
                transform: `translateX(-${currentIndex * 100}%)`,
                transition: 'transform 0.3s ease-in-out',
                padding: '1rem',
                backgroundColor: 'white',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: '200px',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  marginBottom: '1rem'
                }}
              />
              <h2 style={{ margin: '0.5rem 0', color: '#333' }}>{product.name}</h2>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2c5282' }}>
                ${product.price.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        
        <button
          onClick={prevSlide}
          style={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            padding: '0.5rem 1rem',
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ←
        </button>
        
        <button
          onClick={nextSlide}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            padding: '0.5rem 1rem',
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          →
        </button>
      </div>
    </div>
  )
}

export default App
