# Caroom - Car Enthusiast Forum

A Next.js-based forum application for car enthusiasts to discuss, review, and share information about cars.

## Features

- **Authentication**
  - User registration and login
  - Secure password hashing with bcrypt
  - Session management with NextAuth.js

- **Posts Management**
  - Create, read, update, and delete posts
  - Different post types: discussions, reviews, questions, and news
  - Rich text content with titles and descriptions
  - Posts are associated with specific car models

- **Comments System**
  - Add comments to posts
  - Delete your own comments
  - Real-time comment updates

- **Car Database**
  - Comprehensive car catalog
  - Add, edit, and delete car entries
  - Car details including make, model, year, and images
  - Protection against deleting cars referenced in posts

- **User Interface**
  - Responsive design using Bootstrap
  - Clean and intuitive navigation
  - Loading states and error handling
  - Back-to-home navigation

## Tech Stack

- **Frontend:**
  - Next.js 15.4
  - React 19.1
  - Redux Toolkit for state management
  - Bootstrap 5.3 for styling

- **Backend:**
  - Next.js API routes
  - PostgreSQL database
  - NextAuth.js for authentication
  - Vercel Postgres for database hosting

- **Development:**
  - TypeScript
  - ESLint
  - Turbopack for faster development builds

## Getting Started

### Prerequisites

- Node.js 18 or later
- PostgreSQL database
- npm or yarn package manager

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
POSTGRES_URL=your_postgres_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/caroom.git
cd caroom
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Initialize the database:
```bash
# Visit this URL after starting the development server
http://localhost:3000/seed
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Project Structure

```
app/
├── api/            # API routes
├── auth/           # Authentication pages
├── cars/           # Car management pages
├── components/     # Reusable components
├── lib/           # Utilities and definitions
├── posts/         # Post management pages
└── ...
```

## Database Schema

- **users**: User accounts and profiles
- **cars**: Car catalog entries
- **posts**: Forum posts and discussions
- **comments**: Post comments
- **forum_stats**: Forum statistics and metrics

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Vercel](https://vercel.com) for hosting and database services
- [Bootstrap](https://getbootstrap.com/) for the UI components