// src/theme.js
import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

export default definePreset(Aura, {
  semantic: {
    // ===== Акцентные цвета (не трогаем, как договорились) =====
    primary: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6',
      500: '#ec4899', // розово-малиновый акцент (Compare, New comparison, Team A)
      600: '#db2777',
      700: '#be185d',
      800: '#9d174d',
      900: '#831843'
    },
    info: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6', // синий акцент (Team B)
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a'
    },

    // ===== Запасные семантические цвета (нейтральные, стандартные) =====
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a'
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d'
    },
    warn: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f'
    },
    danger: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d'
    },

    // ===== Цветовые схемы =====
    colorScheme: {
      // -------- СВЕТЛАЯ ТЕМА --------
      light: {
        surface: {
          0: '#ffffff',
          50: '#f9f9fb',
          100: '#f1f1f4',
          200: '#e3e3e9',
          300: '#c8c8d2',
          400: '#a3a3b2',
          500: '#7d7d8f', // границы карточек
          600: '#5c5c6e',
          700: '#3f3f4d', // второстепенный текст на светлом
          800: '#26262f',
          900: '#131317', // почти-чёрный текст заголовков
          950: '#08080a'
        },
        content: {
          background: '{surface.0}',
          hoverBackground: '{surface.50}',
          borderColor: '{surface.200}',
          color: '{surface.900}',
          hoverColor: '{surface.950}'
        },
        primary: {
          color: '{primary.500}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.600}',
          activeColor: '{primary.700}'
        },
        highlight: {
          background: 'rgba(236, 72, 153, 0.16)',
          focusBackground: 'rgba(236, 72, 153, 0.22)',
          color: '{primary.700}',
          focusColor: '{primary.800}'
        },
        text: {
          color: '{surface.900}',
          hoverColor: '{surface.950}',
          mutedColor: '{surface.600}'
        },
        formField: {
          background: '{surface.0}',
          disabledBackground: '{surface.100}',
          borderColor: '{surface.300}',
          hoverBorderColor: '{surface.400}',
          focusBorderColor: '{primary.500}',
          color: '{surface.900}',
          placeholderColor: '{surface.500}'
        }
      },

      // -------- ТЁМНАЯ ТЕМА --------
      dark: {
        surface: {
          0: '#ffffff',
          50: '#f5f5f7',
          100: '#c7c7cf',
          200: '#9499a8',
          300: '#6b6f7d',
          400: '#3a3a44',
          500: '#26262e', // границы карточек
          600: '#1c1c23',
          700: '#16161c', // фон панелей/карточек
          800: '#0f0f14',
          900: '#0a0a0f', // фон страницы
          950: '#050507'
        },
        content: {
          background: '{surface.700}',
          hoverBackground: 'rgba(255,255,255,0.04)',
          borderColor: '{surface.500}',
          color: '{surface.50}',
          hoverColor: '{surface.0}'
        },
        primary: {
          color: '{primary.500}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.400}',
          activeColor: '{primary.600}'
        },
        highlight: {
          background: 'rgba(236, 72, 153, 0.16)',
          focusBackground: 'rgba(236, 72, 153, 0.24)',
          color: '{primary.200}',
          focusColor: '{primary.100}'
        },
        text: {
          color: '{surface.50}',
          hoverColor: '{surface.0}',
          mutedColor: '{surface.200}'
        },
        formField: {
          background: '{surface.700}',
          disabledBackground: '{surface.600}',
          borderColor: '{surface.500}',
          hoverBorderColor: '{surface.400}',
          focusBorderColor: '{primary.500}',
          color: '{surface.50}',
          placeholderColor: '{surface.300}'
        }
      }
    }
  }
})