
# fluent-svelte-extra

An actively developed fork of the original fluent-svelte library, designed to introduce new components, enhance existing ones, and provide seamless theme management.


## ✨ What's New?
We've expanded the library to include several heavily requested components and quality-of-life fixes.

### New Components
 * ✅ TeachingTip
 * ✅ Flipper
 * ✅ GridView
 * ✅ Portal
 * ✅ RangeSlider
 * ✅ SegmentedControl
 * ✅ TextArea
 * ⚠️ NavigationView
 * ⚠️ SplitButton (Work in progress: RTL support is currently unavailable)
 * ⚠️ AcrylicSurface (Note: Partially unusable due to known Chromium compositor limitations)

### Enhancements & Fixes
 * Theme Management: Out-of-the-box support for switchable dark and light themes.
 * Fluid Animations: Improved the Expander component with smooth animation support, mirroring the native Windows Settings app.
 * Acrylic Filters: Added placeholder acrylic filters for various components, including Flyout, TeachingTip, and MenuItem.


## 🎨 Switching Between Themes
Along with the new components, we've overhauled how themes are handled. Depending on your project's needs, you can choose the stylesheet that works best for you:

### Option 1: Manual Theme Control

If you want explicit control over the theme, regardless of the user's system preferences:
 * Import `fluent-svelte-extra/switchable.css` into your `+layout.svelte` file.
 * Add either the `fds-theme-dark` or `fds-theme-light class` to the `<html>` tag in your `app.html` file.

   > Note: `switchable.css` does not utilize `prefers-color-scheme` media queries.


### Option 2: System Default with Manual Override

If you want to respect the user's system theme by default, but still allow manual toggling:
 * Import `fluent-svelte-extra/theme.css`.
 * The UI will use the system default until you explicitly add the `fds-theme-dark` or `fds-theme-light` class to your `<html>` tag.


## 📚 Documentation & Usage
Official documentation for our custom components is still a work in progress. For now, you can view detailed usage examples in our test routes here.


## 🤝 Contributing & Codebase Notes
Because our team was still learning Svelte when we initially forked this project, some of the older components may have inconsistencies or rely on suboptimal logic. While we now have the knowledge required to make these components highly efficient and consistent, our limited time prevents us from executing a full refactor right now.
But we are completely open to Pull Requests! If you'd like to help optimize the codebase, tackle some of the unfinished components, or improve consistency, your support is incredibly appreciated.


## 🙏 Acknowledgements
A massive thank you to Tropix126, the creator of the original fluent-svelte library, for building such an awesome foundation!
