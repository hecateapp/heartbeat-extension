interface IRequestOptions {
  headers?: object;
  method?: string;
  body?: string;
}

export default class API {
  constructor(token: string) {
    this.apiToken = token;
  }

  private apiToken: string;
  private apiHost: string = "http://localhost:4567";

  private fetchJson(path: string, options: IRequestOptions = {}): Promise<any> {
    return fetch(`${this.apiHost}${path}`, {
      ...options,
      headers: {
        Authorization: `Token token="${this.apiToken}"`,
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers
      }
    }).then(resp => {
      if (!resp.ok) {
        throw new Error(resp.status.toString());
      }
      return resp.json();
    });
  }

  logView(prPath: string): Promise<{ rating: number }> {
    return this.fetchJson("/heartbeat/view", {
      method: "POST",
      body: JSON.stringify({ pr_path: prPath })
    });
  }

  setRating(prPath: string, rating: number): Promise<{ rating: number }> {
    return this.fetchJson("/heartbeat/set_rating", {
      method: "POST",
      body: JSON.stringify({ pr_path: prPath, rating: rating })
    });
  }
}
