const fs = require('fs')
const { kebab, ensureDirExists } = require('./utils')

const htmlEscape = html => html.replace(/\&/g, '&amp;').replace(/\</g, '&lt;')

module.exports.buildIndexPage = function(output, library) {
  let html = `<html>
  <head>
    <title>Tailwind UI Components</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600&display=auto" rel="stylesheet">
    <link href="/css/app.css" rel="stylesheet" />
    <style>
      * { box-sizing: border-box; }
    </style>
  </head>

  <body class="font-sans antialiased text-gray-900">
    <main>
      <div class="max-w-8xl mx-auto grid grid-cols-1 gap-y-16 px-4 py-4 sm:px-6 sm:py-12 lg:px-8">
`
  Object.entries(library).forEach(([categoryName, category]) => {
    html += `
    <div id="${kebab(categoryName)}">
    <div class="pb-2">
    <div class="h-5"></div>
  </div>
    <h2 class="text-2xl leading-8 font-semibold tracking-tight font-display text-gray-900 sm:text-3xl sm:leading-9">
    ${categoryName}
  </h2>
  <div class="mt-6 grid grid-cols-1 gap-y-8">
  `
    Object.entries(category).forEach(([subCategoryName, subCategory]) => {
      html += `
      <div id="${kebab(categoryName)}-${kebab(
        subCategoryName,
      )}" class="border-t border-gray-200 pt-8 grid grid-cols-1 gap-y-6 lg:grid-cols-4 lg:gap-5">
        <div>
          <h3 class="text-lg leading-7 font-medium tracking-tight text-gray-900">
            ${subCategoryName}
          </h3>
        </div>
        <div class="grid grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-6 md:grid-cols-3 lg:col-span-3">`

      Object.entries(subCategory).forEach(([sectionName, section]) => {
        html += `
        <div class="border border-gray-300 rounded-md p-2">
          <a href="${section.url}" class="block group">
            <div>
              <p class="text-sm leading-5 font-medium text-gray-900">${sectionName}</p>
              <p class="text-sm leading-5 text-gray-500">${
                section.components.length
              } component${section.components.length === 1 ? '' : 's'}</p>
            </div>
            </a>
          </div>
          `
        buildSectionPage(
          output,
          categoryName,
          subCategoryName,
          sectionName,
          section,
        )
      })

      html += `
       </div>
      </div><!-- end sub-category ${subCategoryName} -->`
    })
    html += `
      </div>
    </div><!-- end category ${categoryName} -->
    `
  })
  html += `</main></body></html>`
  console.log(`📝  Writing index.html`)
  fs.writeFileSync(`${output}/preview/index.html`, html)
  ensureDirExists(`${output}/preview/css`)
  fs.copyFileSync('./css/app.css', `${output}/preview/css/app.css`)
}

const buildSectionPage = (
  output,
  categoryName,
  subCategoryName,
  sectionName,
  section,
) => {
  let html = `<html>
  <head>
    <title>Tailwind UI Components</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600&display=auto" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/highlightjs-themes@1.0.0/darkula.css" rel="stylesheet"/>
    <link href="/css/app.css" rel="stylesheet"/>
    <script src="https://cdn.jsdelivr.net/combine/npm/highlightjs@9.16.2/highlight.pack.min.js,npm/axios@0.19.2/dist/axios.min.js,npm/dlv@1.1.3/dist/dlv.umd.min.js,gh/alpinejs/alpine@v2.2.1/dist/alpine.js,npm/fuse.js@5.0.9-beta/dist/fuse.min.js"></script>    <script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.0.1/dist/alpine.js" defer></script>
    <style>
      * { box-sizing: border-box; }
      .hljs {
        background: #252f3f;
        color: white;
      }
      .hljs-tag {
        color: white;
      }
      .hljs-name {
        color: #ff8383;
      }
      .hljs-attr {
        color: #ffe484;
        font-style: italic;
      }
      .hljs-string {
        color: #b5f4a5;
      }
    </style>
  </head>

  <body class="font-sans antialiased text-gray-900">
<main>
<div class="py-4 sm:py-12">
  <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="pb-2">
      <nav class="flex items-center text-sm leading-5 font-medium">
        <a href="/#${kebab(
          categoryName,
        )}" class="text-gray-500 hover:text-gray-700 focus:outline-none focus:underline transition duration-150 ease-in-out">
          ${categoryName}
        </a>
        <svg class="flex-shrink-0 mx-2 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        </svg>
        <a href="/#${kebab(categoryName)}-${kebab(
    subCategoryName,
  )}" class="text-gray-500 hover:text-gray-700 focus:outline-none focus:underline transition duration-150 ease-in-out">
          ${subCategoryName}
        </a>
      </nav>
    </div>
    <h2 class="text-2xl leading-8 font-semibold font-display text-gray-900 sm:text-3xl sm:leading-9">
      ${sectionName}
    </h2>
  </div>
  <div class="mt-6 bg-white max-w-8xl mx-auto sm:px-6 lg:px-8">
    <div class="max-w-8xl mx-auto">
    `
  section.components.forEach(component => {
    const filePath = `${output}/html${component.url}`
    let code = htmlEscape(fs.readFileSync(filePath, 'utf-8'))

    html += `
    <div id="component-${
      component.hash
    }" x-data="{ activeTab: 'preview' }" class="border-b border-t border-gray-200 sm:border sm:rounded-lg overflow-hidden mb-16">
      <div class="px-4 py-2 border-b border-gray-200 flex justify-between items-center bg-white sm:py-4 sm:px-6 sm:items-baseline">
      <div class="flex-shrink min-w-0 flex items-center">
        <h3 class="flex-shrink min-w-0 font-regular text-base md:text-lg leading-snug truncate">
          <a href="#component-${component.hash}">${component.title}</a>
        </h3>
        ${
          component.hasAlpine
            ? '<a href="http://tailwindui.com/documentation#integrating-with-javascript-frameworks" class="ml-4 bg-pink-100 rounded-full px-2 py-0.5 flex items-center text-xs leading-4 tracking-wide uppercase font-semibold"><span class="text-pink-700">Requires JS</span></a>'
            : ''
        }
      </div>
      <div class="ml-4 flex flex-shrink-0 items-center">
        <div class="flex items-center text-sm sm:hidden">
          <button type="button" @click="activeTab === 'preview' ? (activeTab = 'code') : (activeTab = 'preview')" :class="{'bg-indigo-50 text-indigo-700': activeTab === 'code', 'text-gray-400 hover:text-gray-600 focus:text-gray-600': activeTab !== 'code'}" class="inline-block rounded-lg font-medium leading-none py-3 px-3 focus:outline-none text-gray-400 hover:text-gray-600 focus:text-gray-600">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>
        <div class="hidden sm:flex items-center text-sm md:text-base">
          <button type="button" @click="activeTab = 'preview'" :class="{'bg-indigo-50 text-indigo-700': activeTab === 'preview', 'text-gray-500 hover:text-indigo-600 focus:text-indigo-600': activeTab !== 'preview'}" class="inline-block rounded-lg font-medium leading-none py-2 px-3 focus:outline-none bg-indigo-50 text-indigo-700">
            Preview
          </button>
          <button type="button" @click="activeTab = 'code'" :class="{'bg-indigo-50 text-indigo-700': activeTab === 'code', 'text-gray-500 hover:text-indigo-600 focus:text-indigo-600': activeTab !== 'code'}" class="ml-2 inline-block rounded-lg font-medium leading-none py-2 px-3 focus:outline-none text-gray-500 hover:text-indigo-600 focus:text-indigo-600">
            Code
          </button>
          <textarea class="hidden">${code}</textarea>
        </div>
        <div class="hidden sm:flex sm:items-center">
          <div class="pl-4 pr-4 self-stretch">
            <div class="h-5 border-l border-gray-200"></div>
          </div>
          <button type="button" @click="$refs.clipboardCode.select(); document.execCommand('copy')" class="ml-3 text-gray-400 hover:text-gray-500">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <title>Copy</title>
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div class="relative bg-gray-500">
      <div :class="{ 'block': activeTab === 'preview', 'hidden': activeTab !== 'preview' }" class="block">
        <div x-data="resizableIFrame()" x-init="init()" x-ref="root" :style="'max-width: 100%; width: ' + width" class="sm:min-w-preview-mobile relative sm:pr-4" style="max-width: 100%; width: 100%">
          <iframe class="w-full" data-id="${component.hash}" src="${
      component.url
    }" style="height: 265px;"></iframe>
          <div :class="{ 'pointer-events-none': !resizing }" class="absolute opacity-0 inset-0 pointer-events-none"></div>
          <div x-ref="handle" style="cursor: ew-resize;" class="sr-only sm:not-sr-only sm:border-l sm:bg-gray-100 sm:absolute sm:right-0 sm:inset-y-0 sm:flex sm:items-center sm:w-4">
            <svg class="h-4 w-4 text-gray-600 pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5h2v14H8zM14 5h2v14h-2z"></path>
            </svg>
          </div>
        </div>
      </div>
      <div :class="{ 'block': activeTab === 'code', 'hidden': activeTab !== 'code' }" class="hidden">
        <pre class="block scrollbar-none m-0 p-0 overflow-auto text-white text-sm bg-gray-800 leading-normal"><code class="inline-block p-4 scrolling-touch subpixel-antialiased"></code></pre>
      </div>
    </div>
  </div>
      `
  })

  html += `
    </div>
  </div>
</div>
</main>
<script>
;(function() {
  const getDocHeight = doc => {
    doc = doc || document
    const body = doc.body
    const html = doc.documentElement
    const height = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight,
    )
    return height
  }

  window.resizableIFrame = function() {
    return {
      resizing: !1,
      width: '100%',
      init: function() {},
    }
  }
  const iframes = document.querySelectorAll('iframe')
  Array.from(iframes).forEach(iframe => {
    iframe.addEventListener('load', e => {
      const iframe = e.srcElement
      const doc = iframe.contentDocument || iframe.contentWindow.document
      doc.body.classList.add('antialiased', 'font-sans', 'bg-white')
      iframe.style.visibility = 'hidden'
      iframe.style.height = '10px'
      const height = Math.max(getDocHeight(doc), 256) + 'px'
      iframe.style.height = height
      iframe.style.visibility = 'visible'
      const container = iframe.parentElement.parentElement.parentElement
      const textarea = container.parentElement.querySelector('textarea')
      const html = textarea.innerText.trim()
      hljs.configure({ useBR: false, tabReplace: '  ' })
      const highlighted = hljs.highlight('html', html)
      const codeElem = container.children[1].querySelector('code')
      codeElem.innerHTML = highlighted.value
    })
  })
  Array.from(document.querySelectorAll('[x-ref=handle]')).forEach(
    function(handle, index) {
      handle.addEventListener('mousedown', createDragHandlers())
    },
  )

  function createDragHandlers() {
    return function(event) {
      // capture initial screenX
      var target = event.target
      var parent = target.parentElement
      var iframe = parent.childNodes[1]

      var screenX = event.screenX
      var moveListener = function(event) {
        event.stopPropagation()
        dragMoveListener(event, target, event.screenX - screenX)
      }
      var elements = [document, iframe.contentWindow]

      elements.forEach(e => {
        e.addEventListener('mousemove', moveListener)
        e.addEventListener('mouseup', cleanup)
      })

      function cleanup() {
        elements.forEach(e =>
          e.removeEventListener('mousemove', moveListener),
        )
      }
    }
  }
  function dragMoveListener(event, target, dx) {
    var parent = target.parentElement
    var iframe = parent.childNodes[1]
    var maxWidth = parent.offsetWidth - target.offsetWidth
    var width = Math.max(376, Math.min(maxWidth + dx, maxWidth))
    iframe.style.width = width + 'px'
    target.style.left = width + 'px'
  }
})()
</script>
</body>
</html>`
  console.log(`📝  Writing ${section.url}`)
  fs.writeFileSync(`${output}/preview${section.url}`, html)
}
