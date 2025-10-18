'use client';
import { useState, useEffect } from 'react';

export default function Clock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    };

    updateClock();
    const timerId = setInterval(updateClock, 60000);

    return () => clearInterval(timerId);
  }, []);

  return <span>{time}</span>;
}
