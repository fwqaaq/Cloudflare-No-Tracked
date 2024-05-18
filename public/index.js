/**@type {HTMLInputElement}*/
const textInput = document.getElementById('textInput')
const formWrapper = document.getElementById('form-wrapper')
const inputGroup = document.querySelector('.input-group')
/** @type {HTMLButtonElement}*/
const buttonSubmit = document.getElementById('button-submit')

formWrapper.addEventListener('submit', e => {
  e.preventDefault()

  const content = textInput.value
  if (content === '')
    return (inputGroup.innerHTML = '<p class="text-red">Please enter the tracked link</p>')

  // get the real link
  const reg = /[\w\\W]*?(https?:\/\/(?:b23.tv|xhslink.com)\/[a-zA-Z0-9]*)[\w\W]*?/
  const link = reg.exec(content)?.[1]

  if (!link)
    return (inputGroup.innerHTML =
      '<p class="text-red">Please enter the b23.tv or xhslink.com link</p>')

  fetch(`/api/tracked?value=${link}`)
    .then(res => {
      buttonSubmit.style.cursor = 'not-allowed'
      if (!res.ok)
        return (inputGroup.innerHTML =
          '<p class="text-red">Please enter the full b23.tv or xhslink.com link</p>')
      return res.text()
    })
    .then(url => {
      buttonSubmit.style.cursor = 'pointer'
      inputGroup.innerHTML = `<input class="input-text input-size" type="text" value="${url}" />
        <div>
          <button class="button button-copy input-size" onclick="copyToClipboard('${url}')">COPY</button>
        </div>`
    })
})

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    alert('Failed to copy!')
  }
}
