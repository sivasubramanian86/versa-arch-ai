/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { InfographicView } from '@/components/ui/infographic-view';

describe('InfographicView', () => {
    const mockOnLoadMore = vi.fn();

    const baseState: any = {
        learner_input: 'Test Topic',
        routing_log: [],
        personalized_path: {
            recommended_topic: 'Test Topic',
            difficulty_level: 5,
            traditional_duration_estimate: 60,
            estimated_duration: 20,
            learning_sequence: ['Step 1'],
            time_saved_rationale: 'Saved time'
        }
    };

    it('renders fallback summary when no image is present', () => {
        render(<InfographicView state={baseState} onLoadMore={mockOnLoadMore} />);

        expect(screen.getByRole('heading', { name: /Test Topic/i, level: 3 })).toBeInTheDocument();
        expect(screen.getByText(/Generate Visual Infographic/i)).toBeInTheDocument();
        // Check for default fallback bullet
        expect(screen.getByText(/Decomposing system architecture/i)).toBeInTheDocument();
    });

    it('renders fallback summary when imageUrl contains "placeholder"', () => {
        const stateWithPlaceholder = {
            ...baseState,
            infographic: {
                imageUrl: "/images/nano-banana-placeholder.png",
                altText: "Placeholder"
            }
        };
        render(<InfographicView state={stateWithPlaceholder} onLoadMore={mockOnLoadMore} />);
        expect(screen.getByText(/Generate Visual Infographic/i)).toBeDefined();
    });

    it('renders image and download button when real infographic data exists', () => {
        const stateWithImage = {
            ...baseState,
            infographic: {
                imageUrl: 'https://example.com/real-image.png',
                altText: 'Test Alt Text'
            }
        };

        render(<InfographicView state={stateWithImage} onLoadMore={mockOnLoadMore} />);

        const img = screen.getByAltText('Test Alt Text') as HTMLImageElement;
        expect(decodeURIComponent(img.src)).toContain('https://example.com/real-image.png');
        expect(screen.getByText(/Download/i)).toBeInTheDocument();
        // There might be multiple "Regenerate" buttons (header and footer), so we check if at least one exists
        const regenerateButtons = screen.getAllByText(/Regenerate/i);
        expect(regenerateButtons.length).toBeGreaterThan(0);
    });

    it('calls onLoadMore when generate button is clicked', () => {
        render(<InfographicView state={baseState} onLoadMore={mockOnLoadMore} />);

        const button = screen.getByText(/Generate Visual Infographic/i);
        fireEvent.click(button);

        expect(mockOnLoadMore).toHaveBeenCalled();
    });
});
