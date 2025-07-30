# BloodLink

### Contributors:
- Fikir Agunachew

---

### Project Synopsis:

#### Problem Statement:
Hospitals and emergency centers in Ethiopia face major challenges in finding matching blood donors quickly, especially in life-threatening situations. This delay can lead to preventable deaths.

#### Planned Solution:
BloodLink is a lightweight system that helps hospitals search for blood donors based on blood type and location. Donors register their details, and hospitals can search through a simple interface. Identity verification is planned via Fayda OIDC login (mocked in this version).
o
#### Expected Outcome:
A working prototype where:
- Donors are stored in a list (mock data).
- Hospitals can search for donors by blood type and location.
- Fayda login is simulated, preparing for future integration.

#### Fayda's Role:
Fayda will be used to verify donor identities, making the system reliable and secure. In this version, Fayda login is mocked using test values provided in the VeriFayda docs.

##### Mock Fayda Parameters Used:
- **Sub**: `0001`
- **Full Name**: `Test User`
- **Birth Date**: `1995-01-01`
- **Gender**: `Male`
- **Region**: `Addis Ababa`
- **Woreda**: `01`
- **Kebele**: `10`
- **Phone**: `0900000000`

#### Tech Stack:
	•	Frontend: React, TypeScript, Tailwind CSS
	•	Backend: Firebase (Firestore, Firebase Auth)
	•	Development & Testing: Replit (for quick prototyping and testing)
