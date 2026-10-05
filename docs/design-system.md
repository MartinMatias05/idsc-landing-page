# Design System

The module follows the class design system and uses no module-specific colors, fonts or styles. The class design system is the one submitted and agreed in the course (see Google Classroom).

Module design source: [Web-Design-Landing-Page-Main](https://www.figma.com/design/BpFsOPmNJjEHGxVgl1QuwN/Web-Design-Landing-Page-Main?node-id=43-14) (canvas "Main Design").

## Screens

| Screen | Figma frame (node) | Content in the approved design |
|---|---|---|
| Home | [Landing Page](https://www.figma.com/design/BpFsOPmNJjEHGxVgl1QuwN/Web-Design-Landing-Page-Main?node-id=43-15) | Full |
| College programs | [PROGRAM COLLEGE UI](https://www.figma.com/design/BpFsOPmNJjEHGxVgl1QuwN/Web-Design-Landing-Page-Main?node-id=134-416) | Full |
| Senior High School | [PROGRAM SHS UI](https://www.figma.com/design/BpFsOPmNJjEHGxVgl1QuwN/Web-Design-Landing-Page-Main?node-id=166-28) | Full |
| Admission requirements | [ADMISSION REQUIREMENT UI](https://www.figma.com/design/BpFsOPmNJjEHGxVgl1QuwN/Web-Design-Landing-Page-Main?node-id=134-371) | Full |
| Estimated tuition | [ESTIMATED TUITION FEE UI](https://www.figma.com/design/BpFsOPmNJjEHGxVgl1QuwN/Web-Design-Landing-Page-Main?node-id=2027-625) | Full (fees unpublished) |
| Payment instructions | [ALTERNATIVE PAYMENT UI](https://www.figma.com/design/BpFsOPmNJjEHGxVgl1QuwN/Web-Design-Landing-Page-Main?node-id=2027-453) | Full |
| About | [ABOUT IDSC UI](https://www.figma.com/design/BpFsOPmNJjEHGxVgl1QuwN/Web-Design-Landing-Page-Main?node-id=134-608) | Title and background |
| Vision, Mission & Core Values | [frame](https://www.figma.com/design/BpFsOPmNJjEHGxVgl1QuwN/Web-Design-Landing-Page-Main?node-id=2027-801) | Title only |
| Hymn | [IDSC HYMN UI](https://www.figma.com/design/BpFsOPmNJjEHGxVgl1QuwN/Web-Design-Landing-Page-Main?node-id=169-6) | Title only |
| Laboratories / Academic Spaces / Clinic | [134:798](https://www.figma.com/design/BpFsOPmNJjEHGxVgl1QuwN/Web-Design-Landing-Page-Main?node-id=134-798), [2027:265](https://www.figma.com/design/BpFsOPmNJjEHGxVgl1QuwN/Web-Design-Landing-Page-Main?node-id=2027-265), [2027:356](https://www.figma.com/design/BpFsOPmNJjEHGxVgl1QuwN/Web-Design-Landing-Page-Main?node-id=2027-356) | Title only |
| Pre-registration | [REGISTER UI](https://www.figma.com/design/BpFsOPmNJjEHGxVgl1QuwN/Web-Design-Landing-Page-Main?node-id=2076-515) | Title only; informational |

## Module-specific components

Section label pill, notice card, program card, accordion card, process card, statistic ring, payment panel. They are built from the shared tokens; none introduces a new color, font or style. Anything missing from the class system is proposed to the class instead of designed locally.

## Design-scope limitations

These are limits of the approved design, not unfinished work:

* Pages marked "Title only" have a heading and the shared header/footer but no body content in Figma. The API marks them `contentStatus: "title-only"`, and the client shows the title with the shared layout. No content is invented.
* Pre-registration is informational only: no form, no login, no registration, no `POST` endpoint.

## Implementation corrections and assumptions

* "FULL-TIME FACULTU" → "Full-time Faculty".
* Figma Pulse cards (gray image boxes with sample labels) are replaced with realistic mock posts and real images in the coded client.
* Figma has only 1920px frames; tablet and phone layouts are derived from the same tokens.
* Dates display as `Sep 25, 2026` and money as `₱1,500.00`, formatted by the client from ISO dates and numbers.
