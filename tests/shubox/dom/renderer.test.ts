/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { ShuboxDomRenderer } from '~/shubox/dom/renderer'

describe('ShuboxDomRenderer', () => {
  let renderer: ShuboxDomRenderer

  beforeEach(() => {
    renderer = new ShuboxDomRenderer()
  })

  describe('interpolate', () => {
    it('replaces template variables with data values', () => {
      const template = 'File: {{name}}, Size: {{size}}'
      const data = { name: 'test.jpg', size: 1024 }

      const result = renderer.interpolate(template, data)

      expect(result).toBe('File: test.jpg, Size: 1024')
    })

    it('handles missing variables gracefully', () => {
      const template = 'URL: {{s3url}}'
      const data = {}

      const result = renderer.interpolate(template, data)

      expect(result).toBe('URL: ')
    })

    it('preserves unmatched template syntax', () => {
      const template = 'Keep {{this}} but not {{that}}'
      const data = { that: 'replaced' }

      const result = renderer.interpolate(template, data)

      expect(result).toBe('Keep  but not replaced')
    })
  })

  describe('insertAtCursor', () => {
    it('inserts text at cursor position in input element', () => {
      document.body.innerHTML = '<input type="text" id="test" value="Hello World" />'
      const input = document.getElementById('test') as HTMLInputElement
      input.setSelectionRange(5, 5) // After "Hello"

      renderer.insertAtCursor(input, ' there')

      expect(input.value).toBe('Hello there World')
    })

    it('replaces selected text', () => {
      document.body.innerHTML = '<input type="text" id="test" value="Hello World" />'
      const input = document.getElementById('test') as HTMLInputElement
      input.setSelectionRange(0, 5) // "Hello" selected

      renderer.insertAtCursor(input, 'Hi')

      expect(input.value).toBe('Hi World')
    })
  })

  describe('insertTemplate', () => {
    it('inserts interpolated template into element based on text behavior', () => {
      document.body.innerHTML = '<div id="target">Original</div>'
      const element = document.getElementById('target') as HTMLElement

      renderer.insertTemplate(element, '{{s3url}}', { s3url: 'https://example.com/file.jpg' }, 'replace')

      expect(element.textContent).toBe('https://example.com/file.jpg')
    })

    it('appends to element when textBehavior is append', () => {
      document.body.innerHTML = '<div id="target">Original</div>'
      const element = document.getElementById('target') as HTMLElement

      renderer.insertTemplate(element, ' {{s3url}}', { s3url: 'https://example.com/file.jpg' }, 'append')

      expect(element.textContent).toBe('Original https://example.com/file.jpg')
    })
  })
})
