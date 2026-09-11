import { act, render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from '../../resources/js/api/client';
import PublicPage from '../../resources/js/pages/public/PublicPage';

vi.mock('../../resources/js/api/client', () => ({
    default: { get: vi.fn() },
}));

describe('public dynamic page shell', () => {
    beforeEach(() => vi.clearAllMocks());

    it('re-fetches when the slug changes and renders CMS content', async () => {
        api.get
            .mockResolvedValueOnce({ data: { data: { id: 1, title: 'First Page', slug: 'first', body: '<p><strong>First body</strong></p>', cover_image_url: null } } })
            .mockResolvedValueOnce({ data: { data: { id: 2, title: 'Second Page', slug: 'second', body: '<h2>Second body</h2>', cover_image_url: null } } });

        const router = createMemoryRouter([
            { path: '/:slug', element: <PublicPage /> },
        ], { initialEntries: ['/first'] });

        render(<RouterProvider router={router} />);
        expect(await screen.findByRole('heading', { name: 'First Page' })).toBeInTheDocument();
        expect(screen.getByTestId('page-body')).toHaveTextContent('First body');

        await act(async () => { await router.navigate('/second'); });
        expect(await screen.findByRole('heading', { name: 'Second Page' })).toBeInTheDocument();
        expect(api.get).toHaveBeenNthCalledWith(1, '/public/pages/first');
        expect(api.get).toHaveBeenNthCalledWith(2, '/public/pages/second');
        expect(screen.getByTestId('page-body')).toHaveTextContent('Second body');
    });

    it('shows not found for unavailable content', async () => {
        api.get.mockRejectedValueOnce({ response: { status: 404 } });
        const router = createMemoryRouter([{ path: '/:slug', element: <PublicPage /> }], { initialEntries: ['/missing'] });
        render(<RouterProvider router={router} />);

        await waitFor(() => expect(screen.getByRole('heading', { name: 'Page not available' })).toBeInTheDocument());
    });
});
