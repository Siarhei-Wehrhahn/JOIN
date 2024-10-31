function onloadFunc() {
    const overlay = document.getElementById('overlay');
    
    overlay.innerHTML = `
        <img src="../assets/icon/Capa 1.svg" alt="logo" id="logo">
    `;

    overlay.classList.remove('hidden_overlay');
    
    const logo = document.getElementById('logo');
    logo.classList.add('animate');

    setTimeout(() => {
        overlay.classList.add('hidden_overlay');
    }, 1000); 
}
