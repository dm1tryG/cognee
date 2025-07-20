import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

export class CogneeDeclarative implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cognee (Declarative)',
		name: 'cogneeDeclarative',
		icon: 'file:cognee.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Cognee Memory API using declarative routing',
		defaults: {
			name: 'Cognee (Declarative)',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'cogneeApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}',
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Memory',
						value: 'memory',
					},
				],
				default: 'memory',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['memory'],
					},
				},
				options: [
					{
						name: 'Add',
						value: 'add',
						description: 'Add content to knowledge graph',
						action: 'Add content to memory',
						routing: {
							request: {
								method: 'POST',
								url: '/api/v1/add',
								headers: {
									'Content-Type': 'multipart/form-data',
								},
							},
						},
					},
					{
						name: 'Cognify',
						value: 'cognify',
						description: 'Process data into knowledge graph',
						action: 'Process data with cognify',
						routing: {
							request: {
								method: 'POST',
								url: '/api/v1/cognify',
							},
							send: {
								property: 'body',
								value: '={{ { "datasets": $parameter.datasets ? $parameter.datasets.split(",").map(d => d.trim()) : undefined, "dataset_ids": $parameter.datasetIds ? $parameter.datasetIds.split(",").map(d => d.trim()) : undefined, "run_in_background": $parameter.runInBackground } }}',
							},
						},
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search the knowledge graph',
						action: 'Search memory',
						routing: {
							request: {
								method: 'POST',
								url: '/api/v1/search',
							},
							send: {
								property: 'body',
								value: '={{ { "query": $parameter.query, "search_type": $parameter.searchType, "datasets": $parameter.searchDatasets ? $parameter.searchDatasets.split(",").map(d => d.trim()) : undefined, "dataset_ids": $parameter.searchDatasetIds ? $parameter.searchDatasetIds.split(",").map(d => d.trim()) : undefined, "top_k": $parameter.topK } }}',
							},
						},
					},
				],
				default: 'add',
			},
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['add'],
					},
				},
				default: '',
				description: 'Content to add to the knowledge graph',
				required: true,
			},
			{
				displayName: 'Dataset Name',
				name: 'datasetName',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['add'],
					},
				},
				default: '',
				description: 'Name of the dataset to add content to',
			},
			{
				displayName: 'Dataset ID',
				name: 'datasetId',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['add'],
					},
				},
				default: '',
				description: 'ID of the dataset to add content to',
			},
			{
				displayName: 'Datasets',
				name: 'datasets',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['cognify'],
					},
				},
				default: '',
				description: 'Comma-separated list of dataset names to cognify',
			},
			{
				displayName: 'Dataset IDs',
				name: 'datasetIds',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['cognify'],
					},
				},
				default: '',
				description: 'Comma-separated list of dataset IDs to cognify',
			},
			{
				displayName: 'Run in Background',
				name: 'runInBackground',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['cognify'],
					},
				},
				default: true,
				description: 'Whether to run the cognify process in the background',
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['search'],
					},
				},
				default: '',
				description: 'Search query',
				required: true,
			},
			{
				displayName: 'Search Type',
				name: 'searchType',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['search'],
					},
				},
				options: [
					{
						name: 'Graph Completion',
						value: 'GRAPH_COMPLETION',
					},
					{
						name: 'RAG Completion',
						value: 'RAG_COMPLETION',
					},
					{
						name: 'Insights',
						value: 'INSIGHTS',
					},
					{
						name: 'Chunks',
						value: 'CHUNKS',
					},
					{
						name: 'Summaries',
						value: 'SUMMARIES',
					},
				],
				default: 'GRAPH_COMPLETION',
				description: 'Type of search to perform',
			},
			{
				displayName: 'Search Datasets',
				name: 'searchDatasets',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['search'],
					},
				},
				default: '',
				description: 'Comma-separated list of dataset names to search',
			},
			{
				displayName: 'Search Dataset IDs',
				name: 'searchDatasetIds',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['search'],
					},
				},
				default: '',
				description: 'Comma-separated list of dataset IDs to search',
			},
			{
				displayName: 'Top K',
				name: 'topK',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['search'],
					},
				},
				default: 10,
				description: 'Maximum number of results to return',
			},
		],
	};
}
