import type { ITemplateData } from '~/shubox/config/types'
import { insertAtCursor as insertAtCursorUtil } from '~/shubox/insert_at_cursor'

export class ShuboxDomRenderer {
  interpolate(template: string, data: ITemplateData): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key]?.toString() || ''
    })
  }

  insertAtCursor(element: HTMLInputElement | HTMLTextAreaElement, text: string): void {
    insertAtCursorUtil(element, text)
  }

  insertTemplate(
    element: HTMLElement,
    template: string,
    data: ITemplateData,
    textBehavior: 'replace' | 'append' = 'replace'
  ): void {
    const interpolated = this.interpolate(template, data)

    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      if (textBehavior === 'append') {
        element.value += interpolated
      } else {
        this.insertAtCursor(element, interpolated)
      }
    } else {
      if (textBehavior === 'append') {
        element.textContent += interpolated
      } else {
        element.textContent = interpolated
      }
    }
  }
}
