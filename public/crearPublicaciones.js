const inputImagenes = document.getElementById('imagenes')
const preview = document.getElementById('preview')
const container = document.getElementById('imagenesContainer')

inputImagenes.addEventListener('change', (e) => {
  const archivos = Array.from(e.target.files)

  preview.innerHTML = ''
  container.innerHTML = ''

  archivos.forEach((archivo, index) => {
    if (!archivo.type.startsWith('image/')) {
      alert('Solo se permiten imágenes')
      return
    }

    if (archivo.size > 5 * 1024 * 1024) {
      alert('Cada imagen debe pesar menos de 5MB')
      return
    }

    const reader = new FileReader()

    reader.onload = (event) => {
      const base64 = event.target.result

      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = 'imagenesBase64'   
      input.value = base64
      container.appendChild(input)

      const img = document.createElement('img')
      img.src = base64
      img.style.cssText = 'width:80px; height:80px; object-fit:cover; border-radius:8px;'
      preview.appendChild(img)
    }

    reader.readAsDataURL(archivo)
  })
})