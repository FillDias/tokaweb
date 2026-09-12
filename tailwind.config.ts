import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        ki: '#E8B93B',
        'ki-lo': '#FBF1D6',
        ai: '#1E2749',
        'ai-deep': '#141A2C',
        seiji: '#4E7F6A',
        shu: '#C0392B',
        washi: '#E6E3D7',
        sumi: '#17181C',
        paper: '#FFFFFF',
        surface: '#F5F4F0',
        line: '#E2E0D9',
        mute: '#6E6C66',
        'ki-txt': '#8A5A10',
        'ki-borda': '#EBDCA9',
        'seiji-lo': '#E4F0EA',
        'shu-lo': '#F8E4E1'
      },
      fontFamily: {
        titulo: ['"Zen Maru Gothic"', 'sans-serif'],
        texto: ['"M PLUS Rounded 1c"', 'sans-serif'],
        dado: ['ui-monospace', '"DejaVu Sans Mono"', 'monospace']
      }
    }
  }
}
