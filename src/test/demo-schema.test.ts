import { describe, expect, it } from "vitest";
import { demoSchema } from "@/lib/demo-schema";
import { PRODUCT_OPTIONS } from "@/lib/site";

const base = { name: "Jane Doe", email: "jane@example.com", phone: "+971 50 000 0000", company: "Acme", product: "Velynora", message: "" };

describe("demo form", () => {
  it("offers exactly the seven product options in order", () => {
    expect(PRODUCT_OPTIONS).toEqual(["Velynora", "Velynora Lite", "VOCALIS", "AI Automation", "AI Product Requirement", "Startup-as-a-Service", "General Enquiry"]);
  });
  it("rejects a product not in the list", () => {
    expect(demoSchema.safeParse({ ...base, product: "Vocalis" }).success).toBe(false);
  });
  it("requires company", () => {
    expect(demoSchema.safeParse({ ...base, company: "" }).success).toBe(false);
  });
  it("accepts a valid submission", () => {
    expect(demoSchema.safeParse(base).success).toBe(true);
  });
});
