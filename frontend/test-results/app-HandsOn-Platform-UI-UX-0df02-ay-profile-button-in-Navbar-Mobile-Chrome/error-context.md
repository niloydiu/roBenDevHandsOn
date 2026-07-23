# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> HandsOn Platform UI/UX & E2E Tests >> Google and GitHub authentication sign in successfully and display profile button in Navbar
- Location: tests\app.spec.ts:80:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('button:has-text(\'Google\')')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e5]:
        - link "H HandsOn Volunteer Network" [ref=e6] [cursor=pointer]:
          - /url: /
          - generic [ref=e7]: H
          - generic [ref=e8]:
            - generic [ref=e9]: HandsOn
            - generic [ref=e10]: Volunteer Network
        - generic [ref=e11]:
          - button [ref=e12] [cursor=pointer]:
            - img [ref=e13]
          - button [ref=e15] [cursor=pointer]:
            - img [ref=e16]
    - generic [ref=e19]:
      - heading "404" [level=1] [ref=e20]
      - heading "This page could not be found." [level=2] [ref=e22]
    - contentinfo [ref=e23]:
      - generic [ref=e24]:
        - generic [ref=e25]:
          - generic [ref=e26]:
            - link "H HandsOn v2.0" [ref=e27] [cursor=pointer]:
              - /url: /
              - generic [ref=e28]: H
              - generic [ref=e29]: HandsOn
              - generic [ref=e30]: v2.0
            - paragraph [ref=e31]: A high-impact community platform matching neighborhood volunteer needs with active, dedicated local change makers.
            - generic [ref=e32]:
              - link "GitHub" [ref=e33] [cursor=pointer]:
                - /url: https://github.com/niloydiu/
                - img [ref=e34]
              - link "LinkedIn" [ref=e36] [cursor=pointer]:
                - /url: https://www.linkedin.com/in/niloykumarmohonta000/
                - img [ref=e37]
              - link "Twitter / X" [ref=e39] [cursor=pointer]:
                - /url: "#"
                - img [ref=e40]
          - generic [ref=e42]:
            - generic [ref=e43]:
              - heading "Platform" [level=4] [ref=e44]
              - list [ref=e45]:
                - listitem [ref=e46]:
                  - link "Feed & Events" [ref=e47] [cursor=pointer]:
                    - /url: /events
                - listitem [ref=e48]:
                  - link "Browse Teams" [ref=e49] [cursor=pointer]:
                    - /url: /teams
                - listitem [ref=e50]:
                  - link "Mutual Aid" [ref=e51] [cursor=pointer]:
                    - /url: /community-help
                - listitem [ref=e52]:
                  - link "Support Hub" [ref=e53] [cursor=pointer]:
                    - /url: /support
            - generic [ref=e54]:
              - heading "Account" [level=4] [ref=e55]
              - list [ref=e56]:
                - listitem [ref=e57]:
                  - link "Sign In" [ref=e58] [cursor=pointer]:
                    - /url: /login
                - listitem [ref=e59]:
                  - link "Create Account" [ref=e60] [cursor=pointer]:
                    - /url: /signup
                - listitem [ref=e61]:
                  - link "Dashboard" [ref=e62] [cursor=pointer]:
                    - /url: /dashboard
            - generic [ref=e63]:
              - heading "Community" [level=4] [ref=e64]
              - list [ref=e65]:
                - listitem [ref=e66]:
                  - link "Open Source" [ref=e67] [cursor=pointer]:
                    - /url: https://github.com/niloydiu/
                - listitem [ref=e68]:
                  - link "Developer Portfolio" [ref=e69] [cursor=pointer]:
                    - /url: https://niloykm.vercel.app/
        - generic [ref=e70]:
          - generic [ref=e72]: © 2026 HandsOn Platform. All rights reserved.
          - generic [ref=e73]:
            - generic [ref=e74]: Platform Operational
            - link "Privacy" [ref=e76] [cursor=pointer]:
              - /url: "#"
            - link "Terms" [ref=e77] [cursor=pointer]:
              - /url: "#"
    - region "Notifications Alt+T"
  - generic [ref=e82] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e83]:
      - img [ref=e84]
    - generic [ref=e87]:
      - button "Open issues overlay" [ref=e88]:
        - generic [ref=e89]:
          - generic [ref=e90]: "0"
          - generic [ref=e91]: "1"
        - generic [ref=e92]: Issue
      - button "Collapse issues badge" [ref=e93]:
        - img [ref=e94]
  - alert [ref=e96]
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
> 82  |     await page.click("button:has-text('Google')");
      |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  83  |     await expect(page).toHaveURL("/");
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
  102 | });
  103 | 
```