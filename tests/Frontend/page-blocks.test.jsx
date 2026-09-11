import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import PageBlocks from '../../resources/js/components/blocks/PageBlocks';

afterEach(() => cleanup());

const blocks = [
    { id: 'carousel', type: 'carousel', slides: [
        { id: 'one', image: '/one.jpg', title: 'First slide', caption: 'First caption', url: '' },
        { id: 'two', image: '/two.jpg', title: 'Second slide', caption: 'Second caption', url: '' },
    ] },
    { id: 'faq', type: 'accordion', items: [
        { id: 'q1', question: 'First question', answer: 'First answer' },
        { id: 'q2', question: 'Second question', answer: 'Second answer' },
    ] },
    { id: 'gallery', type: 'gallery', images: [
        { id: 'g1', image: '/gallery.jpg', caption: 'Gallery caption' },
    ] },
    { id: 'button', type: 'button', text: 'Explore', url: '/services', target: 'same', style: 'primary' },
];

describe('structured page blocks', () => {
    it('supports carousel navigation and accordion interaction', () => {
        render(<MemoryRouter><PageBlocks blocks={blocks} /></MemoryRouter>);
        expect(screen.getByText('First slide')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Next slide' }));
        expect(screen.getByText('Second slide')).toBeInTheDocument();

        expect(screen.getByText('First answer')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: /Second question/ }));
        expect(screen.getByText('Second answer')).toBeInTheDocument();
        expect(screen.queryByText('First answer')).not.toBeInTheDocument();
    });

    it('opens gallery images in a lightbox and renders internal buttons', () => {
        render(<MemoryRouter><PageBlocks blocks={blocks} /></MemoryRouter>);
        fireEvent.click(screen.getByRole('button', { name: /Gallery caption/ }));
        expect(screen.getByRole('dialog', { name: 'Gallery caption' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Close lightbox' }));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Explore' })).toHaveAttribute('href', '/services');
    });
});
