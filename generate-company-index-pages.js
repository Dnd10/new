const fs = require("fs");

const companies = [
  {
    slug: "linkedin",
    name: "LinkedIn",
    hrefPrefix: "",
    theme: "cyan",
    logo: '<span class="logo logo--linkedin">in</span>',
    summary: "Jobs, skills, duplicate listings, hiring signals, and ranking practice for data interview fundamentals.",
    questions: [
      ["1.html", "Data Science Skills", "Find candidates who have all required skills."],
      ["2.html", "Duplicate Job Listings", "Detect companies with duplicate job posts."],
      ["3.html", "Most Active Hiring Company", "Rank companies by hiring activity."],
      ["4.html", "No Duplicate Listings", "Return companies with clean listing behavior."],
      ["5.html", "Multiple Roles", "Find companies posting multiple roles."],
      ["6.html", "Cross-Company Duplicates", "Compare duplicate listings across companies."],
      ["7.html", "Most Common Job Title", "Identify the most frequent job title."],
      ["8.html", "One Job Listing", "Find companies with exactly one listing."],
      ["9.html", "Duplicate Percentage", "Calculate duplicate listing percentage."],
      ["10.html", "First Job Per Company", "Use ranking to find each company's first job."]
    ]
  },
  {
    slug: "amazon",
    name: "Amazon",
    theme: "yellow",
    logo: `<span class="logo logo--amazon"><svg viewBox="0 0 140 72" role="img" aria-hidden="true" focusable="false"><text x="60" y="45" text-anchor="middle" fill="currentColor" font-family="Arial Black, Helvetica, Arial, sans-serif" font-size="66" font-weight="900">a</text><path d="M18 54c10 8.2 23.2 12.4 39.6 12.4 11.8 0 22.5-2.1 32.1-6.3 3.3-1.4 6.1-3 8.5-4.7" fill="none" stroke="#ff9900" stroke-width="7" stroke-linecap="round"/></svg></span>`,
    summary: "Commerce analytics across reviews, products, customer behavior, returns, revenue, and ranking.",
    questions: [
      ["11.html", "Average Review Ratings", "Aggregate ratings by product."],
      ["12.html", "Highest-Grossing Items", "Find top revenue-generating items."],
      ["13.html", "Best-Selling Product", "Rank products by sales volume."],
      ["14.html", "Second Highest Salary", "Use ordering or ranking for salary analysis."],
      ["15.html", "Customers Who Ordered Every Product", "Solve a relational division pattern."],
      ["16.html", "Running Total of Sales", "Use windows to build cumulative sales."],
      ["17.html", "Most Active User", "Find the user with highest activity."],
      ["18.html", "Consecutive Login Days", "Detect login streaks."],
      ["19.html", "Top Customers by Spending", "Rank customers by total spend."],
      ["20.html", "Most Returned Product", "Find products with the most returns."]
    ]
  },
  {
    slug: "netflix",
    name: "Netflix",
    theme: "pink",
    logo: `<span class="logo logo--netflix"><svg viewBox="0 0 72 72" role="img" aria-hidden="true" focusable="false"><rect x="21" y="12" width="10" height="48" fill="#b1060f"/><rect x="41" y="12" width="10" height="48" fill="#b1060f"/><polygon points="31,12 41,12 51,60 41,60" fill="#e50914"/></svg></span>`,
    summary: "Streaming analytics for watch time, churn, ratings, content popularity, genres, and user behavior.",
    questions: [
      ["21.html", "Identify VIP Users", "Segment users by viewing behavior."],
      ["22.html", "Monthly Show Rating", "Aggregate show ratings by month."],
      ["23.html", "Binge Watchers", "Find users with binge behavior."],
      ["24.html", "Churn Risk Users", "Detect users at risk of churn."],
      ["25.html", "Most Watched Show", "Rank shows by total watch activity."],
      ["26.html", "Genre Popularity", "Measure popularity by genre."],
      ["27.html", "Top Rated Content", "Find highest-rated content."],
      ["28.html", "Daily Active Users", "Count daily unique viewers."],
      ["29.html", "Multi-Genre Users", "Find users watching multiple genres."],
      ["30.html", "First Content Watched", "Use ranking to get first watched item."]
    ]
  },
  {
    slug: "google",
    name: "Google",
    theme: "white",
    logo: '<span class="logo logo--google"><span class="google-g">G</span></span>',
    summary: "Maps, Pay, Play, Gmail, Chrome, Search, Drive, and Photos data practice.",
    questions: [
      ["google-1.html", "Ride Completion Rate", "Calculate completion rate by city."],
      ["google-2.html", "Fraud Detection", "Find users with dense transaction windows."],
      ["google-3.html", "Popular Routes", "Find the most searched route."],
      ["google-4.html", "Merchant Revenue", "Rank merchants by transaction amount."],
      ["google-5.html", "App Engagement", "Detect three-day app open streaks."],
      ["google-6.html", "Email Activity", "Find high-volume daily senders."],
      ["google-7.html", "Browser Session Time", "Sum browsing duration per user."],
      ["google-8.html", "Trending Search Terms", "Compare query frequency day over day."],
      ["google-9.html", "Storage Usage", "Find users over the storage threshold."],
      ["google-10.html", "Photo Upload Activity", "Detect upload streaks."]
    ]
  },
  {
    slug: "uber",
    name: "Uber",
    theme: "green",
    logo: '<span class="logo logo--uber">Uber</span>',
    summary: "Trips, drivers, riders, locations, cancellations, surge pricing, retention, and ETA metrics.",
    questions: [
      ["uber-1.html", "Trip Completion Rate", "Calculate completion rate by city."],
      ["uber-2.html", "Surge Pricing Detection", "Compare hourly average fares."],
      ["uber-3.html", "Driver Utilization Rate", "Compute utilization per driver."],
      ["uber-4.html", "Frequent Riders", "Find riders with heavy daily usage."],
      ["uber-5.html", "Driver Earnings Ranking", "Rank drivers within each city."],
      ["uber-6.html", "Cancellation Rate by Rider", "Find riders above a cancellation threshold."],
      ["uber-7.html", "Most Popular Pickup Location", "Identify the most common pickup point."],
      ["uber-8.html", "Trip Distance Bucketing", "Bucket trips by distance."],
      ["uber-9.html", "Driver Retention", "Find drivers active across months."],
      ["uber-10.html", "Average ETA by City", "Average estimated arrival by city."]
    ]
  },
  {
    slug: "airbnb",
    name: "Airbnb",
    theme: "orange",
    logo: `<span class="logo logo--airbnb"><svg viewBox="0 0 72 72" role="img" aria-hidden="true" focusable="false"><path d="M36 19c-5.6 8.2-13.5 20.6-13.5 29.4 0 6.1 4.1 10.1 9.1 10.1 3.3 0 6.1-1.7 8.2-4.8 2.1 3.1 4.9 4.8 8.2 4.8 5 0 9.1-4 9.1-10.1C57.1 39.6 41.6 27.2 36 19Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="36" cy="42" r="6" fill="none" stroke="currentColor" stroke-width="5"/></svg></span>`,
    summary: "Hosts, bookings, occupancy, reviews, listings, pricing, guest retention, and stay duration.",
    questions: [
      ["airbnb-1.html", "Listing Occupancy Rate", "Calculate occupancy per listing."],
      ["airbnb-2.html", "Top Earning Hosts", "Rank hosts by total revenue."],
      ["airbnb-3.html", "Frequent Guests", "Find guests with repeated monthly bookings."],
      ["airbnb-4.html", "Average Review Score per Listing", "Average ratings per listing."],
      ["airbnb-5.html", "Listings with No Bookings", "Find listings never booked."],
      ["airbnb-6.html", "Host Activity Consistency", "Detect three-month booking streaks."],
      ["airbnb-7.html", "Price per Night Analysis", "Average nightly price by city."],
      ["airbnb-8.html", "Guest Retention", "Find guests active in January and February."],
      ["airbnb-9.html", "Most Booked City", "Find the highest booking city."],
      ["airbnb-10.html", "Long Stay Detection", "Find stays longer than five days."]
    ]
  },
  {
    slug: "microsoft",
    name: "Microsoft",
    theme: "paper",
    logo: `<span class="logo logo--microsoft"><svg viewBox="0 0 72 72" role="img" aria-hidden="true" focusable="false"><rect x="14" y="14" width="20" height="20" fill="#f25022"/><rect x="38" y="14" width="20" height="20" fill="#7fba00"/><rect x="14" y="38" width="20" height="20" fill="#00a4ef"/><rect x="38" y="38" width="20" height="20" fill="#ffb900"/></svg></span>`,
    summary: "Licenses, products, Teams, Azure, support, activity logs, growth, and storage analytics.",
    questions: [
      ["microsoft-1.html", "License Utilization Rate", "Calculate active license utilization."],
      ["microsoft-2.html", "Product Adoption Trend", "Find monthly active users by product."],
      ["microsoft-3.html", "Teams Collaboration Activity", "Find teams with high message volume."],
      ["microsoft-4.html", "Support Ticket Resolution Time", "Average resolution time by category."],
      ["microsoft-5.html", "Cloud Resource Usage", "Rank users by compute hours."],
      ["microsoft-6.html", "License Expiry Alert", "Find soon-expiring licenses."],
      ["microsoft-7.html", "Multi-Product Users", "Find users across multiple products."],
      ["microsoft-8.html", "Daily Active Users", "Count daily active users."],
      ["microsoft-9.html", "Team Member Growth", "Find fast-growing teams."],
      ["microsoft-10.html", "Storage Usage by Subscription", "Sum storage by plan type."]
    ]
  },
  {
    slug: "spotify",
    name: "Spotify",
    theme: "yellow",
    logo: `<span class="logo logo--spotify"><svg viewBox="0 0 72 72" role="img" aria-hidden="true" focusable="false"><circle cx="36" cy="36" r="26" fill="#1db954"/><path d="M22 29c10.5-3.1 23.2-2 32 3.2" fill="none" stroke="#0a0a0a" stroke-width="5" stroke-linecap="round"/><path d="M24 38c8.3-2.3 18.6-1.4 25.2 2.6" fill="none" stroke="#0a0a0a" stroke-width="4" stroke-linecap="round"/><path d="M26 46c6.2-1.5 13.6-.9 18.6 2.1" fill="none" stroke="#0a0a0a" stroke-width="3.4" stroke-linecap="round"/></svg></span>`,
    summary: "Streams, artists, users, playlists, subscriptions, daily listeners, trends, and sessions.",
    questions: [
      ["spotify-1.html", "Most Streamed Songs", "Find top streamed songs."],
      ["spotify-2.html", "Artist Popularity", "Find artist with highest streams."],
      ["spotify-3.html", "User Listening Time", "Sum listening time by user."],
      ["spotify-4.html", "Playlist Engagement", "Find playlists with many songs."],
      ["spotify-5.html", "Premium vs Free Users", "Compare average listening time."],
      ["spotify-6.html", "Daily Active Listeners", "Count active listeners by day."],
      ["spotify-7.html", "Repeat Listeners", "Find repeat user-song listens."],
      ["spotify-8.html", "Trending Songs", "Compare song streams day over day."],
      ["spotify-9.html", "Subscription Retention", "Find consecutive subscription months."],
      ["spotify-10.html", "Long Listening Sessions", "Find sessions over one hour."]
    ]
  },
  {
    slug: "meta",
    name: "Meta",
    theme: "lavender",
    logo: `<span class="logo logo--meta"><svg viewBox="0 0 90 60" role="img" aria-hidden="true" focusable="false"><path d="M12 39c8-23 19-29 32 0 13-29 24-23 32 0 5 14-9 19-20 1-5-8-8-13-12-13s-7 5-12 13C21 58 7 53 12 39Z" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`,
    summary: "Posts, friends, feeds, ads, reactions, campaigns, user types, and content engagement.",
    questions: [
      ["meta-1.html", "Post Engagement Rate", "Count engagement per post."],
      ["meta-2.html", "Active Friends Count", "Find users with more than three friends."],
      ["meta-3.html", "Feed Ranking", "Rank posts by engagement."],
      ["meta-4.html", "Ad Click-Through Rate", "Calculate CTR per ad."],
      ["meta-5.html", "Most Engaged User", "Find user with highest engagement."],
      ["meta-6.html", "Consecutive Login Days", "Detect three-day login streaks."],
      ["meta-7.html", "Viral Posts", "Find posts with many reactions."],
      ["meta-8.html", "Ad Revenue by Campaign", "Sum revenue by campaign."],
      ["meta-9.html", "New vs Returning Users", "Classify users by activity."],
      ["meta-10.html", "Most Popular Content Type", "Rank content types by reactions."]
    ]
  }
];

function render(company) {
  const links = company.questions.map((question, index) => `
        <a class="question-card" href="${question[0]}">
          <span class="question-card__num">Q${String(index + 1).padStart(2, "0")}</span>
          <strong>${question[1]}</strong>
          <small>${question[2]}</small>
        </a>`).join("");

  const companyNav = companies.map((item) => `<a href="${item.slug}.html"${item.slug === company.slug ? ' aria-current="page"' : ""}>${item.name}</a>`).join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${company.name} SQL Set | Digits n Data</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;700;800&family=Unbounded:wght@400;700;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="dnd-auth.css">
</head>
<body class="theme-${company.theme}">
  <div class="cursor-dot" id="cursorDot"></div>
  <div class="scroll-progress" id="scrollProgress"></div>

  <header class="topbar">
    <a class="brand" href="hero.html">Digits <span>n Data</span></a>
    <nav class="topnav" aria-label="Company sets">
      ${companyNav}
    </nav>
  </header>

  <main>
    <section class="hero">
      <div class="hero__copy">
        <div class="ghost" aria-hidden="true">${company.name}</div>
        <span class="chip chip--filled">company sql set</span>
        <div class="hero__identity">
          ${company.logo}
          <h1>${company.name}<br><span>SQL Set</span></h1>
        </div>
        <p>${company.summary}</p>
        <div class="hero__actions">
          <a class="button button--dark" href="${company.questions[0][0]}">Start Q01</a>
          <a class="button" href="hero.html#companies">All Companies</a>
        </div>
      </div>
      <aside class="scoreboard" aria-label="${company.name} set summary">
        <div><strong>10</strong><span>questions</span></div>
        <div><strong>PG</strong><span>syntax</span></div>
        <div><strong>SQL</strong><span>practice</span></div>
        <div><strong>01</strong><span>start here</span></div>
      </aside>
    </section>

    <section class="questions">
      <div class="section-head">
        <span class="chip">question list</span>
        <h2>Work through all 10 questions</h2>
        <p>Open a problem, write the query, check the expected output, then come back for the next rep.</p>
      </div>
      <div class="question-grid">
        ${links}
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="footer__brand">Digits<br><span>n Data</span></div>
    <a class="button button--dark" href="hero.html">Back Home</a>
  </footer>

  <style>
    :root {
      --yellow: #ffe600;
      --green: #0ae448;
      --pink: #ff2d78;
      --lavender: #9d95ff;
      --orange: #ff6b35;
      --cyan: #00bae2;
      --ink: #0a0a0a;
      --paper: #fff7d6;
      --canvas: #fafaf5;
      --border: 4px solid var(--ink);
      --border-thick: 6px solid var(--ink);
      --mono: "JetBrains Mono", monospace;
      --display: "Unbounded", sans-serif;
      --stamp: "Bebas Neue", sans-serif;
    }

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--canvas);
      color: var(--ink);
      font-family: var(--mono);
      overflow-x: hidden;
      cursor: none;
    }

    a { color: inherit; text-decoration: none; cursor: none; }

    .cursor-dot {
      position: fixed;
      top: 0;
      left: 0;
      width: 20px;
      height: 20px;
      border: 2px solid var(--ink);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      mix-blend-mode: multiply;
      transition: width 0.16s, height 0.16s, background 0.16s;
    }

    .cursor-dot.is-big {
      width: 52px;
      height: 52px;
      background: rgba(255, 230, 0, 0.5);
    }

    .scroll-progress {
      position: fixed;
      inset: 0 auto auto 0;
      width: 100%;
      height: 5px;
      background: var(--pink);
      transform: scaleX(0);
      transform-origin: left;
      z-index: 9998;
    }

    .topbar {
      position: sticky;
      top: 0;
      z-index: 20;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 18px;
      padding: 14px clamp(18px, 4vw, 48px);
      border-bottom: var(--border);
      background: var(--yellow);
    }

    .brand,
    .footer__brand {
      font-family: var(--display);
      font-weight: 900;
      text-transform: uppercase;
      line-height: 0.95;
    }

    .brand { font-size: clamp(18px, 2.1vw, 28px); }

    .brand span,
    .footer__brand span,
    h1 span {
      color: transparent;
      -webkit-text-stroke: 2px var(--ink);
    }

    .topnav {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 8px;
    }

    .topnav a,
    .chip,
    .button {
      border: 2px solid var(--ink);
      padding: 7px 10px;
      font-size: clamp(10px, 1vw, 12px);
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      background: white;
    }

    .topnav a[aria-current="page"],
    .chip--filled,
    .button--dark {
      background: var(--ink);
      color: var(--yellow);
    }

    .chip {
      display: inline-block;
      width: fit-content;
    }

    .button {
      border: var(--border);
      padding: 12px 15px;
      transition: transform 0.16s, background 0.16s;
    }

    .button:hover,
    .topnav a:hover,
    .question-card:hover {
      transform: translate(-3px, -3px);
      background: var(--green);
      color: var(--ink);
    }

    .hero {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(320px, 0.55fr);
      min-height: calc(100vh - 70px);
      border-bottom: var(--border-thick);
      background: var(--theme);
    }

    .theme-cyan { --theme: var(--cyan); }
    .theme-yellow { --theme: var(--yellow); }
    .theme-pink { --theme: var(--pink); }
    .theme-white { --theme: white; }
    .theme-green { --theme: var(--green); }
    .theme-orange { --theme: var(--orange); }
    .theme-paper { --theme: var(--paper); }
    .theme-lavender { --theme: var(--lavender); }

    .hero__copy {
      position: relative;
      overflow: hidden;
      padding: clamp(32px, 6vw, 84px);
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 22px;
      border-right: var(--border-thick);
    }

    .ghost {
      position: absolute;
      right: -4%;
      top: 5%;
      font-family: var(--stamp);
      font-size: clamp(110px, 20vw, 280px);
      line-height: 0.8;
      color: transparent;
      -webkit-text-stroke: 2px rgba(10, 10, 10, 0.1);
      pointer-events: none;
      white-space: nowrap;
    }

    .hero__identity {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      gap: clamp(18px, 3vw, 34px);
      flex-wrap: wrap;
    }

    h1,
    h2 {
      font-family: var(--display);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0;
    }

    h1 {
      font-size: clamp(44px, 8vw, 118px);
      line-height: 0.9;
    }

    .hero__copy p,
    .section-head p {
      max-width: 68ch;
      line-height: 1.75;
      font-weight: 700;
      border-top: var(--border);
      padding-top: 18px;
    }

    .hero__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      position: relative;
      z-index: 1;
    }

    .scoreboard {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      background: var(--ink);
      color: var(--yellow);
    }

    .scoreboard div {
      min-height: 190px;
      padding: 24px;
      border-right: 3px solid var(--yellow);
      border-bottom: 3px solid var(--yellow);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 16px;
    }

    .scoreboard div:nth-child(2n) { border-right: none; }
    .scoreboard div:nth-last-child(-n + 2) { border-bottom: none; }

    .scoreboard strong {
      font-family: var(--stamp);
      font-size: clamp(58px, 8vw, 110px);
      line-height: 0.8;
    }

    .scoreboard span {
      font-size: 11px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      line-height: 1.5;
    }

    .questions {
      padding: clamp(32px, 6vw, 78px);
      background: var(--paper);
      border-bottom: var(--border-thick);
    }

    .section-head {
      display: grid;
      gap: 18px;
      margin-bottom: clamp(24px, 4vw, 46px);
    }

    .section-head h2 {
      font-size: clamp(32px, 5.4vw, 84px);
      line-height: 0.96;
      max-width: 980px;
    }

    .question-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px;
    }

    .question-card {
      min-height: 190px;
      border: var(--border-thick);
      background: white;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 18px;
      box-shadow: 9px 9px 0 var(--ink);
      transition: transform 0.16s, box-shadow 0.16s, background 0.16s;
    }

    .question-card:hover {
      box-shadow: 13px 13px 0 var(--ink);
    }

    .question-card__num {
      width: fit-content;
      border: var(--border);
      background: var(--ink);
      color: var(--yellow);
      padding: 5px 9px;
      font-family: var(--stamp);
      font-size: 26px;
      line-height: 1;
      letter-spacing: 0.08em;
    }

    .question-card strong {
      font-family: var(--display);
      font-size: clamp(18px, 2.4vw, 34px);
      line-height: 1;
      text-transform: uppercase;
    }

    .question-card small {
      border-top: var(--border);
      padding-top: 12px;
      font-size: 12px;
      font-weight: 800;
      line-height: 1.55;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 24px;
      flex-wrap: wrap;
      padding: clamp(28px, 4vw, 56px);
      background: var(--pink);
      border-top: var(--border-thick);
    }

    .footer__brand {
      font-size: clamp(24px, 4vw, 52px);
    }

    .logo {
      width: clamp(58px, 7vw, 96px);
      aspect-ratio: 1;
      border: var(--border);
      display: grid;
      place-items: center;
      background: white;
      box-shadow: 7px 7px 0 var(--ink);
      overflow: hidden;
      font-weight: 900;
      flex: 0 0 auto;
    }

    .logo svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    .logo--linkedin { background: #0a66c2; color: white; font-family: Arial, sans-serif; font-size: clamp(40px, 5vw, 64px); text-transform: lowercase; }
    .logo--amazon { background: #111; color: #ff9900; }
    .logo--netflix { background: #090909; padding: 8px; }
    .logo--google { background: white; font-family: Arial, sans-serif; font-size: clamp(46px, 6vw, 72px); }
    .google-g {
      background: conic-gradient(from -20deg, #4285f4 0 24%, #34a853 24% 42%, #fbbc05 42% 62%, #ea4335 62% 78%, #4285f4 78% 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .logo--uber { background: #000; color: white; font-family: Arial, sans-serif; font-size: clamp(20px, 2.5vw, 32px); }
    .logo--airbnb { background: #ff5a5f; color: white; padding: 8px; }
    .logo--microsoft { background: white; padding: 10px; }
    .logo--spotify { background: #0a0a0a; padding: 7px; }
    .logo--meta { background: #0668e1; color: white; padding: 6px; }

    .reveal {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.7s ease, transform 0.7s ease;
    }

    .reveal.is-visible {
      opacity: 1;
      transform: none;
    }

    @media (max-width: 980px) {
      .hero {
        grid-template-columns: 1fr;
      }

      .hero__copy {
        border-right: none;
        border-bottom: var(--border-thick);
      }

      .question-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 680px) {
      body,
      a {
        cursor: auto;
      }

      .cursor-dot { display: none; }

      .topbar {
        align-items: flex-start;
        flex-direction: column;
      }

      .topnav {
        justify-content: flex-start;
      }

      h1 {
        font-size: clamp(40px, 14vw, 74px);
      }

      .scoreboard {
        grid-template-columns: 1fr;
      }

      .scoreboard div:nth-child(n) {
        border-right: none;
        border-bottom: 3px solid var(--yellow);
      }

      .scoreboard div:last-child {
        border-bottom: none;
      }
    }
  </style>

  <script>
    const dot = document.getElementById("cursorDot");

    document.addEventListener("mousemove", (event) => {
      dot.style.left = event.clientX + "px";
      dot.style.top = event.clientY + "px";
    });

    document.querySelectorAll("a, .question-card").forEach((element) => {
      element.addEventListener("mouseenter", () => dot.classList.add("is-big"));
      element.addEventListener("mouseleave", () => dot.classList.remove("is-big"));
    });

    window.addEventListener("scroll", () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      document.getElementById("scrollProgress").style.transform = \`scaleX(\${progress})\`;
    }, { passive: true });

    const revealItems = document.querySelectorAll(".hero__copy, .scoreboard div, .section-head, .question-card");
    revealItems.forEach((item) => item.classList.add("reveal"));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => observer.observe(item));
  </script>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="supabase-config.js"></script>
  <script src="auth.js"></script>
  <script>window.DNDAuth && window.DNDAuth.init({ protect: false });</script>
</body>
</html>`;
}

for (const company of companies) {
  fs.writeFileSync(`${company.slug}.html`, render(company));
}

console.log(`Generated ${companies.length} company index pages.`);
