export interface ShuboxFile {
  s3url: string
}

export class Variant {
  success: boolean = false
  s3url: string = ""
  variant: string = ""

  constructor(file: ShuboxFile, variant: string = "") {
    this.s3url = file.s3url
    this.variant = variant
  }

  url(){
    let variant = this.variant
      .replace(/\#$/, "_hash")
      .replace(/\^$/, "_carat")
      .replace(/\!$/, "_bang")

    var filename = this.s3url.substring(this.s3url.lastIndexOf('/') + 1)
    var variantFilename = `${variant}_${filename.replace(/\+/g, '%2B')}`

    return(this.s3url.replace(filename, variantFilename))
  }
}
