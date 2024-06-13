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

$('#tiktok').hover(function () {
    $(this).fadeOut(0, function () {
        $(this).attr('src', 'icons/tiktok_yellow.png');
        $(this).fadeIn(500);
    });
}, function () {
    $(this).fadeOut(0, function () {
        $(this).attr('src', 'icons/tiktok.png');
        $(this).fadeIn(500);
    });
});

$('#resume').hover(function () {
    $(this).fadeOut(0, function () {
        $(this).attr('src', 'icons/resume_yellow.png');
        $(this).fadeIn(500);
    });
}, function () {
    $(this).fadeOut(0, function () {
        $(this).attr('src', 'icons/resume.png');
        $(this).fadeIn(500);
    });
});

document.getElementById('resume').addEventListener('click', function() {
    const link = document.createElement('a');
    link.href = 'docs/resume.pdf';
    link.download = 'NoahStewartResume.pdf'; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});