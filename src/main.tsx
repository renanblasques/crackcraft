import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import '@aws-amplify/ui-react/styles.css'

import App from './App.tsx'
import './index.css'

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