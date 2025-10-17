# JS Projects 2

A collection of JavaScript projects.

This repository was created in September 2025.

GitHub: [https://github.com/k26rahul/js-projects-2](https://github.com/k26rahul/js-projects-2)

Live site: [https://k26rahul.github.io/js-projects-2/](https://k26rahul.github.io/js-projects-2/)

## Projects

- [Practice folder](https://k26rahul.github.io/js-projects-2/practice)
- [YouTube CC Extractor](https://k26rahul.github.io/js-projects-2/yt-cc-extractor)
- [Loan Calculator](https://k26rahul.github.io/js-projects-2/loan-calculator)
- [Testimonials](https://k26rahul.github.io/js-projects-2/testimonials)
- [Image Search App 2](https://k26rahul.github.io/js-projects-2/image-search-app-2)
- [Image Search App](https://k26rahul.github.io/js-projects-2/image-search-app)
- [Rem vs. Px](https://k26rahul.github.io/js-projects-2/rem-vs-px)
- [Array Methods](https://k26rahul.github.io/js-projects-2/array-methods)
- [WhatsApp Layout](https://k26rahul.github.io/js-projects-2/wa-layout)
- [Flexbox Demo](https://k26rahul.github.io/js-projects-2/flexbox-demo)
- [CGPA Calculator 2](https://k26rahul.github.io/js-projects-2/cgpa-calculator-2)
- [CGPA Calculator](https://k26rahul.github.io/js-projects-2/cgpa-calculator)
- [Calculator](https://k26rahul.github.io/js-projects-2/calculator)

## Scripts

Python scripts used for project maintenance:

### process_images.ipynb

Processes project screenshots:

1. Copies `s.jpg` → `screenshot.jpg`
2. Crops to 4:3 aspect ratio
3. Resizes to 400px width
4. Optimizes file size
5. Deletes original `s.jpg`

### generate_projects_json.ipynb

Generates `assets/projects_data.json` by:

1. Scanning project folders for `index.html` files
2. Extracting metadata from OpenGraph tags
3. Adding creation timestamps
4. Sorting projects by creation date
5. Writing JSON output

### add_og_meta_tags.ipynb

Manages OpenGraph meta tags in project pages:

1. Reads project data from `projects_data.json`
2. Injects OpenGraph meta tags after `<title>` tag
3. Preserves existing formatting
4. Can preview changes before applying
5. Skips files that already have OG tags
