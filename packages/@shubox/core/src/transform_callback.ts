import {Variant} from './variant';

export interface ShuboxFile {
  s3url: string
  transforms: any
}

export class TransformCallback {
  file: ShuboxFile
  variant: string = ""
  variantUrl: string = ""
  callback: (file: ShuboxFile) => void
  retry: number = 10
  success: boolean = false

  constructor(file: ShuboxFile, variant: string = "", callback: (file: ShuboxFile) => void) {
    this.file = file
    this.variant = variant
    this.variantUrl = new Variant(file, variant).url()
    this.callback = callback
  }

  run = (error: any = null) => {
    let delay = Math.pow(2, 19 - this.retry) // 512, 1024, 2048, 4096 ...

    if(this.retry && !this.success) {
      this.retry -= 1

      setTimeout(() => {
        fetch(this.variantUrl, { method: 'HEAD' })
          .then(this.validateResponse)
          .catch(this.run)
      }, delay)
    }
  }

  validateResponse = (response: any) => {
    if (!response.ok) { throw Error(response.statusText) }

    this.success = true
    this.file.transforms = this.file.transforms ? this.file.transforms : {}
    this.file.transforms[this.variant] = { s3url: this.variantUrl }
    this.callback(this.file)

    return response
  }
}
