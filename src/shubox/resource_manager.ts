// src/shubox/resource_manager.ts
export class ShuboxResourceManager {
  constructor(private element: HTMLElement) {}

  cleanupFile(file: any): void {
    // Clear retry timeout
    if (file._shuboxRetryTimeout) {
      clearTimeout(file._shuboxRetryTimeout);
      delete file._shuboxRetryTimeout;
    }

    // Reset retry count
    delete file._shuboxRetryCount;

    // Remove error class
    this.element.classList.remove('shubox-error');
  }

  resetProgress(file: any): void {
    delete this.element.dataset.shuboxProgress;
  }

  onFileCanceled(file: any): void {
    this.cleanupFile(file);
  }

  onFileRemoved(file: any): void {
    this.cleanupFile(file);
  }

  onQueueComplete(): void {
    // No action needed in basic implementation
  }
}
