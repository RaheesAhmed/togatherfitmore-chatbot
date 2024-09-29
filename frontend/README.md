# Fit-Mind AI Chatbot Frontend

This is the frontend application for the Fit-Mind AI Chatbot, built with modern web technologies to provide a responsive and interactive user interface.

## Technologies Used

- **React**: A JavaScript library for building user interfaces
- **Next.js**: A React framework for production-grade applications
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript
- **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs
- **Shadcn UI**: A collection of re-usable components built with Radix UI and Tailwind CSS

## Project Structure

The frontend follows a typical Next.js project structure:

- `app/`: Contains the main pages and layout of the application
- `components/`: Reusable React components
  - `ui/`: UI components from Shadcn UI library
  - `chat-interface.tsx`: Main chat interface component
  - `content-generator.tsx`: Component for generating content
  - `finetune.tsx`: Component for fine-tuning AI models
  - `floating-chatbot.tsx`: Floating chat interface component
  - `manage-training-data.tsx`: Component for managing training data
  - `QRCodeHead.tsx`: Component for QR code generation
  - `settings.tsx`: Settings component
  - `training-data.tsx`: Component for uploading and managing training data
- `lib/`: Utility functions and custom hooks
- `public/`: Static assets like images and fonts

## Key Components

1. **ChatInterface**: The main chat interface for interacting with the AI.
2. **ContentGenerator**: Allows users to generate content based on various parameters.
3. **FineTuning**: Interface for fine-tuning AI models.
4. **FloatingChatbot**: A floating chat interface that can be toggled on and off.
5. **ManageTrainingData**: Component for viewing and managing uploaded training data.
6. **Settings**: Interface for configuring AI assistant settings.
7. **TrainingDataUpload**: Component for uploading various types of training data (files, URLs, podcasts).

## Getting Started

To run the frontend locally, follow these steps:

1. Clone the repository:
   ```
   
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following:
   ```
   NEXT_PUBLIC_URL=<backend-api-url>
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and visit `http://localhost:3000` to view the application.

## Available Scripts

- `npm run dev`: Starts the development server
- `npm run build`: Builds the app for production
- `npm start`: Runs the built app in production mode
- `npm run lint`: Lints the codebase using ESLint

## API Integration

The frontend interacts with the backend API for various functionalities:

- Chat messages
- Content generation
- Fine-tuning models
- Managing training data
- Uploading and processing different types of data (files, URLs, podcasts)

Make sure the `NEXT_PUBLIC_URL` environment variable is set correctly to point to your backend API.

## Styling

The project uses Tailwind CSS for styling, along with custom UI components from the Shadcn UI library. The components are highly customizable and can be adjusted in the `components/ui/` directory.

## Contributing

When contributing to the frontend, please ensure you follow the established coding standards and best practices. Make sure to write unit tests for new features and run the linter before submitting pull requests.

## License

This project is licensed under the ISC License.
