(()=>{

  const menuButton = document.getElementById('mobile-menu-button');
  const menuContent = document.getElementById('hide-show-menu');
  const mainContent = document.getElementById('main-content');

  menuButton.addEventListener('click', toggleHide);
  mainContent.addEventListener('click', onlyHide);

  function toggleHide() {
    event.preventDefault();
    menuContent.classList.toggle('toggle-hidden');
  }

  function onlyHide() {
    event.preventDefault();
    menuContent.classList.add('toggle-hidden');
  }

})();