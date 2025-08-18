import App from '@/app/index'
import { act, render } from '@testing-library/react-native'

describe('App', () => {
  it('renders correctly', async () => {
    const { findByText } = render(<App />)
    await act(async () => {
      expect(await findByText('Personas CRUD')).toBeDefined()
    })
  })
})
