// Colors
const neonPink = "var(--neon-pink)";
const neonPinkCenter = "var(--neon-pink-center)";
const neonYellow = "var(--neon-yellow)";
const neonYellowCenter = "var(--neon-yellow-center)";
const neonBlue = "var(--neon-blue)";
const neonGreen = "var(--neon-green)";

// Updating header color based on page selected
function setPageState() {
    var currentPage = window.location.pathname;

    // TODO: Assign custom colors for each page
    if (currentPage == "/index.html") {
        changeMenuColors(neonPink, neonPinkCenter, neonYellow, neonYellowCenter, "home")
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
    const bar = document.querySelectorAll('.bar');
    if (nameText.id == page) {
        nameText.style.color = selectedInside;
        nameText.style.textShadow = selectedColor + " 1px 0 8px";
        bar.forEach(bar => {
            bar.style.backgroundColor = secondaryInside;
            bar.style.boxShadow = "0px 0px 8px 2px " + secondaryColor;
        });
    } else {
        nameText.style.color = secondaryInside;
        nameText.style.textShadow = secondaryColor + " 1px 0 8px";
        bar.forEach(bar => {
            bar.style.backgroundColor = selectedInside;
            bar.style.boxShadow = "0px 0px 8px 2px " + selectedColor;
        });
    }


    // Select all elements with the class '.menu-neon-text'
    const menuText = document.querySelectorAll('.nav-link');

    // Loop through each element and apply styles
    menuText.forEach(menuText => {
        if (menuText.id == page) {
            menuText.style.color = selectedInside;
            menuText.style.textShadow = selectedColor + " 1px 0 12px";
        } else {
            menuText.style.color = secondaryInside;
            menuText.style.textShadow = secondaryColor + " 1px 0 12px";
        }
    });
}

const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const nameNeonText = document.querySelector(".name-neon-text");
const navBar = document.querySelector(".navbar");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
    nameNeonText.classList.toggle("active");
    navBar.classList.toggle("active");
});

$('#email').hover(function () {
    $(this).fadeOut(0, function () {
        $(this).attr('src', 'icons/mail_yellow.png');
        $(this).fadeIn(500);
    });
}, function () {
    $(this).fadeOut(0, function () {
        $(this).attr('src', 'icons/mail.png');
        $(this).fadeIn(500);
    });
});

$('#linkedin').hover(function () {
    $(this).fadeOut(0, function () {
        $(this).attr('src', 'icons/li_yellow.png');
        $(this).fadeIn(500);
    });
}, function () {
    $(this).fadeOut(0, function () {
        $(this).attr('src', 'icons/li.png');
        $(this).fadeIn(500);
    });
});

$('#github').hover(function () {
    $(this).fadeOut(0, function () {
        $(this).attr('src', 'icons/github_yellow.png');
        $(this).fadeIn(500);
    });
}, function () {
    $(this).fadeOut(0, function () {
        $(this).attr('src', 'icons/github.png');
        $(this).fadeIn(500);
    });
});

$('#instagram').hover(function () {
    $(this).fadeOut(0, function () {
        $(this).attr('src', 'icons/insta_yellow.png');
        $(this).fadeIn(500);
    });
}, function () {
    $(this).fadeOut(0, function () {
        $(this).attr('src', 'icons/insta.png');
        $(this).fadeIn(500);
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth', // Smooth scrolling
                block: 'start',     // Vertical alignment
                inline: 'nearest',  // Horizontal alignment
                // Custom cubic-bezier timing function for ease-in-out effect
                timing: 'cubic-bezier(0.42, 0, 0.58, 1)'
            });
        }
    });
});