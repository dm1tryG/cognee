import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

export class Cognee implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cognee',
		name: 'cognee',
		icon: 'file:cognee.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Cognee AI memory engine',
		defaults: {
			name: 'Cognee',
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
				Accept: 'application/json',
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
						name: 'Add Content',
						value: 'add',
						description: 'Add content to the knowledge graph',
						action: 'Add content to memory',
					},
					{
						name: 'Cognify',
						value: 'cognify',
						description: 'Process data into knowledge graph',
						action: 'Process data with cognify',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search the knowledge graph',
						action: 'Search memory',
					},
				],
				default: 'add',
			},

			// Add Content Operation
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['memory'],
						operation: ['add'],
					},
				},
				default: '',
				description: 'The content to add to the knowledge graph',
				required: true,
			},
			{
				displayName: 'Dataset Name',
				name: 'datasetName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['memory'],
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
						resource: ['memory'],
						operation: ['add'],
					},
				},
				default: '',
				description: 'UUID of the dataset to add content to',
			},

			// Cognify Operation
			{
				displayName: 'Dataset Names',
				name: 'datasets',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['memory'],
						operation: ['cognify'],
					},
				},
				default: '',
				description: 'Comma-separated list of dataset names to process',
			},
			{
				displayName: 'Dataset IDs',
				name: 'datasetIds',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['memory'],
						operation: ['cognify'],
					},
				},
				default: '',
				description: 'Comma-separated list of dataset UUIDs to process',
			},
			{
				displayName: 'Run in Background',
				name: 'runInBackground',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['memory'],
						operation: ['cognify'],
					},
				},
				default: false,
				description: 'Whether to run the cognify process in the background',
			},

			// Search Operation
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['memory'],
						operation: ['search'],
					},
				},
				default: '',
				description: 'The search query',
				required: true,
			},
			{
				displayName: 'Search Type',
				name: 'searchType',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['memory'],
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
					{
						name: 'Code',
						value: 'CODE',
					},
					{
						name: 'Cypher',
						value: 'CYPHER',
					},
				],
				default: 'GRAPH_COMPLETION',
				description: 'Type of search to perform',
			},
			{
				displayName: 'Dataset Names',
				name: 'searchDatasets',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['memory'],
						operation: ['search'],
					},
				},
				default: '',
				description: 'Comma-separated list of dataset names to search within',
			},
			{
				displayName: 'Dataset IDs',
				name: 'searchDatasetIds',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['memory'],
						operation: ['search'],
					},
				},
				default: '',
				description: 'Comma-separated list of dataset UUIDs to search within',
			},
			{
				displayName: 'Top K',
				name: 'topK',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['memory'],
						operation: ['search'],
					},
				},
				default: 10,
				description: 'Maximum number of results to return',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'memory') {
					if (operation === 'add') {
						const content = this.getNodeParameter('content', i) as string;
						const datasetName = this.getNodeParameter('datasetName', i) as string;
						const datasetId = this.getNodeParameter('datasetId', i) as string;

						if (!datasetName && !datasetId) {
							throw new NodeOperationError(
								this.getNode(),
								'Either Dataset Name or Dataset ID must be provided',
								{ itemIndex: i },
							);
						}

						const formData = new (globalThis as any).FormData();
						const blob = new (globalThis as any).Blob([content], { type: 'text/plain' });
						formData.append('data', blob, 'content.txt');
						
						if (datasetName) {
							formData.append('datasetName', datasetName);
						}
						if (datasetId) {
							formData.append('datasetId', datasetId);
						}

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'cogneeApi',
							{
								method: 'POST',
								url: '/api/v1/add',
								body: formData,
								headers: {
									'Content-Type': 'multipart/form-data',
								},
							},
						);

						returnData.push({
							json: response,
							pairedItem: { item: i },
						});

					} else if (operation === 'cognify') {
						const datasets = this.getNodeParameter('datasets', i) as string;
						const datasetIds = this.getNodeParameter('datasetIds', i) as string;
						const runInBackground = this.getNodeParameter('runInBackground', i) as boolean;

						if (!datasets && !datasetIds) {
							throw new NodeOperationError(
								this.getNode(),
								'Either Dataset Names or Dataset IDs must be provided',
								{ itemIndex: i },
							);
						}

						const body: any = {
							run_in_background: runInBackground,
						};

						if (datasets) {
							body.datasets = datasets.split(',').map(d => d.trim());
						}
						if (datasetIds) {
							body.dataset_ids = datasetIds.split(',').map(d => d.trim());
						}

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'cogneeApi',
							{
								method: 'POST',
								url: '/api/v1/cognify',
								body,
							},
						);

						returnData.push({
							json: response,
							pairedItem: { item: i },
						});

					} else if (operation === 'search') {
						const query = this.getNodeParameter('query', i) as string;
						const searchType = this.getNodeParameter('searchType', i) as string;
						const searchDatasets = this.getNodeParameter('searchDatasets', i) as string;
						const searchDatasetIds = this.getNodeParameter('searchDatasetIds', i) as string;
						const topK = this.getNodeParameter('topK', i) as number;

						const body: any = {
							query,
							search_type: searchType,
							top_k: topK,
						};

						if (searchDatasets) {
							body.datasets = searchDatasets.split(',').map(d => d.trim());
						}
						if (searchDatasetIds) {
							body.dataset_ids = searchDatasetIds.split(',').map(d => d.trim());
						}

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'cogneeApi',
							{
								method: 'POST',
								url: '/api/v1/search',
								body,
							},
						);

						if (Array.isArray(response)) {
							for (const result of response) {
								returnData.push({
									json: typeof result === 'object' ? result : { result },
									pairedItem: { item: i },
								});
							}
						} else {
							returnData.push({
								json: typeof response === 'object' ? response : { result: response },
								pairedItem: { item: i },
							});
						}
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error instanceof Error ? error.message : String(error) },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
