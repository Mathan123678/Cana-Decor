import { describe, it, expect } from "vitest";
import { getImageUrl, API_URL, SERVER_URL } from "../config/api.js";

describe("Client Config & URL Utilities", () => {
  it("should have valid default or configured API and Server URLs", () => {
    expect(API_URL).toBeDefined();
    expect(SERVER_URL).toBeDefined();
    expect(typeof API_URL).toBe("string");
    expect(typeof SERVER_URL).toBe("string");
  });

  it("should correctly format external image URLs without modifying them", () => {
    const httpsUrl = "https://images.unsplash.com/photo-123";
    expect(getImageUrl(httpsUrl)).toBe(httpsUrl);

    const httpUrl = "http://example.com/pic.jpg";
    expect(getImageUrl(httpUrl)).toBe(httpUrl);
  });

  it("should correctly prepend SERVER_URL for local and relative upload paths", () => {
    expect(getImageUrl("/uploads/image1.png")).toBe(`${SERVER_URL}/uploads/image1.png`);
    expect(getImageUrl("image2.jpg")).toBe(`${SERVER_URL}/uploads/image2.jpg`);
    expect(getImageUrl("")).toBe("");
    expect(getImageUrl(null)).toBe("");
  });
});
