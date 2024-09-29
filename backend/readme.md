# Fit-Mind AI Chatbot Backend

Fit-Mind AI is an advanced chatbot backend system that integrates various AI capabilities, including natural language processing, document processing, and WhatsApp integration.

## Features

- Natural language processing using OpenAI's GPT models
- Retrieval-Augmented Generation (RAG) system for enhanced responses
- Document processing and embedding using LangChain
- WhatsApp integration for chatbot functionality
- Spotify podcast processing and integration
- File upload and management for training data
- Content generation capabilities
- Fine-tuning support for AI models
- Voice cloning and text-to-speech using ElevenLabs

## System Architecture

The backend is structured as follows:

- `index.js`: Main entry point and API routes
- `utils/`: Utility functions for various operations
- `lib/`: External service integrations
- `config/`: Configuration management

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Supabase account and project
- OpenAI API key
- Spotify Developer account (for podcast features)
- WhatsApp  API access(optional)
- ElevenLabs API key (for voice features)

## Installation

1. Clone the repository:
   ```bash
   
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in a `.env` file (see Configuration section).

## Configuration

Create a `.env` file in the root directory with the following variables:

```
PORT=3000
OPENAI_API_KEY=your_openai_api_key
WHATSAPP_TOKEN=your_whatsapp_token
WABA_PHONE_ID=your_whatsapp_phone_id
VERIFY_TOKEN=your_verify_token
VOICE_ID=your_elevenlabs_voice_id
ELEVEN_LABS_API_KEY=your_elevenlabs_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

## Usage

Start the server:
```
npm start
```

The server will start on the port specified in your `.env` file (default is 3000).

## API Endpoints

### Chat

- **POST /api/chat**
  - Send a message to the chatbot
  - Example:
    ```json
    {
      "message": "What is the capital of France?"
    }
    ```

### Training Data Management

- **POST /api/upload-training**
  - Upload a file for training
  - Use multipart/form-data with a file field named "file"

- **DELETE /api/delete-training**
  - Delete a specific training file
  - Example:
    ```json
    {
      "fileId": "123456"
    }
    ```

- **DELETE /api/delete-all-training**
  - Delete multiple training files
  - Example:
    ```json
    {
      "ids": ["123456", "789012"]
    }
    ```

- **GET /api/get-all-training**
  - Retrieve all training data

### Podcast Processing

- **POST /api/podcast**
  - Process an uploaded podcast file
  - Use multipart/form-data with a file field named "file"

- **POST /api/download-podcast**
  - Download and process a Spotify podcast
  - Example:
    ```json
    {
      "episodeId": "spotify_episode_id"
    }
    ```

- **POST /api/get-podcast-info**
  - Get information about a Spotify podcast episode
  - Example:
    ```json
    {
      "episodeId": "spotify_episode_id"
    }
    ```

### URL Processing

- **POST /api/url**
  - Process a URL for content extraction
  - Example:
    ```json
    {
      "url": "https://example.com/article"
    }
    ```

### WhatsApp Integration

- **POST /api/whatsapp-chat**
  - Handle incoming WhatsApp messages
  - Example:
    ```json
    {
      "from": "whatsapp_number",
      "message": "Hello, chatbot!"
    }
    ```

- **POST /api/whatsapp-toggle**
  - Enable or disable WhatsApp bot
  - Example:
    ```json
    {
      "enable": true
    }
    ```

- **POST /api/whatsapp-instructions**
  - Set custom instructions for WhatsApp bot
  - Example:
    ```json
    {
      "instructions": "Respond in a friendly manner"
    }
    ```

- **GET /api/whatsapp-status**
  - Check the status of the WhatsApp bot

### System Instructions

- **POST /api/set-system-instruction**
  - Set system-wide instruction for the AI
  - Example:
    ```json
    {
      "instruction": "Always provide concise answers"
    }
    ```

### Content Generation

- **POST /api/generate-content**
  - Generate content based on parameters
  - Example:
    ```json
    {
      "title_or_topic": "Benefits of Exercise",
      "keywords": ["fitness", "health", "wellness"],
      "tone": "informative",
      "style": "blog post",
      "word_count": 500,
      "target_audience": "adults"
    }
    ```

### Fine-tuning

- **POST /api/finetune**
  - Create a fine-tuning job
  - Example:
    ```json
    {
      "model": "gpt-3.5-turbo",
      "training_file": "file_id",
      "validation_file": "file_id"
    }
    ```

- **GET /api/finetune-status**
  - Check the status of a fine-tuning job
  - Example:
    ```json
    {
      "job_id": "ft-123456"
    }
    ```

### Training File Preparation

- **POST /api/prepare-training**
  - Prepare a training file for fine-tuning
  - Use multipart/form-data with a file field named "file"

## Error Handling

The server uses a custom error handler middleware to manage and respond to errors consistently. All endpoints are protected by rate limiting to prevent abuse.

## Security

- CORS is configured to allow requests only from trusted origins.
- API rate limiting is implemented to prevent abuse.
- Sensitive operations should be protected with appropriate authentication mechanisms (not shown in this basic example).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.