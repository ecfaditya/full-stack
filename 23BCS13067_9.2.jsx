name: CI/CD Pipeline

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      # 1️⃣ Checkout the latest code
      - name: Checkout Repository
        uses: actions/checkout@v4

      # 2️⃣ Setup Node.js environment
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18

      # 3️⃣ Install dependencies
      - name: Install Dependencies
        run: npm ci

      # 4️⃣ Run tests
      - name: Run Tests
        run: npm test -- --watchAll=false

      # 5️⃣ Build project
      - name: Build Project
        run: npm run build

      # 6️⃣ Upload build artifacts (optional, for debugging or later deployment)
      - name: Upload Build Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: react-build
          path: build

  deploy:
    runs-on: ubuntu-latest
    needs: build-and-test
    if: github.ref == 'refs/heads/main'  # Only deploy from main branch

    steps:
      # 1️⃣ Checkout code again
      - name: Checkout Repository
        uses: actions/checkout@v4

      # 2️⃣ Setup Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18

      # 3️⃣ Install and build again (or download artifact)
      - name: Install Dependencies
        run: npm ci

      - name: Build Project
        run: npm run build

      # 4️⃣ Deploy to GitHub Pages (you can replace this with your hosting setup)
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
