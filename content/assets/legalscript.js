document.addEventListener("DOMContentLoaded", () => {
    const slideElements = document.querySelectorAll('.legal, .legallist');
  
    const isInViewport = (element) => {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
      );
    };
  
    const handleScroll = () => {
      slideElements.forEach((element) => {
        if (isInViewport(element)) {
          element.classList.add("slide-in");
        }
      });
    };
  
    window.addEventListener("scroll", handleScroll);
  
    handleScroll();
  });
  