import type { ITemplateData } from '~/shubox/config/types'
import { insertAtCursor as insertAtCursorUtil } from '~/shubox/insert_at_cursor'

/**
 * Handles DOM manipulation and template rendering for Shubox.
 * Provides methods for interpolating templates and inserting content into elements.
 */
export class ShuboxDomRenderer {
  /**
   * Interpolates template variables with data values.
   * Replaces {{variableName}} placeholders with corresponding data values.
   * @param template - Template string with {{variable}} placeholders
   * @param data - Object containing values to interpolate
   * @returns Interpolated string with placeholders replaced
   */
  interpolate(template: string, data: ITemplateData): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key]?.toString() || ''
    })
  }

  /**
   * Inserts text at the current cursor position in a form element.
   * @param element - Input or textarea element
   * @param text - Text to insert at cursor position
   */
  insertAtCursor(element: HTMLInputElement | HTMLTextAreaElement, text: string): void {
    insertAtCursorUtil(element, text)
  }

  /**
   * Inserts an interpolated template into a DOM element.
   * Handles different text behaviors (replace, append, insertAtCursor) and
   * element types (form elements vs regular elements).
   * @param element - Target DOM element
   * @param template - Template string with {{variable}} placeholders
   * @param data - Object containing values to interpolate
   * @param textBehavior - How to insert text: 'replace', 'append', or 'insertAtCursor'
   */
  insertTemplate(
    element: HTMLElement,
    template: string,
    data: ITemplateData,
    textBehavior: 'replace' | 'append' | 'insertAtCursor' = 'replace'
  ): void {
    const interpolated = this.interpolate(template, data)

    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      if (textBehavior === 'append') {
        element.value += interpolated
      } else if (textBehavior === 'insertAtCursor') {
        this.insertAtCursor(element, interpolated)
      } else {
        element.value = interpolated
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
