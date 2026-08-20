export interface ApiClientOptions {
  baseUrl: string;
  fetchImplementation?: typeof fetch;
}

export class ApiClient {
  private readonly fetchImplementation: typeof fetch;

  constructor(private readonly options: ApiClientOptions) {
    this.fetchImplementation = options.fetchImplementation ?? fetch;
  }

  async get<TResponse>(path: string): Promise<TResponse> {
    const response = await this.fetchImplementation(
      `${this.options.baseUrl}${path}`,
      { headers: { Accept: 'application/json' } },
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return (await response.json()) as TResponse;
  }
}
