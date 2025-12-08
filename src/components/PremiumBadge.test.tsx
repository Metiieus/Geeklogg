import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PremiumBadge, ConditionalPremiumBadge } from "./PremiumBadge";

describe("PremiumBadge", () => {
    it("renders with default variant", () => {
        const { container } = render(<PremiumBadge variant="icon-only" />);
        // Verifica se renderizou o ícone
        expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders label when variant is 'inline' and showLabel is true", () => {
        render(<PremiumBadge variant="inline" showLabel={true} />);
        expect(screen.getByText("Premium")).toBeInTheDocument();
    });

    it("renders PREMIUM text when variant is 'chip'", () => {
        render(<PremiumBadge variant="chip" />);
        expect(screen.getByText("PREMIUM")).toBeInTheDocument();
    });
});

describe("ConditionalPremiumBadge", () => {
    it("does not render when isPremium is false", () => {
        const { container } = render(<ConditionalPremiumBadge isPremium={false} />);
        expect(container).toBeEmptyDOMElement();
    });

    it("renders when isPremium is true", () => {
        const { container } = render(<ConditionalPremiumBadge isPremium={true} variant="icon-only" />);
        expect(container.querySelector("svg")).toBeInTheDocument();
    });
});
