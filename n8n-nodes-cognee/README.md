# n8n-nodes-cognee

This is an n8n community node for integrating with [Cognee](https://cognee.ai), an AI memory engine that creates knowledge graphs from your data.

[Cognee](https://cognee.ai) is an AI memory engine that transforms unstructured data into structured knowledge graphs, enabling intelligent search, insights, and AI-powered workflows.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Community Nodes (Recommended)

1. Go to **Settings > Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-cognee`
4. Agree to the risks and select **Install**

### Manual Installation

To get started install the package in your n8n root directory:

```bash
npm install n8n-nodes-cognee
```

For Docker-based deployments add the following line before the font installation command in your n8n Dockerfile:

```dockerfile
RUN cd /usr/local/lib/node_modules/n8n && npm install n8n-nodes-cognee
```

## Credentials

You'll need to configure Cognee API credentials:

1. **Base URL**: The URL of your Cognee API instance (default: `http://localhost:8000`)
2. **API Key**: Your Cognee API authentication token (JWT Bearer token)

### Getting Your API Key

1. Start your Cognee server
2. Use the authentication endpoint to get a JWT token:
   ```bash
   curl -X POST "http://localhost:8000/api/v1/auth/login" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "username=your_email&password=your_password"
   ```
3. Use the returned `access_token` as your API Key in n8n

## Operations

### Add Content
Add text content to your Cognee knowledge graph.

**Parameters:**
- **Content**: The text content to add
- **Dataset Name**: Name of the dataset (optional)
- **Dataset ID**: UUID of the dataset (optional)

### Cognify
Process your data into a structured knowledge graph.

**Parameters:**
- **Dataset Names**: Comma-separated list of dataset names to process
- **Dataset IDs**: Comma-separated list of dataset UUIDs to process  
- **Run in Background**: Whether to run processing asynchronously

### Search
Search your knowledge graph for relevant information.

**Parameters:**
- **Query**: Your search query
- **Search Type**: Type of search (Graph Completion, RAG Completion, Insights, etc.)
- **Dataset Names**: Datasets to search within (optional)
- **Dataset IDs**: Dataset UUIDs to search within (optional)
- **Top K**: Maximum number of results to return

## Node Versions

This package includes two node implementations:

1. **Cognee**: Full programmatic implementation with custom logic
2. **Cognee (Declarative)**: Simplified declarative implementation using n8n's routing system

Both nodes provide the same functionality - choose based on your preference.

## Example Workflow

Here's a simple workflow to get started:

1. **Add Content**: Use the "Add Content" operation to add text to your knowledge graph
2. **Cognify**: Process the data using the "Cognify" operation
3. **Search**: Query your knowledge graph using the "Search" operation

## Environment Variables

Make sure your Cognee server has the following environment variables configured:

- `LLM_API_KEY`: Your LLM provider API key (OpenAI, etc.)
- `FASTAPI_USERS_JWT_SECRET`: Secret for JWT token generation
- `CORS_ALLOWED_ORIGINS`: Allowed CORS origins (include your n8n instance)

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Cognee Documentation](https://docs.cognee.ai)
- [Cognee GitHub Repository](https://github.com/cognee-dev/cognee)

## License

[MIT](https://github.com/cognee-dev/n8n-nodes-cognee/blob/master/LICENSE.md)
