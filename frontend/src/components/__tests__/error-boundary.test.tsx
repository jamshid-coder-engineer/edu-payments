import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from '../error-boundary';

function Broken(): never {
  throw new Error('kutilmagan xato');
}

describe('ErrorBoundary', () => {
  it("xato bo'lmasa ichidagini ko'rsatadi", () => {
    render(
      <ErrorBoundary>
        <p>Sahifa</p>
      </ErrorBoundary>,
    );
    expect(screen.getByText('Sahifa')).toBeInTheDocument();
  });

  it("xatoda oq ekran o'rniga xabar va qayta yuklash tugmasi", () => {
    // React xatoni konsolga yozadi, test chiqishini ifloslamasin
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <Broken />
      </ErrorBoundary>,
    );

    expect(
      screen.getByText('Kutilmagan xatolik yuz berdi'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Qayta yuklash/ }),
    ).toBeInTheDocument();
    vi.restoreAllMocks();
  });
});
