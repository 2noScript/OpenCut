'use client';
import { useEffect, useState } from 'react';

export default function Editor() {
  const [elements, setElements] = useState<any[]>([]);
  const userId = "user_01";
  const projectId = "project_abc"; 

  useEffect(() => {
    const eventSource = new EventSource(`/api/events?userId=${userId}&projectId=${projectId}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("AI ra lệnh:", data);
      setElements((prev) => [...prev, data]);
    };

    return () => eventSource.close();
  }, [userId, projectId]);

  return (
    <div className="canvas">
      {elements.map((el, i) => (
        <div key={i} className="layer">{el.content}</div>
      ))}
    </div>
  );
}