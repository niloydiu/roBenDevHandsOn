import { test, expect } from "@playwright/test";

test.describe("HandsOn Platform UI/UX & E2E Tests", () => {
  test("Landing page renders hero, stats, and sections with proper proportions", async ({ page }) => {
    await page.goto("/");

    // Verify main brand heading
    await expect(page.locator("h1")).toContainText("Lend a Hand");

    // Verify stats counters with exact text matching
    await expect(page.getByText("Events Held", { exact: true })).toBeVisible();
    await expect(page.getByText("Platform Fees", { exact: true })).toBeVisible();
    await expect(page.getByText("Hours Logged", { exact: true })).toBeVisible();

    // Verify upcoming opportunities section
    await expect(page.getByText("Upcoming Opportunities", { exact: true })).toBeVisible();
    await expect(page.getByText("Direct Mutual Aid", { exact: true })).toBeVisible();
  });

  test("Events page renders initiative cards and filter tools", async ({ page }) => {
    await page.goto("/events");

    await expect(page.locator("h1")).toContainText("Volunteer Initiatives");
    await expect(page.getByPlaceholder(/Search initiatives/i)).toBeVisible();

    // Verify presence of event cards
    const cardCount = await page.locator(".card-saas").count();
    expect(cardCount).toBeGreaterThan(0);
  });

  test("Event Detail page loads event details cleanly", async ({ page }) => {
    await page.goto("/events/ev-1");
    await expect(page.locator("h1")).toContainText("Dhanmondi Lake Clean-Up");
    await expect(page.getByText("Requirements")).toBeVisible();
    await expect(page.getByText("Location")).toBeVisible();
  });

  test("Community Help page renders mutual aid requests", async ({ page }) => {
    await page.goto("/community-help");

    await expect(page.locator("h1")).toContainText("Mutual Aid");
    await expect(page.locator("button:has-text('New Support Request')")).toBeVisible();

    const requestCards = await page.locator(".card-saas").count();
    expect(requestCards).toBeGreaterThan(0);
  });

  test("Teams page renders tabs and rankings", async ({ page }) => {
    await page.goto("/teams");

    await expect(page.locator("h1")).toContainText("Volunteer Teams");
    await expect(page.locator("button:has-text('Discover')")).toBeVisible();
    await expect(page.locator("button:has-text('Rankings')")).toBeVisible();
  });

  test("Team Detail page loads team details cleanly", async ({ page }) => {
    await page.goto("/teams/t-1");
    await expect(page.locator("h1")).toContainText("Green Earth Action Corps");
    await expect(page.getByText("Collective Impact")).toBeVisible();
  });

  test("Support page renders donation form and preset options", async ({ page }) => {
    await page.goto("/support");

    await expect(page.locator("h2")).toContainText("Support Our Platform");
    await expect(page.locator("button:has-text('$50')")).toBeVisible();
    await expect(page.locator("button:has-text('Donate via Stripe')")).toBeVisible();
  });

  test("Auth pages render cleanly", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("h2")).toContainText("Welcome Back");
    await expect(page.locator("button:has-text('Sign In')")).toBeVisible();

    await page.goto("/signup");
    await expect(page.locator("h2")).toContainText("Create Account");
    await expect(page.locator("button:has-text('Get Started')")).toBeVisible();
  });

  test("Google and GitHub authentication sign in successfully", async ({ page }) => {
    await page.goto("/login");
    await page.click("button:has-text('Google')");
    await expect(page).toHaveURL("/");

    await page.goto("/login");
    await page.click("button:has-text('GitHub')");
    await expect(page).toHaveURL("/");
  });

  test("Chat page renders messaging interface", async ({ page }) => {
    await page.goto("/chat");
    await expect(page.locator("h1")).toContainText("Volunteer Messages");
    await expect(page.getByPlaceholder(/Message/i)).toBeVisible();
  });
});
