# Greenlane marketing demo production package

Status: **pre-production ready; video not yet recorded or exported**.

Project: Greenlane Logistics Quote Flow  
Classification: Public Build · Web Design & Development · Logistics  
Demo: https://greenlane-logistics-proof.usajames017.chatgpt.site  
Target duration: 75 seconds  
Versions: 16:9 portfolio/outreach master and separately framed 9:16 social cut

## The story

Possible problem: a logistics enquiry may begin in WhatsApp without the pickup, destination, package, date or contact details needed to prepare a quote. The team then collects the same information one message at a time.

Solution demonstrated: a service website and guided request flow that collects those details, lets the customer review them and presents one structured request to the business.

Evidence boundary: this demo proves the customer flow, validation, review, confirmation reference and simulated business view. It does not prove reduced response time, increased conversions or commercial results. It does not dispatch a rider, calculate a binding quote, store a request or notify a real business.

## Narration and shot list

| Time | Narration | Product footage and edit direction | On-screen caption |
|---|---|---|---|
| 00:00–00:07 | How many messages does it take to collect the details for one delivery quote? | Start with a simple animated sample conversation: “How much to deliver a package?” followed by question bubbles for pickup, destination and weight. Label it “Example enquiry”. | A delivery enquiry can start with missing details. |
| 00:07–00:15 | Pickup. Destination. Package. Delivery date. The business still needs the same information before it can prepare a quote. | Keep the sample conversation visible, then group the repeated questions into five field labels. Do not show a real person, phone number or company message. | The team still needs the same information. |
| 00:15–00:25 | I built Greenlane, a public logistics concept, to make that first step clearer. | Cut to the Greenlane homepage. Scroll from the hero to services and “How it works”. Keep the Public Build bar visible long enough to read. | Greenlane · Public Build |
| 00:25–00:34 | The customer chooses the delivery service and adds the pickup and destination. | Open “Request a delivery”. Select Same-day delivery. Enter fictional Lagos addresses. | 1 · Route |
| 00:34–00:42 | Then they describe the package and choose a preferred pickup date. | Enter “Parcel / box”, 2 kg, a future date and “Two pairs of shoes in a sealed box”. | 2 · Package |
| 00:42–00:49 | They leave their contact details so the team can respond. | Enter “Alex Demo”, a clearly fictional number and `alex@example.com`. Avoid typing animation that is too fast to read. | 3 · Contact |
| 00:49–00:57 | Before submitting, they review everything in one place. | Show the review screen, scroll once, check the demo acknowledgement and submit. | 4 · Review |
| 00:57–01:06 | Now the business receives one structured request instead of chasing each detail separately. | Show the generated reference, choose “See business view”, and frame the complete request. Add a small “Simulated business view” label. | One structured request. |
| 01:06–01:15 | The goal is a clearer starting point for the quote conversation. If your business handles a similar process manually, let’s see what could be improved. | End on a split composition: request view and the Barnx CTA. | Does your business handle this manually? · Request a solution |

## Recording data

Use these exact fictional values so every cut matches:

- Service: Same-day delivery
- Pickup: 12 Sample Street, Ikeja, Lagos
- Destination: 24 Example Road, Lekki, Lagos
- Package: Parcel / box
- Weight: 2 kg
- Date: any clearly visible future date at recording time
- Notes: Two pairs of shoes in a sealed box
- Customer: Alex Demo
- Phone: +234 800 000 0000
- Email: alex@example.com

Refresh the page before recording. Do not enter real contact details. Dismiss notifications, browser extensions and personal bookmarks from the capture area.

## Capture checklist

- Desktop master: record at 1920×1080 or 1440×900, 30 fps, 100% browser zoom.
- Mobile inserts: 390×844 or a comparable phone viewport; use as purposeful cutaways rather than stretching them across a landscape frame.
- Capture the homepage, services, request entry, package entry, contact entry, review, confirmation and business view.
- Record each shot with two seconds of stillness before and after the interaction.
- Keep pointer movement deliberate. Retake typing errors instead of hiding them with speed ramps.
- Record interface footage without narration; capture clean voice separately.
- Use captions that remain inside 9:16 and 16:9 safe areas.
- Label the sample chat, request and business view as examples or simulations.

## Edit specification

- 16:9 master: 1920×1080 H.264 MP4, 30 fps, AAC audio, approximately 8–12 Mbps.
- 9:16 social cut: 1080×1920. Recompose each shot; do not crop the desktop master blindly.
- Use the Greenlane green and white palette for captions and workflow graphics. Use Barnx branding only on the closing CTA.
- Keep motion functional: cursor emphasis, field labels, one workflow transition and the final CTA.
- Music is optional and must sit below narration. Use a licensed or platform-safe track.
- Captions should match `greenlane-marketing-demo.srt`; adjust only after the final narration timing is locked.

## Export and QA gate

Deliver:

- `greenlane-marketing-demo-16x9.mp4`
- `greenlane-marketing-demo-9x16.mp4`
- `greenlane-marketing-demo.srt`
- `greenlane-marketing-demo-poster.jpg`
- editable project/source file when available

Watch each export from start to finish. Verify readable text, correct fictional data, accurate claims, clear audio, safe-area captions, no personal notifications, and a working CTA. Upload to the chosen video host only after QA, then attach the hosted URL in the portfolio CMS. Until then, do not display “Watch Demo”.

## Remaining production dependency

The current execution environment has FFmpeg but no working browser recorder or installed browser runtime. A compliant export requires actual product footage, so this package deliberately does not manufacture a slideshow and call it a product demo. Record the listed shots with a browser capture tool, then the footage can be edited and exported against this specification.
