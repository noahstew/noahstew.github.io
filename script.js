// Colors
const neonPink = "var(--neon-pink)";
const neonPinkCenter = "var(--neon-pink-center)";
const neonYellow = "var(--neon-yellow)";
const neonYellowCenter = "var(--neon-yellow-center)";
const neonBlue = "var(--neon-blue)";
const neonGreen = "var(--neon-green)";
// const neonOrange = "var(--neon-orange)";
// const neonRed = "var(--neon-red)";

// Updating header color based on page selected
function setPageState() {
    var currentPage = window.location.pathname;

    // TODO: Assign custom colors for each page
    if (currentPage == "/index.html") {
        changeMenuColors(neonPink, neonPinkCenter, neonYellow, neonYellowCenter,"home")
    } else if (currentPage == "/about.html") {
        changeMenuColors(neonPink, neonPinkCenter, neonYellow, neonYellowCenter, "about")
    } else if (currentPage == "/contact.html") {
        changeMenuColors(neonPink, neonPinkCenter, neonYellow, neonYellowCenter, "contact")
    } else if (currentPage == "/education.html") {
        changeMenuColors(neonPink, neonPinkCenter, neonYellow, neonYellowCenter, "education")
    } else if (currentPage == "/projects.html") {
        changeMenuColors(neonPink, neonPinkCenter, neonYellow, neonYellowCenter, "projects")
    }
}

function changeMenuColors(selectedColor, selectedInside, secondaryColor, secondaryInside, page) {
    // Name colour
    const nameText = document.querySelector('.name-neon-text');
    if (nameText.id == page) {
        nameText.style.color = selectedInside;
        nameText.style.textShadow = selectedColor + " 1px 0 8px";
    } else {
        nameText.style.color = secondaryInside;
        nameText.style.textShadow = secondaryColor + " 1px 0 8px";
    }


    // Select all elements with the class '.menu-neon-text'
    const menuText = document.querySelectorAll('.menu-neon-text');

    // Loop through each element and apply styles
    menuText.forEach(menuText => {
        if (menuText.id == page) {
            menuText.style.color = selectedInside;
            menuText.style.textShadow = `${selectedColor} 1px 0 12px`;
        } else {
            menuText.style.color = secondaryInside;
            menuText.style.textShadow = `${secondaryColor} 1px 0 12px`;
        }
    });
}