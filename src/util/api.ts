interface IRequestOptions {
  headers?: object;
  method?: string;
  body?: string;
}

const apiHost = "http://localhost:4567";

const fetchJson = (path: string, options: IRequestOptions = {}) : Promise<any> => {
  return fetch(`${apiHost}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers
    }
  })
    .then(resp => {
      if (!resp.ok) {
        throw new Error(resp.status.toString());
      }
      return resp.json();
    });
};

export const logView = (prPath: string) : Promise<{rating: number}> => {
    return fetchJson("/heartbeat/view", {
        body: JSON.stringify({"pr_path": prPath,})
    });
}
