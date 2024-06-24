document.addEventListener('DOMContentLoaded', function () {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const sidebar = document.getElementById('sidebar');
    const closeSidebar = document.getElementById('close-sidebar');
    const menuItems = document.getElementById('menu-items');
    const menuItemsSidebar = document.getElementById('menu-items-sidebar');

    hamburgerMenu.addEventListener('click', function () {
        sidebar.classList.toggle('active');
        menuItemsSidebar.innerHTML = menuItems.innerHTML;
        menuItems.innerHTML = "";
    });

    closeSidebar.addEventListener('click', function () {
        sidebar.classList.remove('active');
        menuItems.innerHTML = menuItemsSidebar.innerHTML;
        menuItemsSidebar.innerHTML = "";
    });
});
