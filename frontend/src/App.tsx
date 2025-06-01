import './App.css'
import { useState } from 'react'

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const products = [
    { id: 1, name: 'Martillo', price: 15000, image: 'https://via.placeholder.com/200x200' },
    { id: 2, name: 'Destornillador', price: 8000, image: 'https://via.placeholder.com/200x200' },
    { id: 3, name: 'Taladro', price: 45000, image: 'https://via.placeholder.com/200x200' },
    { id: 4, name: 'Sierra', price: 25000, image: 'https://via.placeholder.com/200x200' },
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
