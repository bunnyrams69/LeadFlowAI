import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';

const GlobalProgressBar = () => {
  const { isLoading } = useContext(AppContext);
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer;
    if (isLoading) {
      setVisible(true);
      setWidth(5);
      timer = setInterval(() => {
        setWidth(w => {
           if (w >= 85) return 85;
           return w + Math.random() * 10;
        });
      }, 500);
    } else if (visible) {
      setWidth(100);
      setTimeout(() => setVisible(false), 300);
      setTimeout(() => setWidth(0), 400);
    }
    return () => clearInterval(timer);
  }, [isLoading, visible]);

  if (!visible) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '3px', zIndex: 10000 }}>
      <div style={{ 
        height: '100%', 
        backgroundColor: '#2563EB', 
        width: `${width}%`, 
        transition: 'width 0.3s ease-out' 
      }}></div>
    </div>
  );
};

export default GlobalProgressBar;
