// src/shubox/transform_manager.ts
import type { TransformConfig } from './types';

export class ShuboxTransformManager {
  hasTransforms(transforms: Record<string, TransformConfig> | undefined): boolean {
    return !!transforms && Object.keys(transforms).length > 0;
  }

  getTransformVariants(transforms: Record<string, TransformConfig>): string[] {
    return Object.keys(transforms);
  }
}
