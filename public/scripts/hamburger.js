document.addEventListener('DOMContentLoaded', function () {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const sidebar = document.getElementById('sidebar');
    const closeSidebar = document.getElementById('close-sidebar');

    hamburgerMenu.addEventListener('click', function () {
        sidebar.classList.toggle('active');
    });

    closeSidebar.addEventListener('click', function () {
        sidebar.classList.remove('active');
    });
});
