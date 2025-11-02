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
}
