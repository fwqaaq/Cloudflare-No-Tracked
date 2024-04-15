const headers = {
  'content-type': 'text/plain',
}

export default {
  /**
   *
   * @param {import("@cloudflare/workers-types").Request} request
   * @param {*} env
   * @param {import("@cloudflare/workers-types").ExecutionContext} ctx
   * @returns
   */
  async fetch(request, _env, _ctx) {
    const tracked = new URL(request.url)
    if (tracked.pathname === '/') {
      return new Response(
        `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>No tracked link for bilibili and xhs</title>
  <style>
    .text-center {
      text-align: center;
    }

    .text-gray {
      color: #b1bac0;
    }

    .text-red {
      color: #dc3545;
    }

    hr {
      margin-block: 1rem;
      border: 0;
      border-top: 1px solid rgba(0, 0, 0, .1);
    }

    * {
      margin: 0%;
      padding: 0%;
    }

    body {
      background-color: #cfdae4;
      font-family: system-ui, —apple-system, Segoe UI, Rototo, Emoji, Helvetica, Arial, sans-serif;
    }

    .container {
      max-width: 40rem;
      background-color: #fff;
      padding-block: 2rem;
      margin: 4rem auto;
      border-radius: 1rem;
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    }

    .input-wrapper {
      display: flex;
      justify-content: center;
      margin: 0 2rem;
      align-items: center;
    }

    .input-size {
      padding: .375rem .75rem;
      line-height: 1.5;
    }

    .input-text {
      display: block;
      width: 100%;
      caret-color: #01d0ff;
    }

    .button-submit {
      background-color: #007BFF;
      color: #fff;
    }

    .button {
      border: none;
      margin-inline-start: 1rem;
      border-radius: .25rem;
      cursor: pointer;
    }

    .button-submit:hover {
      background-color: #1067c5;
    }

    .button-copy:hover {
      background-color: #495057;
    }

    .input-group {
      display: flex;
      align-items: stretch;
      margin: 0 2rem;
    }
  </style>
</head>

<body>
  <div class="container">
    <h1 class="text-center">Cloudflare No-Tracked Hosting</h1>
    <p class="text-center text-gray">Prevent bilibili and xhs from tracking links</p>
    <hr />

    <form class="input-wrapper" id="form-wrapper">
      <input class="input-text input-size" placeholder="请输入带有跟踪链接的文本" type="text" id="textInput">
      <button class="button button-submit input-size" type="submit" id="button-submit">SUBMIT</button>
    </form>

    <hr />

    <div class="input-group"></div>

    <p style="padding-block-start: 1rem;" class="text-center"><a
        href="https://github.com/fwqaaq/Cloudflare-No-Tracked">GitHub</a></p>
  </div>
  <script>
    /**
     * @type {HTMLInputElement}
     */
    const textInput = document.getElementById('textInput')
    const formWrapper = document.getElementById('form-wrapper')
    const inputGroup = document.querySelector('.input-group')
    /**
     * @type {HTMLButtonElement}
     */
    const buttonSubmit = document.getElementById('button-submit')

    formWrapper.addEventListener('submit', (e) => {
      e.preventDefault()

      const content = textInput.value
      if (content === '') return inputGroup.innerHTML = '<p class="text-red">Please enter the tracked link</p>'

      // get the real link
      const reg = /[\\w\\W]*?(https?:\\/\\/(?:b23.tv|xhslink.com)\\/[a-zA-Z0-9]*)[\\w\\W]*?/
      const link = reg.exec(content)?.[1]

      if (!link) return inputGroup.innerHTML = '<p class="text-red">Please enter the b23.tv or xhslink.com link</p>'

			fetch(\`/api/tracked?value=\${link}\`)
			.then(res => {
				buttonSubmit.style.cursor = 'not-allowed'
				if (!res.ok) return inputGroup.innerHTML = '<p class="text-red">Please enter the full b23.tv or xhslink.com link</p>'
				return res.text()
			})
			.then(url => {
        buttonSubmit.style.cursor = 'pointer'
        inputGroup.innerHTML = \`<input class="input-text input-size" type="text" value="\${url}" />
        <div>
          <button class="button button-copy input-size" onclick="copyToClipboard('\${url}')">COPY</button>
        </div>\`
      })
    })
    async function copyToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text)
      } catch (err) {
        alert('Failed to copy!')
      }
    }

  </script>
</body>

</html>`,
        { headers: { 'content-type': 'text/html' } }
      )
    }

    if (tracked.pathname === '/api/tracked') {
      const value = tracked.searchParams.get('value')
      if (!value || !(value.includes('b23.tv') || value.includes('xhslink.com')))
        return new Response('请发送带有正确跟踪短链的参数', { headers, status: 404 })

      const res = await fetch(value, { redirect: 'manual' })
      const location = res.headers.get('location') ?? null
      if (!location)
        return new Response('没有完整的跟踪链接，请查找输入是否正确', { headers, status: 404 })
      const source = new URL(location)
      return new Response(source.origin + source.pathname, { headers })
    }

    return new Response('404', { headers })
  },
}
