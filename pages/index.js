import { useEffect, useState } from "react";

const HomePage = () => {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    fetch('/pages/main.html')
      .then((response) => response.text())
      .then((html) => setHtmlContent(html))
      .catch((err) => console.error('Failed to load HTML:', err));
  }, []);

  return (
    <div>
      <h1>My Website</h1>

      {/* Render HTML Content */}
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
};

export default HomePage;
