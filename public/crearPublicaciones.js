const inputImagenes = document.getElementById('imagenes')
const preview = document.getElementById('preview')
const container = document.getElementById('imagenesContainer')

const MAX_ANCHO = 700
const CALIDAD = 0.5 

inputImagenes.addEventListener('change', (e) => {
  const archivos = Array.from(e.target.files)

  preview.innerHTML = ''
  container.innerHTML = ''

  archivos.forEach((archivo) => {
    if (!archivo.type.startsWith('image/')) {
      alert('Solo se permiten imágenes')
      return
    }

    const reader = new FileReader()

    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')

        let ancho = img.width
        let alto = img.height

        if (ancho > MAX_ANCHO) {
          alto = (alto * MAX_ANCHO) / ancho
          ancho = MAX_ANCHO
        }

        canvas.width = ancho
        canvas.height = alto

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, ancho, alto)


        const base64 = canvas.toDataURL('image/jpeg', CALIDAD)

        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = 'imagenesBase64'
        input.value = base64
        container.appendChild(input)

        const imgPreview = document.createElement('img')
        imgPreview.src = base64
        imgPreview.style.cssText = 'width:80px; height:80px; object-fit:cover; border-radius:8px;'
        preview.appendChild(imgPreview)
      }
      img.src = event.target.result
    }

    reader.readAsDataURL(archivo)
  })
})