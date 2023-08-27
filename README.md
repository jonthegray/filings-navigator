# README

## Installation

- `bundle install`

## Prepare DB

- `rake db:migrate`
- `rake db:seed`

## Build JS/CSS bundles

The frontend uses esbuild to create bundles in `app/assets/react/`. Both bundles have sourcemaps
for in-browser debugging.

- `reactRoot.js`
- `styles.css`

Steps to bundle:

- Install `node` 18.x and corresponding `npm`
- `cd ui`
- `npm install`
- `npm run build`

## Running the server

- `rails s`

## API Documentation

### GET /api/awards

- `filing_id: Integer`
- `min_amount: Float`
- `max_amount: Float`
- `page: Integer`
  - Page size is 50

### GET /api/awards/[id]

### GET /api/filers

### GET /api/filers/[id]

### GET /api/filings

- `filer_id: Integer`

### GET /api/filings/[id]

### GET /api/recipients

- `state: String`
- `filing_id: Integer`
- `min_amount: Float`
- `max_amount: Float`

### GET /api/recipients/[id]

## Frontend Documentation

The frontend is written in React and TypeScript, with ESLint for code inspection.

### Rendering Flow

- `erb` file renders a `<react-root>` web component with the specified `page`
- The web component (`ui/root/react-root.ts`) connects and creates the React root element
- The React root element (`ui/views/ReactRoot.tsx`) provides basic layout and dispatches page content to
the appropriate views

### Awards Page Flow

The Awards page (`ui/views/AwardsPage.tsx`) uses several React-specific tools and concepts:

- The list of awards, current page, and filtering options are stored in state.
  - In React, components re-render whenever props or state change.
- On mount, the lists of filings and recipients are loaded from the server into refs.
  - In React, refs are used for persisting data between renders when changes to the data should
not trigger re-renders.
  - Refs are implemented as a "box" or data container, and `.current` contains the actual value of the ref.
- When the filter values or page changes, the state values are updated and trigger a re-render.
  - React effects run after every render, including the initial mount.
  - The second argument to `useEffect` is an array of dependencies that trigger the effect to run. For example
the load page effect triggers when the `page` state value changes, and the initial load of filings and recipients
only runs on mount (`[]` means no dependencies i.e. only run the effect on mount).
  - The page change effect uses a ref called `isMounted`, which is a common React pattern for only running an
effect on update renders, not the initial mount.
- Callbacks like `min/maxChanged` and `goNext/Previous` are normal event handlers.
  - `React.useCallback` is a performance optimization that memoizes the function to return a stable instance
between renders. Similar to `useEffect`, `useCallback` takes a dependency array argument to specify when the
function should be re-memoized.

### Next Steps

If this project was to be used in production or continued, enhancements could include:

- Add production versions of frontend bundles: uglified, minified, no sourcemaps
- Add tests for API endpoints, query methods, automated UI tests
- Add custom API endpoints for client page loads (e.g. filings, recipients, and first page of awards for the Awards page)
- General UX improvements to Awards page: paging vs. infinite scroll with virtualization, count of results
- More investment in (or integration with existing) CSS theme: a nicer font, color palette, component library and/or
design system
- Code reorganization: Since React is more sandbox-ey than prescriptive, code organization and style is enforced by tools
like Prettier, linting, and--at worst--unenforced convention.
- Explore better patterns for documenting API endpoints and query parameters

### Total time: ~12 hours

## Background Information

Every year, US Nonprofit organizations submit tax returns to the IRS. The tax returns are converted into XML and made available by the IRS. These tax returns contain information about the nonprofit’s giving and/or receiving for the tax period. For this coding project, we will focus on the nonprofit’s attributes and the awards that they gave or received in a particular tax year.

These Organizations may file their taxes multiple times in a year (also known as filing amended returns). Only one return is considered valid, however. The valid return is the one with the most recent `ReturnTimestamp` (and/or the one with the `Amended Return Indicator`).

## Key Definitions

- Filers are nonprofit organizations that submit tax return data to the IRS.
- Awards are grants given by the filer to nonprofit organizations in a given year.
- Recipients are nonprofit organizations who have received awards given by a filer.
- Filings are the individual tax returns submitted by filers to the IRS for a given tax period. A filing contains awards given by the filer to recipients.

Example: "The filer’s 2015 filing declares that they gave 18 awards to 12 different recipients totalling $118k in giving"

## Backend Requirements

**Build a Rails or Sinatra web application that parses the IRS XML and stores the data into a database**

- Parse and store ein, name, address, city, state, zip code info for both filers and recipients
- Parse and store award attributes, such as purpose, cash amount, and tax period
- Generate an API to access the data. This API should support
  - Serialized filers
  - Serialized filings by filer
  - Serialized awards by filing
  - Serialized recipients
- Consider additional request parameters by endpoint (e.g. filter recipients by filing, filter recipients by state, filter recipients by cash amount, pagination, etc).
- Be sure to read the [Frontend Requirements](#frontend-requirements) when building and extending the API!
- Bonus points for deploying to Heroku

## Filing Urls

- https://filing-service.s3-us-west-2.amazonaws.com/990-xmls/201612429349300846_public.xml
- https://filing-service.s3-us-west-2.amazonaws.com/990-xmls/201831309349303578_public.xml
- https://filing-service.s3-us-west-2.amazonaws.com/990-xmls/201641949349301259_public.xml
- https://filing-service.s3-us-west-2.amazonaws.com/990-xmls/201921719349301032_public.xml
- https://filing-service.s3-us-west-2.amazonaws.com/990-xmls/202141799349300234_public.xml
- https://filing-service.s3-us-west-2.amazonaws.com/990-xmls/201823309349300127_public.xml
- https://filing-service.s3-us-west-2.amazonaws.com/990-xmls/202122439349100302_public.xml
- https://filing-service.s3-us-west-2.amazonaws.com/990-xmls/201831359349101003_public.xml

## Paths and Keys in XMLs for Related Data

- Filing Path: `Return/ReturnHeader`
  - Return Timestamp: `{ReturnTs}`
  - Tax Period: `{TaxPeriodEndDt,TaxPeriodEndDate}`
- Filer Path: `Return/ReturnHeader/Filer`
  - EIN: `EIN`
  - Name: `{Name,BusinessName}/{BusinessNameLine1,BusinessNameLine1Txt}`
  - Address: `{USAddress,AddressUS}`
  - Line 1: `{AddressLine1,AddressLine1Txt}`
  - City: `{City,CityNm}`
  - State: `{State,StateAbbreviationCd}`
  - Zip: `{ZIPCode,ZIPCd}`
- Award List Path: `Return/ReturnData/IRS990ScheduleI/RecipientTable`
  - Amended Return Indicator: `{AmendedReturnInd}`
  - EIN: `{EINOfRecipient,RecipientEIN}`
  - Recipient Name: `{RecipientNameBusiness,RecipientBusinessName}/{BusinessNameLine1,BusinessNameLine1Txt}`
  - Recipient Address: `{USAddress,AddressUS}`
    - Line 1: `{AddressLine1,AddressLine1Txt}`
    - City: `{City,CityNm}`
    - State: `{State,StateAbbreviationCd}`
    - Zip: `{ZIPCode,ZIPCd}`
  - Award Amount: `{AmountOfCashGrant,CashGrantAmt}`

\* Paths may vary by schema version

## Frontend Requirements

Go ahead and show off! Build something fun that utilizes the API. Consider building a UI that enables a customer to explore the historical giving of a filer. What information is relevant? How should someone navigate the data? Obviously, you don’t have infinite time, so feel free to stub out functionality or leave comments for things you didn’t get around to finishing. We understand!

The only requirements for the frontend are that you leverage your new API in Javascript (please, no Backbone.js).

## How to deliver your code

Please fork this repo into a Github repository and share access with the following Github accounts.

- [@eyupatis](https://github.com/eyupatis)
- [@gsinkin-instrumentl](https://github.com/gsinkin-instrumentl)
- [@instrumentl707](https://github.com/instrumentl707)
- [@roguelazer](https://github.com/roguelazer)
- [@bchaney](https://github.com/bchaney)

## Questions or Issues

Please don’t hesitate to contact engineering@instrumentl.com
