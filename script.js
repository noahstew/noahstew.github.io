// Menu
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

// Link hover effect
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

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});