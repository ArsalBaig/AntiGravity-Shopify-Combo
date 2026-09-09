/**
 * Shopify Collection Page JavaScript (WizVape UX Inspiration)
 * Pure Vanilla JavaScript with AJAX Facet Filtering, Sorting, and Accessible Drawer
 */

(() => {
  'use strict';

  class CollectionManager {
    constructor() {
      this.init();
    }

    init() {
      this.initDrawer();
      this.initSorting();
      this.initAjaxFiltering();
      this.initHistoryNavigation();
    }

    /* -------------------------------------------------------------------------- */
    /* Filter Drawer & Focus Management                                           */
    /* -------------------------------------------------------------------------- */
    initDrawer() {
      const openBtn = document.getElementById('FacetsDrawerOpen');
      const closeBtn = document.getElementById('FacetsDrawerClose') || document.getElementById('FiltersSidebarClose');
      const overlay = document.getElementById('FacetsDrawerOverlay') || document.getElementById('FiltersSidebarOverlay');
      const container = document.getElementById('FacetsDrawerContainer') || document.getElementById('FiltersSidebar');
      const drawer = document.getElementById('FacetsDrawer') || document.getElementById('FiltersSidebar');

      if (!openBtn || !container) return;

      this.closeDrawer = () => {
        container.classList.remove('is-open');
        container.setAttribute('aria-hidden', 'true');
        if (overlay) overlay.classList.remove('is-open');
        openBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        openBtn.focus();
      };

      this.openDrawer = () => {
        container.classList.add('is-open');
        container.setAttribute('aria-hidden', 'false');
        if (overlay) overlay.classList.add('is-open');
        openBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        if (closeBtn) closeBtn.focus();
      };

      openBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openDrawer();
      });

      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.closeDrawer();
        });
      }

      if (overlay) {
        overlay.addEventListener('click', (e) => {
          e.preventDefault();
          this.closeDrawer();
        });
      }

      // Keyboard Trap & Escape handler
      document.addEventListener('keydown', (e) => {
        if (!container.classList.contains('is-open')) return;

        if (e.key === 'Escape') {
          this.closeDrawer();
          return;
        }

        if (e.key === 'Tab' && drawer) {
          const focusable = drawer.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusable.length === 0) return;

          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      });
    }

    /* -------------------------------------------------------------------------- */
    /* Sorting Handler                                                            */
    /* -------------------------------------------------------------------------- */
    initSorting() {
      const sortSelect = document.getElementById('SortBy') || document.getElementById('SortBySelect');
      if (!sortSelect) return;

      sortSelect.addEventListener('change', (e) => {
        const sortValue = e.target.value;
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('sort_by', sortValue);
        // Reset page to 1 when changing sorting
        currentUrl.searchParams.delete('page');

        this.fetchCollection(currentUrl.toString());
      });
    }

    /* -------------------------------------------------------------------------- */
    /* AJAX Filtering & Pagination                                                */
    /* -------------------------------------------------------------------------- */
    initAjaxFiltering() {
      const filterForm = document.getElementById('FacetsFilterForm');

      if (filterForm) {
        // Handle filter form submit
        filterForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const formData = new FormData(filterForm);
          const searchParams = new URLSearchParams(formData);

          // Ensure sort_by is preserved from the SortBy select if present
          const sortSelect = document.getElementById('SortBy') || document.getElementById('SortBySelect');
          if (sortSelect && !searchParams.has('sort_by')) {
            searchParams.set('sort_by', sortSelect.value);
          }

          const actionUrl = filterForm.getAttribute('action') || window.location.pathname;
          const url = `${actionUrl}?${searchParams.toString()}`;

          this.fetchCollection(url);
          if (this.closeDrawer) this.closeDrawer();
        });

        // Instant filter change on checkbox toggles
        filterForm.addEventListener('change', (e) => {
          if (e.target.matches('input[type="checkbox"]')) {
            filterForm.dispatchEvent(new Event('submit', { cancelable: true }));
          }
        });

        // Debounced change on price range inputs
        let debounceTimer;
        filterForm.addEventListener('input', (e) => {
          if (e.target.matches('.facet-price__input')) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
              filterForm.dispatchEvent(new Event('submit', { cancelable: true }));
            }, 600);
          }
        });
      }

      // Delegate remove filter pills and pagination clicks
      document.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('[data-facet-remove]');
        if (removeBtn) {
          e.preventDefault();
          const url = removeBtn.getAttribute('href');
          if (url) {
            this.fetchCollection(url);
            if (this.closeDrawer) this.closeDrawer();
          }
          return;
        }

        const paginationLink = e.target.closest('[data-pagination-link]');
        if (paginationLink) {
          e.preventDefault();
          const url = paginationLink.getAttribute('href');
          if (url) {
            this.fetchCollection(url);
            // Smooth scroll to top of collection grid
            const gridContainer = document.getElementById('CollectionToolbar');
            if (gridContainer) {
              gridContainer.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }
      });
    }

    /* -------------------------------------------------------------------------- */
    /* Fetch and DOM Replacement                                                  */
    /* -------------------------------------------------------------------------- */
    async fetchCollection(url) {
      const gridContainer = document.getElementById('ProductGridContainer');
      if (gridContainer) {
        gridContainer.style.opacity = '0.4';
        gridContainer.style.pointerEvents = 'none';
      }

      try {
        const response = await fetch(url);
        if (!response.ok) {
          // Fallback to normal navigation
          window.location.href = url;
          return;
        }

        const htmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        // Replace product grid container
        const newGrid = doc.getElementById('ProductGridContainer');
        if (gridContainer && newGrid) {
          gridContainer.innerHTML = newGrid.innerHTML;
        }

        // Replace product count
        const currentCount = document.getElementById('CollectionProductCount');
        const newCount = doc.getElementById('CollectionProductCount');
        if (currentCount && newCount) {
          currentCount.innerHTML = newCount.innerHTML;
        }

        // Replace active facets / drawer
        const currentFacets = document.getElementById('FacetsWrapper');
        const newFacets = doc.getElementById('FacetsWrapper');
        if (currentFacets && newFacets) {
          currentFacets.innerHTML = newFacets.innerHTML;
        }

        // Replace sidebar filters if present
        const currentSidebar = document.getElementById('FiltersSidebar');
        const newSidebar = doc.getElementById('FiltersSidebar');
        if (currentSidebar && newSidebar) {
          currentSidebar.innerHTML = newSidebar.innerHTML;
        }

        // Update filter badge count
        const currentBadge = document.getElementById('FilterBadgeCount');
        const newBadge = doc.getElementById('FilterBadgeCount');
        const filterBtn = document.getElementById('FacetsDrawerOpen');
        if (filterBtn) {
          if (newBadge) {
            if (currentBadge) {
              currentBadge.textContent = newBadge.textContent;
            } else {
              filterBtn.appendChild(newBadge.cloneNode(true));
            }
          } else if (currentBadge) {
            currentBadge.remove();
          }
        }

        // Update Sort Select value
        const newSort = doc.getElementById('SortBy') || doc.getElementById('SortBySelect');
        const currentSort = document.getElementById('SortBy') || document.getElementById('SortBySelect');
        if (newSort && currentSort) {
          currentSort.value = newSort.value;
        }

        // Update Browser URL & History
        history.pushState({ url: url }, '', url);

        // Reconnect drawer close & overlay events inside newly swapped facets
        this.rebindDrawerEvents();

      } catch (error) {
        console.error('AJAX collection fetch failed, reloading page...', error);
        window.location.href = url;
      } finally {
        if (gridContainer) {
          gridContainer.style.opacity = '1';
          gridContainer.style.pointerEvents = '';
        }
      }
    }

    rebindDrawerEvents() {
      const closeBtn = document.getElementById('FacetsDrawerClose') || document.getElementById('FiltersSidebarClose');
      const overlay = document.getElementById('FacetsDrawerOverlay') || document.getElementById('FiltersSidebarOverlay');

      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.closeDrawer();
        });
      }

      if (overlay) {
        overlay.addEventListener('click', (e) => {
          e.preventDefault();
          this.closeDrawer();
        });
      }

      // Re-bind sort change listener if elements were replaced
      this.initSorting();

      // Reattach form submit & change on new form
      const filterForm = document.getElementById('FacetsFilterForm');
      if (filterForm) {
        filterForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const formData = new FormData(filterForm);
          const searchParams = new URLSearchParams(formData);
          const sortSelect = document.getElementById('SortBy') || document.getElementById('SortBySelect');
          if (sortSelect && !searchParams.has('sort_by')) {
            searchParams.set('sort_by', sortSelect.value);
          }
          const actionUrl = filterForm.getAttribute('action') || window.location.pathname;
          const url = `${actionUrl}?${searchParams.toString()}`;
          this.fetchCollection(url);
          this.closeDrawer();
        });

        filterForm.addEventListener('change', (e) => {
          if (e.target.matches('input[type="checkbox"]')) {
            filterForm.dispatchEvent(new Event('submit', { cancelable: true }));
          }
        });

        let debounceTimer;
        filterForm.addEventListener('input', (e) => {
          if (e.target.matches('.facet-price__input')) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
              filterForm.dispatchEvent(new Event('submit', { cancelable: true }));
            }, 600);
          }
        });
      }
    }

    /* -------------------------------------------------------------------------- */
    /* Browser Back/Forward Popstate                                              */
    /* -------------------------------------------------------------------------- */
    initHistoryNavigation() {
      window.addEventListener('popstate', (e) => {
        const url = (e.state && e.state.url) || window.location.href;
        this.fetchCollection(url);
      });
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new CollectionManager());
  } else {
    new CollectionManager();
  }
})();
