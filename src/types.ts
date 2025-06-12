import { Material, Object3D } from "three";
import { GLTF } from "three-stdlib";

export type VectorOrEuler = [number, number, number];

export interface CameraState {
  position: VectorOrEuler;
  rotation: VectorOrEuler;
}

export interface ExtensionState {
  camera?: CameraState;
}

export type ParsedObject3D = Object3D & { material?: Material };

export interface ParsedGLTFResults extends GLTF {
  nodes: {
    [key: string]: ParsedObject3D;
  };
  __originalMaterials?: Record<string, Material | undefined>;
}

// HYP-specific types
export interface HypAsset {
  type: 'model' | 'avatar' | 'script';
  url: string;
  size: number;
  mime: string;
}

export interface HypBlueprint {
  name: string;
  model?: string;
  script?: string;
  props: { [key: string]: { type: string; url: string } };
  frozen: boolean;
}

export interface HypHeader {
  blueprint: HypBlueprint;
  assets: HypAsset[];
}

export interface ParsedHyp {
  header: HypHeader;
  assets: Map<string, Uint8Array>;
}

export interface WebviewMessage {
  type: 'update' | 'save' | 'export';
  data?: any;
}

