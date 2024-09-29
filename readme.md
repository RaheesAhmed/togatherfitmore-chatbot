# Fit-Mind AI Chatbot

Fit-Mind AI Chatbot is a comprehensive AI-powered chatbot system with advanced natural language processing capabilities, document handling, and various integrations. The project consists of a frontend built with modern web technologies and a backend that leverages powerful AI models and external services.

## Project Overview

- **Frontend**: A responsive and interactive user interface built with React, Next.js, and TypeScript.
- **Backend**: A robust server-side application that integrates various AI capabilities and external services.

## Key Features

- Natural language processing using OpenAI's GPT models
- Retrieval-Augmented Generation (RAG) system for enhanced responses
- Document processing and embedding using LangChain
- WhatsApp integration for chatbot functionality
- Spotify podcast processing and integration
- File upload and management for training data
- Content generation capabilities
- Fine-tuning support for AI models
- Voice cloning and text-to-speech using ElevenLabs


<div style="position: relative; padding-bottom: 56.22254758418741%; height: 0;"><iframe src="https://www.loom.com/embed/e0e9df15f05e4c08ad91a2800d495832?sid=adf27c7d-91a9-42b0-a785-9886c8eb4a02" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>

## Technologies Used

### Frontend
- React
- Next.js
- TypeScript
- Tailwind CSS
- Shadcn UI

### Backend
- Node.js
- Express.js
- OpenAI API
- LangChain
- Supabase
- WhatsApp API
- Spotify API
- ElevenLabs API

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/RaheesAhmed/togatherfitmore-chatbot.git
   cd togatherfitmore-chatbot
   ```

2. Set up the frontend:
   ```bash
   cd frontend
   npm install
   ```

3. Set up the backend:
   ```bash
   cd ../backend
   npm install
   ```

4. Configure environment variables:
   - Create a `.env.local` file in the frontend directory
   - Create a `.env` file in the backend directory
   (Refer to the respective README files for required variables)

5. Start the development servers:
   - Frontend: `npm run dev` (in the frontend directory)
   - Backend: `npm start` (in the backend directory)

## Project Structure

- `frontend/`: Contains the Next.js frontend application
- `backend/`: Contains the Node.js backend application
- `README.md`: This file, providing an overview of the entire project

## API Integration

The frontend interacts with the backend API for various functionalities. Ensure that the `NEXT_PUBLIC_URL` environment variable in the frontend is set correctly to point to your backend API.

## Contributing

Contributions to both frontend and backend are welcome. Please ensure you follow the established coding standards and best practices for each part of the project. Write unit tests for new features and run linters before submitting pull requests.

## License

This project is licensed under the ISC License.

For more detailed information about the frontend and backend, please refer to their respective README files in the `frontend/` and `backend/` directories.
