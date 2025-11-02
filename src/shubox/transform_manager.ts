// src/shubox/transform_manager.ts

export class ShuboxTransformManager {
  hasTransforms(transforms: Record<string, any> | undefined): boolean {
    return !!transforms && Object.keys(transforms).length > 0;
  }

  getTransformVariants(transforms: Record<string, any>): string[] {
    return Object.keys(transforms);
  }
}
