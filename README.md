# CQVS Chem Connect — Custom Shopify Theme

## Overview

A complete custom Shopify Online Store 2.0 theme for CQVS Chem Connect — a B2B chemical marketplace connecting concrete plants, quarries, and industrial sites directly with Australian chemical manufacturers.

## Quick Start

1. Connect this GitHub repo to Shopify via **Settings > Sales channels > Online Store > Themes > Add theme > Connect from GitHub**
2. Set as live theme
3. Create a collection called **"All Products"** containing all published products
4. In the theme editor, go to the homepage product-grid section and assign the "All Products" collection
5. Configure the header navigation links in the theme editor

## Theme Architecture

- Shopify Online Store 2.0 compliant (JSON templates, modular sections)
- Buildless — no webpack, no npm, no compilation. Shopify GitHub integration deploys directly.
- Dark theme with teal/green accents
- Mobile-first responsive design
- Performance-first: conditional CSS loading, deferred JS, lazy images

## File Structure

| Directory | Purpose |
|---|---|
| `layout/` | Theme layout wrappers (e.g. `theme.liquid`) — the outermost HTML shell that wraps every page |
| `sections/` | Modular, reusable page sections (header, footer, product grid, hero, etc.) — each section is independently configurable in the theme editor |
| `snippets/` | Reusable partial templates (product cards, icons, loyalty badges, etc.) — included by sections and templates |
| `templates/` | JSON page templates that define which sections appear on each page type (index, product, collection, cart, account, etc.) |
| `assets/` | Static assets — CSS stylesheets, JavaScript files, images, and fonts |
| `config/` | Theme settings schema (`settings_schema.json`) and current setting values (`settings_data.json`) |
| `locales/` | Translation files for theme strings (e.g. `en.default.json`) |

## Metafield Setup

### Product Metafields

Create these in **Shopify Admin > Settings > Custom data > Products**:

| Namespace.Key | Type | Description |
|---|---|---|
| `custom.cas_number` | Single line text | CAS Registry Number |
| `custom.active_ingredient` | Single line text | Primary active ingredient |
| `custom.ingredient_percentage` | Single line text | Concentration range |
| `custom.formulation_verified` | Boolean | Verified formulation match |
| `custom.dg_class` | Single line text | DG classification number |
| `custom.coming_soon` | Boolean | Not yet available |
| `custom.sds_url` | URL | Safety Data Sheet link |
| `custom.research_notes` | Multi-line text | Technical notes |
| `custom.similar_products` | JSON | Competitor comparison data |
| `custom.is_ibc` | Boolean | Available in IBC format |
| `custom.ibc_litres_per_unit` | Integer | Litres per IBC (typically 1000) |

### Metafield Values to Set

#### Green Acid Replacement (`white-label-green-acid-replacement-1`)

- `cas_number`: 7664-38-2
- `active_ingredient`: Phosphoric Acid
- `ingredient_percentage`: 15-30%
- `formulation_verified`: true
- `is_ibc`: true
- `ibc_litres_per_unit`: 1000
- `similar_products` JSON:

```json
[
  { "name": "Elora ECSB", "price_per_litre": "$3.20/L" },
  { "name": "Vital Alternatives VA-100", "price_per_litre": "$2.85/L" },
  { "name": "Castle Aluclean", "price_per_litre": "$3.10/L" },
  { "name": "Industrial Phosphoric 33%", "price_per_litre": "$2.90/L" }
]
```

#### Agi Acid (`white-label-agi-acid-1`)

- `cas_number`: 7647-01-0
- `active_ingredient`: Hydrochloric Acid
- `ingredient_percentage`: 10-15%
- `formulation_verified`: true
- `dg_class`: 8
- `is_ibc`: true
- `ibc_litres_per_unit`: 1000

#### Agi Gel (`agi-gel`)

- `cas_number`: 7647-01-0
- `active_ingredient`: Hydrochloric Acid (Gel)
- `ingredient_percentage`: 10-15%
- `formulation_verified`: true
- `dg_class`: 8
- `is_ibc`: true
- `ibc_litres_per_unit`: 1000

#### AdBlue (`adblue`)

- `cas_number`: 7732-18-5
- `active_ingredient`: Urea Solution
- `ingredient_percentage`: 32.5%
- `formulation_verified`: true
- `is_ibc`: true
- `ibc_litres_per_unit`: 1000

#### IBC Products

The following products should have `is_ibc`: true and `ibc_litres_per_unit`: 1000:

- Eco Wash
- Elora ECSR
- Truck Wash Premium
- Truck Wash Standard

#### Non-IBC Products

The following products should have `is_ibc`: false:

- AluBright
- BrakePrep
- Heavy Duty Hand Cleaner
- Vision

### Customer Metafields

Create in **Settings > Custom data > Customers**:

| Namespace.Key | Type | Description |
|---|---|---|
| `loyalty.enrolled` | Boolean | Opted into loyalty |
| `loyalty.total_ibc_litres` | Integer | Running IBC litres since last reward |
| `loyalty.rewards_earned` | Integer | Lifetime rewards count |
| `loyalty.most_ordered_product` | Single line text | Handle of most-ordered IBC product |
| `loyalty.active_discount_code` | Single line text | Current unredeemed discount code |

## Loyalty Program Setup

### How It Works

For every **10,000L** ordered of IBC products, the customer earns a unique discount code for **1,000L FREE** of their most-ordered IBC product.

### Enrollment Flow

1. Customer clicks **"Join Loyalty Program"** on their account page
2. The button adds the `loyalty-enrolled` tag to the customer
3. Shopify Flow detects the tag and sets `loyalty.enrolled = true`

### Shopify Flow Automation

Create a Flow with:

- **Trigger**: Order paid
- **Condition**: Customer has tag `loyalty-enrolled`
- **Actions**:
  1. For each line item where product has `custom.is_ibc = true` and variant title contains "1000": Add `(quantity x 1000)` to `loyalty.total_ibc_litres`
  2. Track most-ordered product (update `loyalty.most_ordered_product`)
  3. If `loyalty.total_ibc_litres >= 10,000`:
     - Create discount code (100% off, 1 use, specific product)
     - Set `loyalty.active_discount_code` to the generated code
     - Email customer with their reward code
     - Reset litres (carry over any excess above 10,000)
     - Increment `loyalty.rewards_earned`

### Testing

1. Create a test customer and add the tag `loyalty-enrolled`
2. Set `loyalty.enrolled = true` manually
3. Set `loyalty.total_ibc_litres` to various values (e.g. 7500) to test the progress bar
4. Set `loyalty.active_discount_code` to a test code to verify code display and copy functionality

## Known Pricing Issues

1. **Agi Gel 200L variant**: Priced at $2,210.00 (same as 1000L). Should likely be ~$530-$550.
2. **Eco Wash 200L variant**: Priced at $1,800.00 (same as 1000L). Should likely be ~$430.
3. **AluBright pricing**: $3.40 for 20L and $4.50 for 5L appear to be per-litre prices entered as total prices. Expected totals: 20L = ~$68, 5L = ~$22.50.
4. **Vision Glass Cleaner pricing**: Same issue — $2.00 for 20L and $2.50 for 5L appear to be per-litre rates.
5. **BrakePrep unit pricing**: The 20L variant has Unit Price Total Measure: 200L which appears to be a copy error.
6. **Truck Wash Standard variant names**: Options are `plastic-container` and `blue-drum` instead of "1000L IBC" and "200L Blue Drum".
7. **Empty variants**: Several products have a third blank variant with no price/size that should be deleted.

## Theme Customization

- All colors, fonts, and content are customizable via the Shopify theme editor
- Go to **Online Store > Themes > Customize** to edit sections
- Each homepage section can be reordered, hidden, or configured
- Product cards, loyalty banners, and CTAs all have editable text

## Development

- No build step required — edit files directly, push to GitHub, Shopify syncs automatically
- For local dev, use Shopify CLI: `shopify theme dev`
- File conventions: `sections/` for page sections, `snippets/` for reusable components, `assets/` for CSS/JS
- CSS follows BEM methodology, mobile-first with breakpoints at 640px and 1024px
- JavaScript is vanilla ES6+, no dependencies
