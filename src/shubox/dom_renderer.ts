// src/shubox/dom_renderer.ts
export class ShuboxDomRenderer {
  constructor(private element: HTMLElement) {}

  setUploadingState(): void {
    this.element.classList.add('shubox-uploading');
  }

  setSuccessState(): void {
    this.element.classList.add('shubox-success');
    this.element.classList.remove('shubox-uploading');
  }

  setErrorState(): void {
    this.element.classList.add('shubox-error');
    this.element.classList.remove('shubox-uploading');
  }

  clearErrorState(): void {
    this.element.classList.remove('shubox-error');
  }

  clearSuccessState(): void {
    this.element.classList.remove('shubox-success');
  }

  setOfflineState(): void {
    this.element.classList.add('shubox-offline');
  }

  clearOfflineState(): void {
    this.element.classList.remove('shubox-offline');
  }

  setProgress(progress: number): void {
    this.element.dataset.shuboxProgress = String(progress);
  }

  clearProgress(): void {
    delete this.element.dataset.shuboxProgress;
  }

  updateFormValue(
    element: HTMLElement,
    value: string,
    replaceables: string[],
    textBehavior: string = 'replace',
    interpolations: Record<string, string> = {}
  ): void {
    if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) {
      return;
    }

    // Interpolate template variables
    let interpolatedValue = value;
    for (const [key, val] of Object.entries(interpolations)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      interpolatedValue = interpolatedValue.replace(regex, val);
    }

    if (textBehavior === 'append') {
      element.value += interpolatedValue;
    } else {
      element.value = interpolatedValue;
    }
  }
}
