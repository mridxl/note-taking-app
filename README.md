# Note Taking App

A modern, feature-rich note taking application built with Next.js and Supabase.

## Features

- **User Authentication**: Secure login and registration
- **Create and Edit Notes**: Write and update your notes.
- **Mobile Responsive**: Works on all devices
- **Dark/Light Mode**: Choose your preferred theme
- **Google AI Integration**: Smart features powered by Google AI

## Tech Stack

This application is built with the following technologies:

- [Next.js](https://nextjs.org) - React framework for server-side rendering and static site generation
- [Supabase](https://supabase.io) - Backend as a service for database and authentication
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI component library

## Getting Started

### Prerequisites

- Node.js
- pnpm

### Installation

1. Clone the repository
2. Install dependencies

```bash
pnpm install
```

3. Create a `.env` file with your environment variables (see `.env.example`)
4. Run the development server

```bash
pnpm dev
```

## Project Structure

- `/src/app` - Next.js app router
  - `/(auth)` - Authentication routes (login, register)
  - `/(protected)` - Routes that require authentication
    - `/notes` - Note management pages
- `/src/components` - Reusable UI components
- `/src/lib` - Utility functions and libraries
  - `/supabase` - Supabase client and type definitions

## Deployment

This app can be deployed on Vercel or any other Next.js compatible hosting service.

## License

MIT
