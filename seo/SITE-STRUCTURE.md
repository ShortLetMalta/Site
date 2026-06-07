# Eleva Malta — Site Structure & URL Architecture
*Generated: 2026-05-18*

---

## Current Site (Webflow)

```
/ (Home)
├── /services
├── /locations
│   └── /locations/:slug  (CMS template)
├── /faq
├── /calculator
├── /investors
├── /blog
│   └── /blog/:slug       (CMS template)
├── /contact
└── /faq-items/:slug      (CMS template — should be hidden from nav)
```

**Missing pages (gaps vs competitors):**
- No `/about` or `/team`
- No `/owner-portal` or `/portal-demo` page
- No location-specific service pages (e.g., `/locations/sliema`)
- No case studies / results page
- No `/malta-short-let-regulations` or `/guides/*` section

---

## Target Architecture (12-month goal)

```
/ (Home)
│
├── /services                          [existing — expand]
│   ├── /services/airbnb-management    [new — core service page]
│   ├── /services/mta-licence          [new — licence application service]
│   ├── /services/dynamic-pricing      [new — AI pricing explainer]
│   └── /services/owner-portal         [new — portal feature page]
│
├── /locations                         [existing — expand]
│   ├── /locations/sliema              [priority 1]
│   ├── /locations/valletta            [priority 1]
│   ├── /locations/st-julians          [priority 1]
│   ├── /locations/gozo                [priority 2]
│   ├── /locations/st-pauls-bay        [priority 2]
│   ├── /locations/mdina               [priority 3]
│   ├── /locations/marsaskala          [priority 3]
│   └── /locations/mellieha            [priority 3]
│
├── /about                             [new — E-E-A-T critical]
│   └── /about/team                    [new — Person schema]
│
├── /results                           [new — case studies / testimonials]
│
├── /investors                         [existing — expand]
│
├── /guides                            [new — regulatory hub]
│   ├── /guides/mta-licence-malta      [new — definitive licence guide]
│   ├── /guides/short-let-tax-malta    [new — tax & eco-tax guide]
│   └── /guides/malta-2026-regulations [new — Legal Notice 92/2026]
│
├── /calculator                        [existing]
│
├── /faq                               [existing — add schema]
│
├── /blog                              [existing — activate content strategy]
│   └── /blog/:slug
│
└── /contact                           [existing]
```

---

## Priority Location Pages

Each location page must be **unique** — no copy-paste. Minimum 600 words per page.

| Page | Primary Keyword | Data to Include |
|------|----------------|-----------------|
| /locations/sliema | airbnb management sliema | 1,161 listings, top 25% earn €194+/night |
| /locations/valletta | airbnb management valletta | 633 listings, 85% occ, €132 ADR, ~€39k/yr |
| /locations/st-julians | airbnb management st julians | 80% occ, €133 ADR, ~€35k/yr |
| /locations/gozo | short let management gozo | farmhouses, longer stays, seasonal peaks |
| /locations/st-pauls-bay | airbnb management st pauls bay | family market, summer peak |

**What makes each unique:**
- Local landmarks and neighbourhoods
- Typical property types (apartments vs villas vs farmhouses)
- Guest profile (families, couples, digital nomads)
- Seasonal demand patterns
- Local regulations or building standards
- Eleva-specific owner testimonials from that area

---

## Schema Plan by Page Type

| Page | Schema Types |
|------|-------------|
| Home | `Organization`, `LocalBusiness`, `WebSite` |
| /services | `Service`, `ProfessionalService` |
| /services/* | `Service` with `provider` |
| /locations/* | `LocalBusiness` with `geo`, `areaServed` |
| /about | `Organization`, `AboutPage` |
| /about/team | `Person`, `ProfilePage` |
| /results | `Review`, `AggregateRating` |
| /faq | `FAQPage` |
| /guides/* | `Article`, `HowTo` or `FAQPage` |
| /blog/:slug | `BlogPosting`, `Article`, `Person` (author) |
| /investors | `Service`, `ProfessionalService` |

---

## Internal Linking Strategy

### Hub-and-Spoke Model

```
Home
 └── /services (hub)
      ├── /services/airbnb-management → links to /locations/* (spokes)
      ├── /services/mta-licence → links to /guides/mta-licence-malta
      └── /services/owner-portal → links to /calculator

/locations (hub)
 └── /locations/:city (spokes) → link back to /services, /calculator, /contact
```

### Blog → Money Page Links
- Every blog post targeting informational keywords must link to:
  - `/calculator` (revenue calculator)
  - Most relevant `/locations/:city` page
  - `/contact` or a CTA section

### Footer Links (ensure all core pages linked)
- /services, /locations, /faq, /about, /investors, /calculator, /contact

---

## URL Conventions

- Lowercase, hyphen-separated
- No trailing slashes (Webflow default)
- No dates in blog URLs (evergreen)
- Location pages: `/locations/[city-name]` not `/locations/[city-name]-airbnb-management` (too long)
- Blog: `/blog/[descriptive-slug]`

---

## Sitemap Priorities

| Page | Priority | Change Frequency |
|------|----------|-----------------|
| / | 1.0 | weekly |
| /services | 0.9 | monthly |
| /locations/* | 0.9 | monthly |
| /about | 0.8 | yearly |
| /investors | 0.8 | monthly |
| /calculator | 0.7 | monthly |
| /faq | 0.7 | monthly |
| /guides/* | 0.7 | monthly |
| /blog/:slug | 0.6 | yearly |
| /contact | 0.5 | yearly |

---

## Page Quality Gates

| Page Type | Min Words | Unique Content % | Schema Required |
|-----------|-----------|-----------------|-----------------|
| Home | 800 | 100% | LocalBusiness, Organization |
| Service page | 800 | 100% | Service |
| Location page | 600 | 60%+ | LocalBusiness with geo |
| Blog post | 1,000 | 100% | BlogPosting |
| Guide | 1,500 | 100% | Article or HowTo |
| FAQ | N/A | 100% | FAQPage |
