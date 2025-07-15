// Hamburger menu scripts
document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.querySelector(".hamburger");
    const tabs = document.querySelector(".tabs");
    const tabLinks = document.querySelectorAll(".tab-link");
    const sections = document.querySelectorAll("section");

    // Toggle menu
    hamburger.addEventListener("click", (e) => {
        e.stopPropagation();
        tabs.classList.toggle("show");
        const expanded = hamburger.getAttribute("aria-expanded") === "true";
        hamburger.setAttribute("aria-expanded", !expanded);
    });

    // Close on outside click
    document.addEventListener("click", function (event) {
        const isClickInside = tabs.contains(event.target) || hamburger.contains(event.target);
        if (!isClickInside && tabs.classList.contains("show")) {
            tabs.classList.remove("show");
            hamburger.setAttribute("aria-expanded", "false");
        }
    });

    
});	

// Mobile tab navigation
	document.querySelectorAll(".tab-link").forEach(link => {
		link.addEventListener("click", function(e) {
			e.preventDefault();

			// Check if viewport width is mobile size (e.g., 768px or less)
			if (window.innerWidth <= 768) {
				var tab = this.dataset.tab;
				if(tab === "home") {
					tab = "index";
				}
				const pageUrl = tab + ".html";
				window.location.href = pageUrl;
			} else {
			// For larger screens, you can keep existing behavior, e.g.:
			// Maybe just scroll to the section or do nothing
			// Or you can remove e.preventDefault() here if you want normal anchor behavior
			}
		});
		});