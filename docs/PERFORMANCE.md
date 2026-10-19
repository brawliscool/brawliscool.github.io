# Website performance refactor

Baseline: `560c00142993e3972bb8de56ea4ab1a3a8e22a86`.

## Measured results

Local Chromium 153, a fresh browser context for each run, 100ms network latency,
200 KB/s download, 100 KB/s upload, and 4× CPU throttling. Resource bytes below
are decoded script, stylesheet, and image bodies requested on initial navigation;
they exclude the HTML document and HTTP headers. GitHub Pages compression, cache
behavior, real devices, and external AI latency are not represented.

| Initial homepage resources | Before | After | Reduction |
| --- | ---: | ---: | ---: |
| Mobile, 390px / DPR 1 | 85,302 B | 34,389 B | 59.7% |
| Desktop, 1440px / DPR 1 | 85,302 B | 54,614 B | 36.0% |
| JavaScript, both viewports | 19,603 B | 3,589 B | 81.7% |
| Mobile hero image | 41,984 B | 12,760 B | 69.6% |

At 48kHz, microphone IPC/WebSocket append messages decrease from 375 to 25 per
second (15× fewer messages). The 40ms batches preserve sample order and use
transferable buffers. This adds at most 40ms of batching delay. It does not reduce
raw audio bitrate or guarantee lower provider response latency.

There is no verified 10× whole-site speedup. Single-run first-contentful-paint
measurements were 1032→1000ms on mobile and 1096→864ms on desktop; these are
illustrative, not statistically established timing improvements.

## Changes

- Load only navigation/feature activation code initially. Prepare booking near
  the form or on interaction; load API submission code on first submission.
- Load the assistant dialog and stylesheet on demand. Load PCM/audio code only
  after voice is requested. Abort unused session requests and batch streamed text
  rendering once per animation frame.
- Repair booking initialization against the current single-page form. Keep
  package selection, duplicate-submit prevention, retry identifiers, entered
  details after errors, and the success message after resetting the form.
- Serve responsive AVIF sources with existing WebP fallback, correct image
  dimensions, and asynchronous image decoding.
- Remove unused third-party font/icon downloads from legal pages and share their
  stylesheet. Keep readable CSS in `src/css` and checked-in optimized output in
  `css`, so GitHub Pages needs no new build service.
- Use ES modules consistently and correct preview-server image MIME types.

## Maintenance and verification

```sh
npm ci
npm run build
npm test
npx playwright install chromium
npm run test:browser
```

`npm run images` regenerates AVIF variants from the checked-in WebP originals.
For an existing Chromium executable, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`
before running browser tests.

Verified: all 28 Node/DOM/audio tests; all five public pages at 320, 390, 760,
1024, and 1440px; mobile navigation; package preselection; booking submission;
assistant lazy loading, streamed text, voice-mode UI, close/reopen; no horizontal
overflow or browser JavaScript errors. Browser tests mock booking and xAI session
responses/WebSockets: they create no customer bookings or billable AI sessions.
Real microphone capture and live provider responses need a separate device check.
`npm audit` reports zero vulnerabilities.
