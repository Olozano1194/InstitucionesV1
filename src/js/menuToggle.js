const menuToggle = document.getElementById('menu-toogle');
const sidebar = document.getElementById('sidebar');
//const mainContent = document.getElementById('main-content');

menuToggle.addEventListener('click', () => {
    if (sidebar.classList.contains('-left-full')) {
        sidebar.classList.remove('-left-full');
        sidebar.classList.add('-left-0');
        //mainContent.classList.add('ml-[60%]');
        
    }else {
        sidebar.classList.remove('-left-0');
        sidebar.classList.add('-left-full');
        //mainContent.classList.remove('ml-[60%]');
        
    }

});