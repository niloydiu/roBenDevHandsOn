import { useEffect, useState } from 'react';

export default function DateDisplay({ date }) {
  const [formatted, setFormatted] = useState('');
  useEffect(() => {
    if (date) {
      const d = typeof date === 'string' ? new Date(date) : date;
      setFormatted(d.toLocaleDateString());
    }
  }, [date]);
  return <>{formatted}</>;
}
