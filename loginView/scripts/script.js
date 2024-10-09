const signUp = () => {
    const signUpText1 = document.getElementById('dNonen1');
    const signUpText2 = document.getElementById('dNonen2');
    const loginWindowId = document.getElementById('loginWindowId');
    const registerWindowId = document.getElementById('registerWindowId');

    signUpText1.classList.toggle('d_none');
    signUpText2.classList.toggle('d_none');
    loginWindowId.classList.toggle('d_none');
    registerWindowId.classList.toggle('d_none');
}