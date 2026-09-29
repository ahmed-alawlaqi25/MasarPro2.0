import { pdfTextLines } from './resumeImport.js'

export async function readResumePdf(file) {
  if (!file || !/\.pdf$/i.test(file.name) || (file.type && file.type !== 'application/pdf')) throw new Error('file')
  if (file.size > 5 * 1024 * 1024) throw new Error('size')
  const bytes = new Uint8Array(await file.arrayBuffer())
  if (!new TextDecoder().decode(bytes.slice(0, 1024)).includes('%PDF-')) throw new Error('file')
  const [pdfjs, worker] = await Promise.all([
    import('pdfjs-dist'), import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
  ])
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default
  const task = pdfjs.getDocument({ data: bytes, isEvalSupported: false })
  const timeout = setTimeout(() => { void task.destroy() }, 30000)
  try {
    const pdf = await task.promise
    if (pdf.numPages > 10) throw new Error('pages')
    const pages = []
    for (let number = 1; number <= pdf.numPages; number++) {
      const page = await pdf.getPage(number)
      const text = await page.getTextContent()
      pages.push(pdfTextLines(text.items))
      page.cleanup()
    }
    const result = pages.join('\n\n')
    if (result.length > 100000) throw new Error('length')
    if ((result.match(/\p{L}/gu) || []).length < 30) throw new Error('empty')
    return result
  } finally {
    clearTimeout(timeout)
    await task.destroy()
  }
}
