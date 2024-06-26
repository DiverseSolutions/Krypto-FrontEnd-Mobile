// 1. Import `extendTheme`
import { extendTheme } from "@chakra-ui/react"

// 2. Call `extendTheme` and pass your custom values
export const theme = extendTheme({
  colors: {
    'brand-dark': {
      400: '#212121',
      500: '#1C1C1C'
    },
  },
})