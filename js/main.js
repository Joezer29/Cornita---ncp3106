// Header Scroll (keep navbar visible, apply blur/shrink on scroll)
let nav = document.querySelector(".navbar");

window.addEventListener("scroll", function () {
    const currentScroll = window.pageYOffset;

    if (document.documentElement.scrollTop > 20 || currentScroll > 20) {
        nav.classList.add("header-scrolled");
    } else {
        nav.classList.remove("header-scrolled");
    }
});

// nav hide 
let navBar = document.querySelectorAll(".nav-link");
let navCollapse = document.querySelector(".navbar-collapse.collapse");
navBar.forEach(function (a){
    a.addEventListener("click", function(){
        navCollapse.classList.remove("show");
    })
})
 


