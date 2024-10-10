document.getElementById('login').addEventListener('submit', function (e) {
    e.preventDefault(); 

    //se capturan los datos
    const username = document.getElementById('email').value;
    const password = document.getElementById('contraseña').value;

    //colocamos las credenciales del ejemplo
    const adminUser = 'admin';
    const adminPass = 'Admin123';

    // Verificamos las credenciales
    if (username === adminUser && password === adminPass) {
        console.log('Inicio de sesión exitoso');
        // Redirigir a la página de inicio
        window.location.href = 'src/pages/admin/home.html'; 
    } else {
        alert('Credenciales incorrectas. Intenta de nuevo.'); // Mensaje de error
        console.log('Credenciales incorrectas');
    }
});
