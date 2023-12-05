function Register() {
  event.preventDefault();

  var nombres = document.querySelector('input[type="text"]').value;
  var correo = document.querySelector('input[type="email"]').value;
  var contraseña = document.querySelector('input[type="password"]').value;
  console.log(nombres, correo, contraseña);

  fetch('http://127.0.0.1:80/registrar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nombres, correo, contraseña }),
  })
    .then(response => response.text())
    .then(data => {
      console.log(data);
      // Mostrar alerta de registro exitoso
      if (data === 'Registro completado') {
        document.getElementById('registroExitoso').style.display = 'block';
        // Redirigir a la página de inicio de sesión después de 3 segundos
        setTimeout(() => {
          window.location.href = '/InicioDeSesion.html';
        }, 3000);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function iniciarSesion() {
  event.preventDefault();

  var correo = document.querySelector('input[type="email"]').value;
  var contraseña = document.querySelector('input[type="password"]').value;

  fetch('http://127.0.0.1:80/loginsesion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ correo, contraseña }),
  })
    .then(response => response.text())
    .then(data => {
      console.log(data);
      // Mostrar mensaje de login correcto
      if (data === 'LOGIN CORRECTO') {
        alert('Login correcto');
        // Redirigir a la página de inicio después del login
        window.location.href = '/index.html';
      } else {
        alert('Usuario y/o contraseña incorrecta');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}


