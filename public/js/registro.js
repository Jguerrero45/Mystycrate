document.getElementById('correo').addEventListener('input', function () {
    console.log('Correo:', this.value);
    localStorage.setItem('Correo', this.value);});