import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import PageLivePreview from '../../resources/js/components/editor/PageLivePreview';

afterEach(() => cleanup());

describe('page live preview', () => {
    it('renders unsaved page data and structured blocks', () => {
        render(<MemoryRouter><PageLivePreview form={{
            title: 'Preview title',
            slug: 'preview-title',
            body: '<p>Unsaved body content</p>',
            blocks: [{ id: 'quote', type: 'quote', quote: 'Unsaved quote', author: 'Editor' }],
            is_home: false,
            status: 'draft',
            cover_image: null,
        }} page={null} /></MemoryRouter>);

        expect(screen.getByText('/preview-title')).toBeInTheDocument();
        expect(screen.getByText('Preview title')).toBeInTheDocument();
        expect(screen.getByText('Unsaved body content')).toBeInTheDocument();
        expect(screen.getByText(/Unsaved quote/)).toBeInTheDocument();
        expect(screen.getByText('Live preview')).toBeInTheDocument();
    });
});
