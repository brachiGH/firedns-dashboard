# Next.js Foundations Course - README

This README provides an overview of the course and instructions for launching the project you'll build.

---

### **What I Build**

Creating a financial dashboard application with the following features:

- **Public Home Page**: A welcoming page accessible to all users.
- **Login Page**: A secure login page for authentication.
- **Dashboard Pages**: Protected pages accessible only to authenticated users.
- **Invoice Management**: The ability for users to:
  - Add new invoices
  - Edit existing invoices
  - Delete invoices
- **Database Integration**: A Postgres database to store and manage data.

---

## **Features Covered**

### **Core Next.js Topics**
- **Styling**: Explore various styling methods in Next.js.
- **Optimizations**: Learn techniques for optimizing images, links, and fonts.
- **Routing**: Implement nested layouts and pages using file-system routing.

### **Full-Stack Development**
- **Data Fetching**: 
  - Set up a Postgres database on Vercel.
  - Learn best practices for fetching and streaming data.
- **Search and Pagination**: Use URL search parameters to implement these features.
- **Data Mutations**: Utilize React Server Actions and revalidate the Next.js cache.
  
### **Advanced Features**
- **Error Handling**: Handle general errors and 404 pages.
- **Form Validation & Accessibility**: 
  - Perform server-side form validation.
  - Implement accessibility improvements.
- **Authentication**: Secure your application using NextAuth.js and middleware.
- **Metadata**: Add metadata for better social sharing.

---

## **Prerequisite Knowledge**

To follow this course effectively, you should have a basic understanding of:

- **React**: Components, props, state, hooks, Server Components, and Suspense.
- **JavaScript**: ES6+ features like promises, async/await, and modules.

If you're new to React, we recommend starting with our **React Foundations** course.

---

## **System Requirements**

Ensure your system meets the following requirements before starting:

- **Node.js**: Version 18.18.0 or later ([Download Node.js](https://nodejs.org/)).
- **Operating Systems**: macOS, Windows (including WSL), or Linux.

---

## **Getting Started**

### **1. Install Dependencies**
This project uses `pnpm` for dependency management. If you don’t have `pnpm` installed, run: 

```bash
npm install -g pnpm
```

Then install the dependencies:

```bash
pnpm install
```

### **2. Configure Environment Variables**
This project requires environment variables to be configured for the database connection. 

1. Open the `.env.example` file located in the root directory.
2. Set the following variables with your desired values:
   ```env
   POSTGRES_USER=
   POSTGRES_PASSWORD=
   POSTGRES_HOST=
   POSTGRES_PORT=
   POSTGRES_DATABASE=
    ```
If you're unsure, you can use the default values in the file. 3. Rename .env.example to .env.

Additionally, ensure the database configuration in database/docker-compose.yml matches your .env values. Alternatively, use the default values and simply rename .env.example to .env.

### **3. Set Up the Database**

The project uses a Postgres database, managed through Docker Compose. Navigate to the database folder and launch the database using:

```bash
docker-compose up -d
```

### **4. Launch the Project**

To start the development server, return to the project root directory and run:

```bash
pnpm dev
```
This will start the application at http://localhost:3000.

## Screenshots

![Desktop and Mobile Views: Refer to the provided screenshots to visualize the final dashboard design for both desktop and mobile devices.](/public/readme/home-page-with-hero.avif)


## Next.js App Router Course - Starter

This is the starter template for the Next.js App Router Course. It contains the starting code for the dashboard application.

For more information, see the [course curriculum](https://nextjs.org/learn/dashboard-app/getting-started) on the Next.js Website.

---

Feel free to check out the source code or leave feedback on improvements! 😊
