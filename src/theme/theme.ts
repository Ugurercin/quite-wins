export const lightTheme = {
  background: {
    primary: '#1C2B1A',
    secondary: '#243322',
    tertiary: '#2C3D2A',
    garden: '#1A2E14',
    gardenGround: '#2D4A20',
  },
  text: {
    primary: '#E8F0E0',
    secondary: '#9AB890',
    tertiary: '#5A7A52',
    inverse: '#1C2B1A',
  },
  brand: {
    darkest: '#173404',
    dark: '#27500A',
    mid: '#4A8A1A',
    base: '#639922',
    light: '#97C459',
    lighter: '#C0DD97',
    lightest: '#E8F5D8',
  },
  plant: {
    trunk: '#4A6B2A',
    bodyDark: '#2D5A0F',
    bodyMid: '#4A8A1A',
    bodyLight: '#7AB840',
    sprout: '#639922',
    bloom: '#C0DD97',
  },
  accent: {
    amber: '#EF9F27',
    pink: '#D4537E',
    purple: '#7F77DD',
    coral: '#D85A30',
  },
  ui: {
    border: 'rgba(255,255,255,0.08)',
    borderStrong: 'rgba(255,255,255,0.15)',
    overlay: 'rgba(0,0,0,0.6)',
    success: '#97C459',
    danger: '#D85A30',
    deleteRed: '#C0392B',
  },
  stats: {
    streakText: '#97C459',
    winsText: '#C0DD97',
    statsBg: '#243322',
  },
}

export const darkTheme = {
  background: {
    primary: '#0D1A0B',
    secondary: '#141F12',
    tertiary: '#1A2A17',
    garden: '#0A1508',
    gardenGround: '#1A3010',
  },
  text: {
    primary: '#EAF5E0',
    secondary: '#8AAA80',
    tertiary: '#4A6A42',
    inverse: '#0D1A0B',
  },
  brand: {
    darkest: '#173404',
    dark: '#27500A',
    mid: '#5A9E20',
    base: '#76AE2A',
    light: '#A8D468',
    lighter: '#C8E8A0',
    lightest: '#E8F5D8',
  },
  plant: {
    trunk: '#527A30',
    bodyDark: '#355F15',
    bodyMid: '#5A9E20',
    bodyLight: '#8AC840',
    sprout: '#76AE2A',
    bloom: '#C8E8A0',
  },
  accent: {
    amber: '#EF9F27',
    pink: '#D4537E',
    purple: '#7F77DD',
    coral: '#D85A30',
  },
  ui: {
    border: 'rgba(255,255,255,0.06)',
    borderStrong: 'rgba(255,255,255,0.12)',
    overlay: 'rgba(0,0,0,0.75)',
    success: '#A8D468',
    danger: '#D85A30',
    deleteRed: '#C0392B',
  },
  stats: {
    streakText: '#A8D468',
    winsText: '#C8E8A0',
    statsBg: '#141F12',
  },
}

export type Theme = typeof lightTheme
