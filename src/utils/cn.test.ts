import { describe, it, expect } from "vitest";
import { cn } from "./cn";

describe("cn (className utility)", () => {
    it("should combine class names", () => {
        expect(cn("class1", "class2")).toBe("class1 class2");
    });

    it("should ignore conditional classes", () => {
        expect(cn("class1", false && "class2", "class3")).toBe("class1 class3");
        expect(cn("class1", null, undefined, "class2")).toBe("class1 class2");
    });

    it("should return empty string if no classes provided", () => {
        expect(cn()).toBe("");
    });
});
