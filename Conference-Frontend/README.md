# East Africa Bio-Inputs Conference — Frontend

Frontend starter for **The 1st East Africa Bio-Inputs Conference**.

## Conference information currently used

- **Dates:** 10th–11th February 2027
- **Location:** Nairobi, Kenya
- **Theme:** Scaling bio-inputs for sustainable food systems transformation, climate resilience and green growth in East Africa

## Stack

- Next.js
- React
- TypeScript
- CSS
- Lucide React

## 1. Put this folder beside the backend

```text
Event Management System/
├── conference-backend/
└── conference-frontend/
```

## 2. Configure the API

Copy `.env.local.example` to `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

If your backend runs on another port/domain, change the value.

## 3. Install and run

```bash
npm install
npm run dev
```

Open:

`http://localhost:3000`

## Backend endpoints already integrated

Participant:
- `GET /api/participants/categories`
- `POST /api/participants`

Exhibitor:
- `GET /api/exhibitors/fee`
- `POST /api/exhibitors`

## Important backend work still required

1. The current participant/exhibitor controllers insert `id_passport`, but the supplied schema does not define an `id_passport` column. Align the schema/controller before testing registration.
2. The supplied backend has no abstract table/controller/route. The abstract page is therefore informational until the API is added.
3. Payment currently accepts a `payment_reference`, not an uploaded payment proof. Add multipart file upload if the organizers require screenshots/slips.
4. Final participant categories, prices, payment instructions, venue, contacts, deadlines and partner logos should be inserted only after approval by the conference team.

## Suggested next build order

1. Fix the three backend gaps above.
2. Add payment-reference submission to the frontend after registration.
3. Build abstract submission API + page.
4. Build admin dashboard.
5. Add approved branding, photos, partner logos and venue.
6. Test all registration/payment flows end-to-end.
