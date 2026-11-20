(function () {
    var pages = [
        { title: "Home", href: "website.html", keywords: "home sarah williams museum consultant exhibit design collection management" },
        { title: "Museum Exhibits", href: "museumExhibits.html", keywords: "museum exhibits works displays" },
        { title: "Completed Projects", href: "completedProjects.html", keywords: "completed projects finished exhibits" },
        { title: "In Progress Projects", href: "inProgressProjects.html", keywords: "in progress projects current exhibits" },
        { title: "Collection Management", href: "collectionManagement.html", keywords: "collection management artifacts accessioning cataloging" },
        { title: "Swansboro Heritage", href: "swansboroHeritage.html", keywords: "swansboro heritage historical association collection" },
        { title: "More", href: "more.html", keywords: "more about sarah williams resume biography" },
        { title: "Client List", href: "clientList.html", keywords: "client list museums cultural institutions" },
        { title: "Contact Me", href: "contactMe.html", keywords: "contact me email connect" }
    ];

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    function matches(page, query) {
        var haystack = normalize(page.title + " " + page.keywords);
        return query.split(/\s+/).every(function (word) {
            return haystack.indexOf(word) !== -1;
        });
    }

    function findPages(query) {
        query = normalize(query);
        if (!query) {
            return [];
        }
        return pages.filter(function (page) {
            return matches(page, query);
        });
    }

    function setup(searchbar) {
        var input = searchbar.querySelector(".searchbar-input");
        var button = searchbar.querySelector(".searchbar-button");
        var results = searchbar.querySelector(".search-results");
        if (!input || !button || !results) {
            return;
        }

        function openSearch() {
            searchbar.classList.add("is-open");
            input.focus();
        }

        function closeSearch() {
            if (document.activeElement === input || searchbar.contains(document.activeElement)) {
                return;
            }
            if (!input.value) {
                searchbar.classList.remove("is-open");
            }
            results.hidden = true;
            results.innerHTML = "";
        }

        function render(hits) {
            results.innerHTML = "";
            if (!input.value.trim()) {
                results.hidden = true;
                return;
            }
            if (!hits.length) {
                var empty = document.createElement("p");
                empty.className = "search-empty";
                empty.textContent = "No matching pages";
                results.appendChild(empty);
                results.hidden = false;
                return;
            }
            hits.forEach(function (page) {
                var link = document.createElement("a");
                link.href = page.href;
                link.textContent = page.title;
                results.appendChild(link);
            });
            results.hidden = false;
        }

        function goToFirstMatch() {
            var hits = findPages(input.value);
            render(hits);
            if (hits.length) {
                window.location.href = hits[0].href;
            }
        }

        searchbar.addEventListener("submit", function (event) {
            event.preventDefault();
            goToFirstMatch();
        });

        button.addEventListener("click", function () {
            if (!searchbar.classList.contains("is-open")) {
                openSearch();
                return;
            }
            if (input.value.trim()) {
                goToFirstMatch();
                return;
            }
            input.focus();
        });

        input.addEventListener("input", function () {
            render(findPages(input.value));
        });

        input.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                goToFirstMatch();
            }
            if (event.key === "Escape") {
                input.value = "";
                results.hidden = true;
                results.innerHTML = "";
                searchbar.classList.remove("is-open");
                input.blur();
            }
        });

        document.addEventListener("click", function (event) {
            if (!searchbar.contains(event.target)) {
                closeSearch();
            }
        });
    }

    function init() {
        document.querySelectorAll(".searchbar").forEach(setup);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
