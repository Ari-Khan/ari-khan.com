import { useEffect, useState } from 'react';

export default function Home() {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    fetch('/main.html')
      .then((response) => response.text())
      .then((html) => setHtmlContent(html));
  }, []);

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
}
