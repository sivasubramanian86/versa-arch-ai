import React from 'react';
import '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock reactflow
vi.mock('reactflow', () => {
    return {
        __esModule: true,
        default: ({ children }: { children: React.ReactNode }) => <div data-testid="react-flow">{children}</div>,
        Background: () => <div data-testid="react-flow-background" />,
        Controls: () => <div data-testid="react-flow-controls" />,
        ReactFlowProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="react-flow-provider">{children}</div>,
        useReactFlow: () => ({
            fitView: vi.fn(),
            project: vi.fn(),
            getNodes: vi.fn(() => []),
            getEdges: vi.fn(() => []),
        }),
        useNodesState: (initial: unknown) => [initial, vi.fn(), vi.fn()],
        useEdgesState: (initial: unknown) => [initial, vi.fn(), vi.fn()],
        Handle: ({ type, position }: { type: string; position: string }) => <div data-testid={`handle-${type}-${position}`} />,
        Position: { Top: 'top', Bottom: 'bottom', Left: 'left', Right: 'right' },
    };
});
