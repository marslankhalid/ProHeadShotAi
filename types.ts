export enum AppStep {
  UPLOAD = 'UPLOAD',
  STYLE_SELECT = 'STYLE_SELECT',
  PROCESSING = 'PROCESSING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}

export interface HeadshotStyle {
  id: string;
  name: string;
  description: string;
  promptModifier: string;
  iconColor: string;
}

export interface GeneratedImage {
  originalUrl: string;
  generatedUrl: string | null;
  history: string[]; // Keep track of versions
}

export interface ServiceResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}
