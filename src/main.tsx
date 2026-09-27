import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import { I18n } from 'aws-amplify/utils'
import {
  translations,
} from '@aws-amplify/ui-react'

import App from './App.tsx'

import '@aws-amplify/ui-react/styles.css'
import './index.css'

I18n.putVocabularies(translations)
I18n.setLanguage('pt')

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'sa-east-1_hGtHB2HTy',
      userPoolClientId: '1582d52iqbpdujr8sjfq553la8',
      loginWith: {
        email: true,
      },
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
