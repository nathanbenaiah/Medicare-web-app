// Function to set active menu item based on current page
document.addEventListener('DOMContentLoaded', function() {
    // Get current page path
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop() || 'index.html';

    // Get all menu items
    const menuItems = document.querySelectorAll('.menu-item');

    // Remove active class from all items
    menuItems.forEach(item => item.classList.remove('active'));

    // Add active class to current page's menu item
    menuItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === pageName) {
            item.classList.add('active');
        }
    });
}); 