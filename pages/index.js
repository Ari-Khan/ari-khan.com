export default function Home() {
    const htmlContent = `
        <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                
                <link rel="stylesheet" href="../style.css">

                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Foldit:wght@650&family=Poppins:wght@500&display=swap" rel="stylesheet">
                <link rel="preload" href="../../gallery/video1.mp4" as="video">
                <link rel="preload" href="../../gallery/video2.mp4" as="video">
            </head>

            <body>
                <nav>
                    <ul>
                        <li><a class = "logo" href="main.html">Ari Khan</a></li>
                        <li><a href="projects.html">Projects</a></li>
                        <li><a href="chat.html">AI</a></li>
                        <li><a href="blog.html">Blog</a></li>
                        <li><a href="about.html">About</a></li>
                        <li><a href="contact.html">Contact</a></li>
                    </ul>
                </nav>

                <div class="image-container">
                    <img src="../gumballs.png" alt="Backdrop Image.">
                    <div class="shadow-overlay"></div>
                    <div class="text-overlay">
                        <div class="slide-in-text-small">A place for</div>
                        <div class="slide-in-text">Innovation.</div>
                    </div>
                </div>

                <div>
                    <h1 class="header">
                        Foreword
                    </h1>
                    <p class="foreword">
                        Hey there! I'm <strong>Ari Khan</strong>, and I'm thrilled you're here. <br><br>
                        This site is a space where I share my journey, projects, interests, and everything that fuels my curiosity. <br>
                        Whether it's about technology, engineering, school projects, or personal growth, you'll find bits and pieces of what I love and care about. <br>
                        I believe in stepping out of comfort zones, learning from every experience, and constantly growing and starting new projects. <br>
                        I hope you'll find something here that resonates with you, sparks some inspiration, or even just gives you a reason to stay innovative. <br>
                        Feel free to explore, drop a message, or just say hi. I'd love to connect and share ideas with you! <br><br>
                        - Ari Khan
                    </p>
                </div>

                <div>
                    <h1 class="header">
                        Projects Gallery
                </div>

                <div class="scrolling-gallery" id = "gallery">
                    <div class="gallery-content">
                        <img src="../../gallery/gallery1.png" alt="Gallery 1">
                        <img src="../gallery/gallery2.png" alt="Gallery 2">
                        <img src="../gallery/gallery3.png" alt="Gallery 3">
                        <img src="../gallery/message1.png" alt="Message 1">
                        <img src="../gallery/gallery4.png" alt="Gallery 4">
                        <video autoplay loop muted controls> <source src="../gallery/video1.mp4" type="video/mp4"> Your browser does not support the video tag. </video>
                        <img src="../gallery/gallery5.png" alt="Gallery 5">
                        <img src="../gallery/gallery6.png" alt="Gallery 6">
                        <img src="../gallery/gallery7.png" alt="Gallery 7">
                        <img src="../gallery/gallery8.png" alt="Gallery 8">
                        <img src="../gallery/gallery9.png" alt="Gallery 9">
                        <video autoplay loop muted controls> <source src="../gallery/video2.mp4" type="video/mp4"> Your browser does not support the video tag. </video>
                        <img src="../gallery/gallery10.png" alt="Gallery 10">
                        <img src="../gallery/gallery11.png" alt="Gallery 11">
                    </div>
                    <div class="gallery-content2" id = "gallery">
                        <img src="../gallery/gallery1.png" alt="Gallery 1">
                        <img src="../gallery/gallery2.png" alt="Gallery 2">
                        <img src="../gallery/gallery3.png" alt="Gallery 3">
                        <img src="../gallery/message1.png" alt="Message 1">
                        <img src="../gallery/gallery4.png" alt="Gallery 4">
                        <video autoplay loop muted controls> <source src="../gallery/video1.mp4" type="video/mp4"> Your browser does not support the video tag. </video>
                        <img src="../gallery/gallery5.png" alt="Gallery 5">
                        <img src="../gallery/gallery6.png" alt="Gallery 6">
                        <img src="../gallery/gallery7.png" alt="Gallery 7">
                        <img src="../gallery/gallery8.png" alt="Gallery 8">
                        <img src="../gallery/gallery9.png" alt="Gallery 9">
                        <video autoplay loop muted controls> <source src="../gallery/video2.mp4" type="video/mp4"> Your browser does not support the video tag. </video>
                        <img src="../gallery/gallery10.png" alt="Gallery 10">
                        <img src="../gallery/gallery11.png" alt="Gallery 11">
                    </div>
                </div>

                <div class="main-content">
                    <div class="container">
                    <h2>Join Our Mailing List</h2>
                    <input type="email" id="email" placeholder="Enter your email" required />
                    <button onclick="subscribe()">Subscribe</button>
                    <p id="message"></p>
                    </div>
                
                    <div id="fade-text" class="fade-text">Find Innovation</div>
                </div>

                <script src="../script.js"></script>

                <footer>
                    <div class="footer-container">
                        <div class="logo-container">
                            <li><a class="bottom-logo" href="/main.html">Ari Khan</a></li>
                        </div>
                
                        <div class="links-grid">
                            <li><a href="https://github.com/Ari-Khan">GitHub</a></li>
                            <li><a href="https://www.linkedin.com/in/ari-khan-7383a5324/">Linkedin</a></li>
                            <li><a href="https://www.youtube.com/@AriKhan1">YouTube</a></li>
                            <li><a href="about.html">About</a></li>
                            <li><a href="blog.html">Blog</a></li>
                            <li><a href="https://github.com/Ari-Khan/ari-khan.com">Repository</a></li>
                            <li><a href="contact.html">Contact</a></li>
                            <li><a href="privacy.html">Privacy Policy</a></li>
                            <li><a href="termsofuse.html">Terms of Use</a></li>
                        </div>
                    </div>
                
                    <div class="thin-line"></div>
                    <p>&copy; 2024 Ari Khan. All rights reserved.</p>
                </footer>
            </body>
        </html>
    `;
  
    return (
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    );
  }