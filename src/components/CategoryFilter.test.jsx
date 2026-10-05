import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import CategoryFilter from './CategoryFilter'

const categories = [
    { id: 'frescas', nombre: 'Frutas Frescas' },
    { id: 'organicas', nombre: 'Verduras Orgánicas' },
]

const countByCategory = {
    'Frutas Frescas': 3,
    'Verduras Orgánicas': 3,
    'Productos Orgánicos': 1,
}

function renderFilter(selected = null, onSelect = vi.fn()) {
    render(
        <CategoryFilter
            categories={categories}
            selected={selected}
            onSelect={onSelect}
            countByCategory={countByCategory}
        />
    )

    return onSelect
}

test('muestra Todas más una por categoría', () => {
    renderFilter()

    expect(screen.getByRole('button', { name: /todas/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Frutas Frescas/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Verduras Orgánicas/i })).toBeInTheDocument()
})

test('cada botón muestra cuántos productos tiene su categoría', () => {
    renderFilter()

    /* El badge va dentro del botón, así que el nombre accesible lo incluye. */
    expect(screen.getByRole('button', { name: /Frutas Frescas\s*3/i })).toBeInTheDocument()
    expect(
        screen.getByRole('button', { name: /Verduras Orgánicas\s*3/i })
    ).toBeInTheDocument()
})

test('seleccionar una categoría la avisa con su nombre', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()

    renderFilter(null, onSelect)

    await user.click(screen.getByRole('button', { name: /Verduras Orgánicas/i }))

    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect).toHaveBeenCalledWith('Verduras Orgánicas')
})

test('volver a Todas avisa null para quitar el filtro', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()

    renderFilter('Frutas Frescas', onSelect)

    await user.click(screen.getByRole('button', { name: /todas/i }))

    expect(onSelect).toHaveBeenCalledWith(null)
})

test('la categoría activa queda marcada como presionada', () => {
    renderFilter('Frutas Frescas')

    expect(screen.getByRole('button', { name: /Frutas Frescas/i })).toHaveAttribute(
        'aria-pressed',
        'true'
    )
    expect(screen.getByRole('button', { name: /Verduras Orgánicas/i })).toHaveAttribute(
        'aria-pressed',
        'false'
    )
    expect(screen.getByRole('button', { name: /todas/i })).toHaveAttribute(
        'aria-pressed',
        'false'
    )
})

test('con Todas activa, el resto aparece sin marcar', () => {
    renderFilter(null)

    expect(screen.getByRole('button', { name: /todas/i })).toHaveAttribute(
        'aria-pressed',
        'true'
    )
    expect(screen.getByRole('button', { name: /Frutas Frescas/i })).toHaveAttribute(
        'aria-pressed',
        'false'
    )
})

test('no incluye categorías que no vinieron en la lista', () => {
    renderFilter()

    /* "Productos Lácteos" no se pasa porque no tiene productos. */
    expect(screen.queryByRole('button', { name: /Lácteos/i })).not.toBeInTheDocument()
})