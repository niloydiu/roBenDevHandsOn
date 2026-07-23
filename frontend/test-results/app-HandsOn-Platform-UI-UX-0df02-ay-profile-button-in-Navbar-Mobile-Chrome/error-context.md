# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> HandsOn Platform UI/UX & E2E Tests >> Google and GitHub authentication sign in successfully and display profile button in Navbar
- Location: tests\app.spec.ts:80:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('a[href=\'/profile\']')
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('a[href=\'/profile\']')
    13 × locator resolved to <a href="/profile" class="flex items-center gap-2 px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors text-xs font-medium text-zinc-900 dark:text-zinc-200">…</a>
       - unexpected value "hidden"

```

```yaml
- banner:
  - link "H HandsOn Volunteer Network":
    - /url: /
  - button
  - button
- text: Connecting 2,400+ Neighborhood Volunteers
- heading "Lend a Hand, Shape a Future." [level=1]: Lend a Hand,Shape a Future.
- paragraph: Connect with hyper-local opportunities, organize volunteer teams, and track your social impact in real time with zero platform fees.
- button "Explore Requests"
- link "Browse Opportunities":
  - /url: /events
- text: 1.2+ Events Held $0 Platform Fees 5+ Hours Logged
- img "HandsOn Community Volunteers"
- text: Empowering Local Neighborhoods Direct Action • Verified Teams 2,400+ Active Volunteers 15,000+ Hours Donated 450+ Impact Projects 10,000+ Lives Touched Upcoming Opportunities
- heading "Make an impact in your Neighborhood." [level=2]
- link "See all events":
  - /url: /events
- text: Environment 2/35
- heading "Dhanmondi Lake Clean-Up & Recycling Drive" [level=3]
- paragraph: Join us this Saturday to clear plastic waste along Dhanmondi lakefront and sort items for recycling.
- text: Jul 25, 2026 08:00 AM - 12:00 PM Dhanmondi, Dhaka
- link "Details":
  - /url: /events/ev-1
- button "Join Event"
- text: Education 1/25
- heading "Youth STEM & Robotics Coding Workshop" [level=3]
- paragraph: Interactive computer science and robotics workshop for underrepresented middle school students.
- text: Jul 27, 2026 10:00 AM - 02:00 PM Uttara, Dhaka
- link "Details":
  - /url: /events/ev-2
- button "Join Event"
- text: Food 2/40
- heading "Community Food Bank & Fresh Produce Distribution" [level=3]
- paragraph: Packing and distributing fresh produce and essential groceries to 200 local families in need.
- text: Jul 28, 2026 09:00 AM - 01:00 PM Mirpur, Dhaka
- link "Details":
  - /url: /events/ev-3
- button "Join Event"
- text: Direct Mutual Aid
- heading "Hearts needing a Helping Hand." [level=2]
- paragraph: Real people, real local needs. From quick errands to tutoring or companionship, small actions build stronger communities.
- link "Post a Request":
  - /url: /community-help
- text: medium 7/23/2026
- heading "Need assistance moving heavy furniture after clinic visit" [level=3]
- text: 3 Offers Dhanmondi, Dhaka
- button "Lend Hand"
- text: urgent 7/23/2026
- heading "Urgent O+ Blood Donor Needed at Square Hospital" [level=3]
- text: 5 Offers Panthapath, Dhaka
- button "Lend Hand"
- text: low 7/23/2026
- heading "Math & Physics tutoring for 9th grader before exam" [level=3]
- text: 2 Offers Gulshan, Dhaka
- button "Lend Hand"
- button "View All Requests"
- text: Get Started Today
- heading "Ready to build a stronger community?" [level=2]
- paragraph: Join our network of Change Makers. Whether you lead a local team or donate an hour a week, every contribution shapes a better future.
- link "Create Free Account":
  - /url: /signup
- link "Browse Teams":
  - /url: /teams
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
  83  |     await expect(page).toHaveURL("/");
> 84  |     await expect(page.locator("a[href='/profile']")).toBeVisible();
      |                                                      ^ Error: expect(locator).toBeVisible() failed
  85  | 
  86  |     await page.goto("/login");
  87  |     await page.click("button:has-text('GitHub')");
  88  |     await expect(page).toHaveURL("/");
  89  |     await expect(page.locator("a[href='/profile']")).toBeVisible();
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