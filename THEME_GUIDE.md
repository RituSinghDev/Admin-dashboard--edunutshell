# EduNutshell Website Theme Guide

This document contains all the design system, colors, typography, and styling guidelines used in the EduNutshell website. Use this as a reference when building the admin dashboard to maintain consistency.

---

## 🎨 Color Palette

### Primary Colors
- **Primary Blue**: `#2563eb` (blue-600)
- **Secondary Blue**: `#3b82f6` (blue-500)
- **Light Blue**: `#dbeafe` (blue-50)
- **Dark Blue**: `#1e40af` (blue-700)
- **Indigo**: `#4f46e5` (indigo-600)

### Background Colors
- **White**: `#ffffff`
- **Light Gray**: `#f8fafc` (slate-50)
- **Gray**: `#f1f5f9` (slate-100)
- **Dark Background**: `#0f172a` (slate-900)
- **Blue Background**: `#1e3a8a` (blue-900)

### Text Colors
- **Primary Text**: `#111827` (gray-900)
- **Secondary Text**: `#6b7280` (gray-600)
- **Light Text**: `#9ca3af` (gray-400)
- **White Text**: `#ffffff`

### Accent Colors
- **Success Green**: `#10b981` (green-500)
- **Warning Yellow**: `#fbbf24` (yellow-400)
- **Error Red**: `#ef4444` (red-500)
- **Purple**: `#8b5cf6` (purple-500)
- **Orange**: `#f97316` (orange-500)

### Gradient Combinations
```css
/* Hero Gradient */
background: linear-gradient(to bottom right, #1e3a8a, #1e40af, #0f172a);

/* Button Gradient */
background: linear-gradient(to right, #2563eb, #1e40af);

/* Card Glow Effect */
box-shadow: 
  -10px -10px 35px rgba(16, 185, 129, 0.3),
  10px 10px 35px rgba(59, 130, 246, 0.3);
```

---

## 📝 Typography

### Font Family
- **Primary Font**: Inter (sans-serif)
- **Fallback**: system-ui, -apple-system, sans-serif

### Font Sizes
- **Heading 1**: `text-4xl` (36px) to `text-6xl` (60px) - responsive
- **Heading 2**: `text-3xl` (30px) to `text-5xl` (48px) - responsive
- **Heading 3**: `text-2xl` (24px) to `text-4xl` (36px) - responsive
- **Heading 4**: `text-xl` (20px) to `text-2xl` (24px) - responsive
- **Body Large**: `text-lg` (18px) to `text-xl` (20px)
- **Body**: `text-base` (16px)
- **Body Small**: `text-sm` (14px)
- **Caption**: `text-xs` (12px)

### Font Weights
- **Bold**: `font-bold` (700)
- **Semibold**: `font-semibold` (600)
- **Medium**: `font-medium` (500)
- **Regular**: `font-normal` (400)

---

## 🔘 Buttons

### Primary Button
```css
className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
```

### Secondary Button
```css
className="bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-all"
```

### Ghost Button
```css
className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-4 py-2 rounded-lg transition-all"
```

### Disabled State
```css
className="disabled:opacity-50 disabled:cursor-not-allowed"
```

---

## 📦 Cards

### Standard Card
```css
className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300"
```

### Card with Glow Effect (Course Cards)
```css
className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-transparent course-card-glow"
```

### Dark Card (Testimonials)
```css
className="bg-white/10 backdrop-blur-md rounded-2xl p-5 hover:bg-white/15 transition-all border border-white/20"
```

---

## 🎭 Animations

### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in { animation: fadeIn 0.6s ease-in; }
```

### Slide Up
```css
@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up { animation: slideUp 0.8s ease-out; }
```

### Scale In
```css
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
.animate-scale-in { animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
```

### Fade In Visible (Scroll Trigger)
```css
.fade-in-visible {
  opacity: 1 !important;
  transform: translateY(0) !important;
}
```

---

## 📐 Spacing & Layout

### Container
```css
className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
```

### Section Padding
```css
className="py-16 sm:py-20 md:py-24"
```

### Grid Layouts
```css
/* 3 Column Grid */
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"

/* 4 Column Grid */
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
```

### Border Radius
- **Small**: `rounded-lg` (8px)
- **Medium**: `rounded-xl` (12px)
- **Large**: `rounded-2xl` (16px)
- **Full**: `rounded-full` (9999px)

---

## 🖼️ Form Elements

### Input Field
```css
className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
```

### Input Error State
```css
className="border-red-500 focus:ring-red-500"
```

### Select Dropdown
```css
className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
```

### Textarea
```css
className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
```

### Label
```css
className="block text-sm font-semibold text-gray-700 mb-2"
```

### Error Message
```css
className="text-red-500 text-xs mt-1"
```

---

## 🎯 Badges & Tags

### Primary Badge
```css
className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium"
```

### Secondary Badge
```css
className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold"
```

### Category Badge
```css
className="bg-white px-3 py-1 rounded-lg text-sm font-semibold text-blue-600 shadow-sm"
```

---

## 🌟 Special Effects

### Backdrop Blur
```css
className="backdrop-blur-md bg-white/80"
```

### Glass Morphism
```css
className="bg-white/10 backdrop-blur-md border border-white/20"
```

### Glow Effect (Hover)
```css
/* Applied via course-card-glow class */
box-shadow:
  -10px -10px 35px rgba(16, 185, 129, 0.3),
  10px 10px 35px rgba(59, 130, 246, 0.3),
  0 0 40px rgba(16, 185, 129, 0.2),
  0 10px 25px rgba(0, 0, 0, 0.3);
```

### Floating Animation
```css
@keyframes float-slow {
  0%, 100% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(-20px) translateX(10px); }
}
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X Extra large devices */
```

---

## 🎨 Component-Specific Styles

### Navbar
- **Background**: `bg-white/80 backdrop-blur-lg`
- **Shadow**: `shadow-lg`
- **Border Radius**: `rounded-full`
- **Height**: `h-16`
- **Position**: `fixed w-full z-50`

### Footer
- **Background**: `bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900`
- **Text Color**: `text-white`
- **Padding**: `py-16`

### Hero Section
- **Background**: `bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900`
- **Text Color**: `text-white`
- **Padding**: `py-20`

### Course Cards
- **Border**: `border border-gray-200`
- **Hover Effect**: `hover:-translate-y-1 hover:shadow-xl`
- **Transition**: `transition-all duration-500`
- **Special Class**: `course-card-glow`

### Modal/Popup
- **Backdrop**: `bg-black/60 backdrop-blur-md`
- **Container**: `bg-white rounded-2xl shadow-2xl`
- **Z-Index**: `z-[9999]`

---

## 🔗 Links & Navigation

### Primary Link
```css
className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
```

### Navigation Link (Active)
```css
className="text-blue-600 font-medium"
```

### Navigation Link (Inactive)
```css
className="text-gray-600 hover:text-gray-900 transition-colors"
```

---

## 📊 Stats & Metrics Display

### Stat Card
```css
className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow"
```

### Stat Value
```css
className="text-4xl font-bold text-gray-900 mb-2"
```

### Stat Label
```css
className="text-gray-600"
```

---

## 🎬 Loading States

### Spinner
```html
<svg className="animate-spin h-5 w-5 text-white">
  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
</svg>
```

### Skeleton Loader
```css
className="animate-pulse bg-gray-200 rounded h-8 w-64"
```

---

## 🎯 Icons

### Icon Size Classes
- **Small**: `w-4 h-4`
- **Medium**: `w-5 h-5`
- **Large**: `w-6 h-6`
- **Extra Large**: `w-8 h-8`

### Icon Colors
- **Primary**: `text-blue-600`
- **Secondary**: `text-gray-600`
- **Success**: `text-green-500`
- **Warning**: `text-yellow-500`
- **Error**: `text-red-500`

---

## 📋 Best Practices

1. **Always use responsive classes** (sm:, md:, lg:, xl:)
2. **Maintain consistent spacing** using Tailwind's spacing scale
3. **Use transition-all for smooth animations**
4. **Apply hover states** for interactive elements
5. **Use backdrop-blur** for modern glass effects
6. **Implement loading states** for better UX
7. **Add focus states** for accessibility
8. **Use semantic HTML** elements
9. **Maintain color contrast** for readability
10. **Test on multiple screen sizes**

---

## 🚀 Quick Reference

### Common Class Combinations

**Card with Hover**
```
bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1
```

**Section Container**
```
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20
```

**Gradient Background**
```
bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900
```

**Text Gradient**
```
bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent
```

---

## 📞 Contact & Support

For questions about the theme or design system, refer to this guide or check the component implementations in:
- `/components/ui/` - Reusable UI components
- `/components/home/` - Homepage sections
- `/app/globals.css` - Global styles and animations

---

**Last Updated**: 2025
**Version**: 1.0
**Framework**: Next.js 15 + Tailwind CSS
