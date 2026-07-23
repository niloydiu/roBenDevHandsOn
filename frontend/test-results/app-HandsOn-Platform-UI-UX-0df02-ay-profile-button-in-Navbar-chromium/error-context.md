# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> HandsOn Platform UI/UX & E2E Tests >> Google and GitHub authentication sign in successfully and display profile button in Navbar
- Location: tests\app.spec.ts:80:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected: "http://localhost:3000/"
Received: "http://localhost:3000/login"
Timeout:  5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    13 × unexpected value "http://localhost:3000/login"

```

```yaml
- banner:
  - link "H HandsOn Volunteer Network":
    - /url: /
  - navigation:
    - link "Feed":
      - /url: /
    - link "Events":
      - /url: /events
    - link "Mutual Aid":
      - /url: /community-help
    - link "Teams":
      - /url: /teams
    - link "Chat":
      - /url: /chat
    - link "Support":
      - /url: /support
  - button "Toggle Theme"
  - link "Login":
    - /url: /login
  - link "Join Now":
    - /url: /signup
- text: H
- heading "Welcome Back" [level=2]
- paragraph: Sign in to your HandsOn volunteer account
- text: Email Address
- textbox "name@example.com"
- text: Password
- link "Forgot?":
  - /url: "#"
- textbox "••••••••"
- button "Sign In"
- text: Or continue with
- button "Google":
  - img
  - text: Google
- button "GitHub":
  - img
  - text: GitHub
- paragraph:
  - text: Don't have an account?
  - link "Create one":
    - /url: /signup
- contentinfo:
  - link "H HandsOn v2.0":
    - /url: /
  - paragraph: A high-impact community platform matching neighborhood volunteer needs with active, dedicated local change makers.
  - link "GitHub":
    - /url: https://github.com/niloydiu/
    - img
  - link "LinkedIn":
    - /url: https://www.linkedin.com/in/niloykumarmohonta000/
    - img
  - link "Twitter / X":
    - /url: "#"
    - img
  - heading "Platform" [level=4]
  - list:
    - listitem:
      - link "Feed & Events":
        - /url: /events
    - listitem:
      - link "Browse Teams":
        - /url: /teams
    - listitem:
      - link "Mutual Aid":
        - /url: /community-help
    - listitem:
      - link "Support Hub":
        - /url: /support
  - heading "Account" [level=4]
  - list:
    - listitem:
      - link "Sign In":
        - /url: /login
    - listitem:
      - link "Create Account":
        - /url: /signup
    - listitem:
      - link "Dashboard":
        - /url: /dashboard
  - heading "Community" [level=4]
  - list:
    - listitem:
      - link "Open Source":
        - /url: https://github.com/niloydiu/
    - listitem:
      - link "Developer Portfolio":
        - /url: https://niloykm.vercel.app/
  - text: © 2026 HandsOn Platform. All rights reserved. Platform Operational
  - link "Privacy":
    - /url: "#"
  - link "Terms":
    - /url: "#"
- region "Notifications Alt+T"
- alert
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | test.describe("HandsOn Platform UI/UX & E2E Tests", () => {
  4   |   test("Landing page renders hero, stats, and sections with proper proportions", async ({ page }) => {
  5   |     await page.goto("/");
  6   | 
  7   |     // Verify main brand heading
  8   |     await expect(page.locator("h1")).toContainText("Lend a Hand");
  9   | 
  10  |     // Verify stats counters with exact text matching
  11  |     await expect(page.getByText("Events Held", { exact: true })).toBeVisible();
  12  |     await expect(page.getByText("Platform Fees", { exact: true })).toBeVisible();
  13  |     await expect(page.getByText("Hours Logged", { exact: true })).toBeVisible();
  14  | 
  15  |     // Verify upcoming opportunities section
  16  |     await expect(page.getByText("Upcoming Opportunities", { exact: true })).toBeVisible();
  17  |     await expect(page.getByText("Direct Mutual Aid", { exact: true })).toBeVisible();
  18  |   });
  19  | 
  20  |   test("Events page renders initiative cards and filter tools", async ({ page }) => {
  21  |     await page.goto("/events");
  22  | 
  23  |     await expect(page.locator("h1")).toContainText("Volunteer Initiatives");
  24  |     await expect(page.getByPlaceholder(/Search initiatives/i)).toBeVisible();
  25  | 
  26  |     // Verify presence of event cards
  27  |     const cardCount = await page.locator(".card-saas").count();
  28  |     expect(cardCount).toBeGreaterThan(0);
  29  |   });
  30  | 
  31  |   test("Event Detail page loads event details cleanly", async ({ page }) => {
  32  |     await page.goto("/events/ev-1");
  33  |     await expect(page.locator("h1")).toContainText("Dhanmondi Lake Clean-Up");
  34  |     await expect(page.getByText("Requirements")).toBeVisible();
  35  |     await expect(page.getByText("Location")).toBeVisible();
  36  |   });
  37  | 
  38  |   test("Community Help page renders mutual aid requests", async ({ page }) => {
  39  |     await page.goto("/community-help");
  40  | 
  41  |     await expect(page.locator("h1")).toContainText("Mutual Aid");
  42  |     await expect(page.locator("button:has-text('New Support Request')")).toBeVisible();
  43  | 
  44  |     const requestCards = await page.locator(".card-saas").count();
  45  |     expect(requestCards).toBeGreaterThan(0);
  46  |   });
  47  | 
  48  |   test("Teams page renders tabs and rankings", async ({ page }) => {
  49  |     await page.goto("/teams");
  50  | 
  51  |     await expect(page.locator("h1")).toContainText("Volunteer Teams");
  52  |     await expect(page.locator("button:has-text('Discover')")).toBeVisible();
  53  |     await expect(page.locator("button:has-text('Rankings')")).toBeVisible();
  54  |   });
  55  | 
  56  |   test("Team Detail page loads team details cleanly", async ({ page }) => {
  57  |     await page.goto("/teams/t-1");
  58  |     await expect(page.locator("h1")).toContainText("Green Earth Action Corps");
  59  |     await expect(page.getByText("Collective Impact")).toBeVisible();
  60  |   });
  61  | 
  62  |   test("Support page renders donation form and preset options", async ({ page }) => {
  63  |     await page.goto("/support");
  64  | 
  65  |     await expect(page.locator("h2")).toContainText("Support Our Platform");
  66  |     await expect(page.locator("button:has-text('$50')")).toBeVisible();
  67  |     await expect(page.locator("button:has-text('Donate via Stripe')")).toBeVisible();
  68  |   });
  69  | 
  70  |   test("Auth pages render cleanly", async ({ page }) => {
  71  |     await page.goto("/login");
  72  |     await expect(page.locator("h2")).toContainText("Welcome Back");
  73  |     await expect(page.locator("button:has-text('Sign In')")).toBeVisible();
  74  | 
  75  |     await page.goto("/signup");
  76  |     await expect(page.locator("h2")).toContainText("Create Account");
  77  |     await expect(page.locator("button:has-text('Get Started')")).toBeVisible();
  78  |   });
  79  | 
  80  |   test("Google and GitHub authentication sign in successfully and display profile button in Navbar", async ({ page }) => {
  81  |     await page.goto("/login");
  82  |     await page.click("button:has-text('Google')");
> 83  |     await expect(page).toHaveURL("/");
      |                        ^ Error: expect(page).toHaveURL(expected) failed
  84  |     await expect(page.locator("a[href='/profile']").first()).toBeAttached();
  85  | 
  86  |     await page.goto("/login");
  87  |     await page.click("button:has-text('GitHub')");
  88  |     await expect(page).toHaveURL("/");
  89  |     await expect(page.locator("a[href='/profile']").first()).toBeAttached();
  90  |   });
  91  | 
  92  |   test("Chat page requires authentication when logged out and opens messaging interface when logged in", async ({ page }) => {
  93  |     await page.goto("/chat");
  94  |     await expect(page.locator("h2")).toContainText("Authentication Required");
  95  | 
  96  |     await page.goto("/login");
  97  |     await page.click("button:has-text('Google')");
  98  |     await page.goto("/chat");
  99  |     await expect(page.locator("h1")).toContainText("Volunteer Messages");
  100 |     await expect(page.getByPlaceholder(/Message/i)).toBeVisible();
  101 |   });
  102 | 
  103 |   test("Profile page requires authentication when logged out and displays volunteer profile when logged in", async ({ page }) => {
  104 |     await page.goto("/profile");
  105 |     await expect(page.locator("h2")).toContainText("Authentication Required");
  106 | 
  107 |     await page.goto("/login");
  108 |     await page.click("button:has-text('Google')");
  109 |     await page.goto("/profile");
  110 |     await expect(page.getByText("Volunteer Hours")).toBeVisible();
  111 |     await expect(page.getByText("Impact Points")).toBeVisible();
  112 |   });
  113 | });
  114 | 
```