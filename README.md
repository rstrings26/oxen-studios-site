# Oxen Studios - Premium E-commerce Website

A modern, professional, mobile-friendly e-commerce website for Oxen Studios, specializing in premium oversized t-shirts.

## 🚀 Features

- **Splash Animation**: Brand introduction with smooth transitions
- **Product Catalog**: Grid layout with hover animations and product details
- **Shopping Cart**: Add/remove items with size selection
- **Checkout System**: Complete order form with validation
- **Google Sheets Integration**: Automatic order storage
- **Order Confirmation**: Animated success popup
- **Responsive Design**: Mobile-first approach for all devices
- **Modern UI**: Clean, minimalist design inspired by top fashion brands

## 📁 Project Structure

```
oxen/
├── index.html          # Main HTML file
├── style.css           # CSS styles and responsive design
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## 🛠️ Setup Instructions

### 1. Google Sheets Integration

1. Create a new Google Sheet
2. Add the following headers in row 1:
   - Name | Phone | City | Address | Shirt | Size | Payment | Date

3. Create a Google Apps Script:
   - Go to Extensions > Apps Script
   - Replace the default code with:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = e.parameter;

  sheet.appendRow([
    data.name || "",
    data.phone || "",
    data.city || "",
    data.address || "",
    data.shirt || "",
    data.size || "",
    data.payment || "",
    new Date()
  ]);

  return ContentService.createTextOutput("Success");
}
```

4. Deploy as a web app:
   - Click Deploy > New Deployment
   - Choose "Web app" as type
   - Set access to "Anyone"
   - Copy the web app URL

5. Update the script:
   - Open `script.js`
   - Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with your actual URL

### 2. Local Development

1. Open `index.html` in a web browser
2. The website will work locally for testing
3. For Google Sheets integration, you'll need to deploy to a web server

### 3. Deployment

For production deployment:

1. Upload all files to your web server
2. Ensure HTTPS is enabled (required for Google Sheets API)
3. Update the Google Apps Script URL in `script.js`
4. Test the complete order flow

## 🎨 Customization

### Products
Edit the `products` array in `script.js` to add/modify products:

```javascript
const products = [
    {
        id: 1,
        name: "Product Name",
        description: "Product description",
        price: 1999,
        image: "images/product-name.jpg",
        sizes: ["S", "M", "L", "XL", "XXL"],
        stock: "Limited Stock"
    }
];
```

### Styling
Modify `style.css` to change:
- Colors and fonts
- Layout and spacing
- Animations and transitions
- Mobile breakpoints

### Branding
Update in `index.html`:
- Company name and tagline
- Contact information
- Social media links

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- Mobile: < 480px
- Tablet: 480px - 768px
- Desktop: > 768px

## 🔧 Technical Features

- **Vanilla JavaScript**: No external dependencies
- **CSS Grid & Flexbox**: Modern layout techniques
- **Smooth Animations**: CSS transitions and keyframes
- **Form Validation**: Client-side validation
- **Error Handling**: Graceful error management
- **Performance**: Optimized images and lazy loading
- **Accessibility**: Keyboard navigation and screen reader support

## 🚀 Performance

- Optimized images from Unsplash
- Lazy loading for better performance
- Minimal external dependencies
- Compressed CSS and JavaScript
- Mobile-first responsive design

## 📞 Support

For technical support or customization requests, contact the development team.

## 📄 License

This project is proprietary to Oxen Studios. All rights reserved.

---

**Built with ❤️ for Oxen Studios**
