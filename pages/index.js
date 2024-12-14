export default function Home() {
    const htmlContent = `
      <div>
        <h1>Welcome to My Website</h1>
        <p>This is my static HTML content.</p>
        <div>
          <p>Some other HTML content here...</p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </div>
      </div>
    `;
  
    return (
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    );
  }