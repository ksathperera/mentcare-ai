  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      link.focus();
    });
  });

  document.addEventListener("DOMContentLoaded", function () {
    const menuBars = document.getElementById("menu-bars");
    const closeIcon = document.getElementById("close-icon");
    const nav = document.querySelector("nav");

    function openNav() {
      if (window.innerWidth <= 845) {
        menuBars.style.display = "none";
      }
    }

    function closeNav() {
      nav.style.transform = "translateX(-100%)";
      menuBars.style.display = "block";
    }

    menuBars.addEventListener("click", openNav);
    closeIcon.addEventListener("click", closeNav);

    document.addEventListener("click", function (event) {
      if (
        nav.style.transform === "translateX(0%)" &&
        !nav.contains(event.target) &&
        event.target !== menuBars
      ) {
        closeNav();
      }
    });
  });

  // Accordion functionality
  const accordionItems = document.querySelectorAll(".accordion-item");

  accordionItems.forEach((item) => {
    const title = item.querySelector(".accordion-title");
    const content = item.querySelector(".accordion-content");

    title.addEventListener("click", () => {
      accordionItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("active");
          otherItem.querySelector(".accordion-content").style.maxHeight = "0";
        }
      });

      item.classList.toggle("active");

      if (item.classList.contains("active")) {
        content.style.maxHeight = content.scrollHeight + "px";
      } else {
        content.style.maxHeight = "0";
      }
    });
  });

  // Enhanced Search functionality
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");
  let searchableElements = [];
  let searchIndex = [];

  // Build search index on page load
  function buildSearchIndex() {
    const elements = document.querySelectorAll(".searchable-element");
    searchableElements = Array.from(elements);
    
    searchableElements.forEach((element, index) => {
      const text = element.textContent.toLowerCase();
      const section = element.closest('section')?.id || 'general';
      const title = element.querySelector('h1, h2, h3')?.textContent || '';
      
      searchIndex.push({
        element: element,
        text: text,
        section: section,
        title: title,
        index: index
      });
    });
  }

  // Enhanced search function with live results
  function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
      hideSearchResults();
      showAllElements();
      return;
    }

    const results = searchIndex.filter(item => 
      item.text.includes(searchTerm)
    ).slice(0, 8); // Limit to 8 results

    displaySearchResults(results, searchTerm);
    filterElements(results);
  }

  // Display search results dropdown
  function displaySearchResults(results, searchTerm) {
    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
    } else {
      searchResults.innerHTML = results.map(result => {
        const snippet = getSnippet(result.text, searchTerm);
        const sectionName = getSectionName(result.section);
        
        return `
          <div class="search-result-item" onclick="navigateToElement(${result.index})">
            <div class="search-result-title">${result.title || sectionName}</div>
            <div class="search-result-snippet">${snippet}</div>
          </div>
        `;
      }).join('');
    }
    
    searchResults.style.display = 'block';
  }

  function getSnippet(text, searchTerm) {
    const index = text.indexOf(searchTerm);
    if (index === -1) return text.substring(0, 100) + '...';
    
    const start = Math.max(0, index - 50);
    const end = Math.min(text.length, index + searchTerm.length + 50);
    let snippet = text.substring(start, end);
    
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';
    
    // Highlight search term
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    snippet = snippet.replace(regex, '<span class="search-highlight">$1</span>');
    
    return snippet;
  }

  function getSectionName(sectionId) {
    const sectionNames = {
      'home': 'Home',
      'features': 'Features',
      'domain': 'Domain',
      'milestones': 'Milestones',
      'documents': 'Documents',
      'slides': 'Slides',
      'team': 'Team',
      'contact': 'Contact'
    };
    return sectionNames[sectionId] || 'General';
  }

  // Navigate to specific element
  function navigateToElement(index) {
    const element = searchableElements[index];
    const section = element.closest('section');
    
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Highlight the element temporarily
      element.style.backgroundColor = '#fef3c7';
      setTimeout(() => {
        element.style.backgroundColor = '';
      }, 2000);
    }
    
    hideSearchResults();
  }

  // Filter elements based on search results
  function filterElements(results) {
    const visibleElements = new Set(results.map(r => r.element));
    
    searchableElements.forEach(element => {
      if (visibleElements.has(element)) {
        element.style.display = '';
        element.classList.remove('hidden');
      } else {
        element.classList.add('hidden');
      }
    });
  }

  // Show all elements
  function showAllElements() {
    searchableElements.forEach(element => {
      element.style.display = '';
      element.classList.remove('hidden');
    });
  }

  // Hide search results dropdown
  function hideSearchResults() {
    searchResults.style.display = 'none';
  }

  // Event listeners for search
  searchInput.addEventListener("input", performSearch);
  
  // Hide results when clicking outside
  document.addEventListener('click', function(event) {
    if (!event.target.closest('.search')) {
      hideSearchResults();
    }
  });

  // Clear search on escape key
  searchInput.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      searchInput.value = '';
      hideSearchResults();
      showAllElements();
    }
  });

  // Contact form functionality
  document.getElementById("contact-form").addEventListener("submit", function (event) {
    event.preventDefault();
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var message = document.getElementById("message").value;

    if (name.trim() === "" || email.trim() === "" || message.trim() === "") {
      alert("Please fill in all the required fields.");
    } else {
      alert("Form submitted successfully!");
      document.getElementById("contact-form").reset();
    }
  });
document.addEventListener('DOMContentLoaded', buildSearchIndex);