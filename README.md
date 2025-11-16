# Address Autocomplete PCF Control (Nominatim – OpenStreetMap)

The **Address Autocomplete PCF Control** enhances Dynamics 365 Model-Driven Apps by providing instant, intelligent address suggestions powered by the **Nominatim (OpenStreetMap) API**.  
As users type into the address field, the control retrieves real-time location matches, allowing quick selection and automatic population of address fields — improving accuracy and reducing manual input.

---

## 🚀 Features

### Real-Time Autocomplete (Nominatim API)
- Fetches live address suggestions directly from the OpenStreetMap Nominatim service.
- No API key or subscription required.

### 🌍 Configurable Country Filtering
- Supports one or multiple ISO country codes.
- Administrators can configure country filters via PCF control properties (e.g., `qa`, `ae`, `eg`).


### 💡 Modern UI / UX
- Clean styled input box.
- Keyboard navigation for suggestion list.
- Fast loading and responsive behavior.

### 📈 Improved Data Quality
- Standardized, geo-validated address data.
- Reduced manual data-entry errors.

### 🧩 Flexible Usage
Works on any entity requiring address information:
- Contact  
- Account  
- Case  
- Custom tables  

---

## ⚙️ How It Works

1. User begins typing an address.  
2. The PCF control sends an API request to:https://nominatim.openstreetmap.org/search?format=json&q={query}&countrycodes={country}&limit=5

3. Suggestions appear instantly under the input.
4. User selects a suggestion.
5. The control automatically parses the result and updates the configured CRM fields.

---

## 🔧 Configuration

Add these configurable properties in `ControlManifest.Input.xml`:

| Property        | Description |
|----------------|-------------|
| `CountryCodes` | Comma-separated list of country codes (e.g., `qa`, `ae`). |


---

## 📄 License

This control uses data from **OpenStreetMap** and **Nominatim**, provided under the **ODbL license**.

---



