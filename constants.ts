import { HeadshotStyle } from './types';

export const HEADSHOT_STYLES: HeadshotStyle[] = [
  {
    id: 'corporate',
    name: 'Corporate Executive',
    description: 'Professional grey backdrop, suit or business attire, studio lighting.',
    promptModifier: 'a professional corporate headshot with a neutral grey studio background, wearing a sharp business suit, soft studio lighting, high resolution, photorealistic 8k',
    iconColor: 'bg-slate-500'
  },
  {
    id: 'tech',
    name: 'Modern Tech',
    description: 'Blurred modern open office background, smart casual attire.',
    promptModifier: 'a modern tech industry headshot, blurred open office background with glass walls, wearing smart casual tech attire (polo or high quality t-shirt), bright natural lighting, 8k',
    iconColor: 'bg-blue-500'
  },
  {
    id: 'outdoor',
    name: 'Natural Light',
    description: 'Outdoor setting with bokeh greenery, approachable and warm.',
    promptModifier: 'a professional outdoor headshot, soft bokeh greenery in background, natural sunlight, golden hour lighting, approachable smile, smart casual clothing, 8k',
    iconColor: 'bg-green-500'
  },
  {
    id: 'creative',
    name: 'Creative Studio',
    description: 'Artistic lighting, solid bold color background, stylish look.',
    promptModifier: 'a creative professional headshot, solid vibrant color background, dramatic rim lighting, artistic composition, stylish modern fashion, 8k',
    iconColor: 'bg-purple-500'
  },
  {
    id: 'bw',
    name: 'Classic B&W',
    description: 'Timeless black and white portrait, high contrast.',
    promptModifier: 'a timeless black and white professional headshot, high contrast, dramatic shadows, rembrandt lighting, classic portrait photography style, 8k',
    iconColor: 'bg-zinc-700'
  },
  {
    id: 'startup',
    name: 'Startup Founder',
    description: 'Confident look, loft or brick wall background.',
    promptModifier: 'a startup founder headshot, blurred exposed brick wall background, confident expression, casual blazer or hoodie, modern entrepreneurial vibe, 8k',
    iconColor: 'bg-orange-500'
  }
];

export const MAX_IMAGE_SIZE_MB = 10;
export const COMPRESSION_WIDTH = 1024; // Resize before sending to API to save bandwidth
