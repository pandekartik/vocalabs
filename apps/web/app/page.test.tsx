import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Page from './page'

describe('Page', () => {
    it('renders Welcome to Voca Labs text', () => {
        render(<Page />)
        const text = screen.getByText('Welcome to Voca Labs')
        expect(text).toBeInTheDocument()
    })
})
