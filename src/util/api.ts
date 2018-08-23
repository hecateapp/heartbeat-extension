interface IRequestOptions {
  headers?: object;
  method?: string;
  body?: string;
}

// TODO something
const apiHost = "http://localhost:4567";
const apiToken = "api_key_testing";

const fetchJson = (
  path: string,
  options: IRequestOptions = {}
): Promise<any> => {
  return fetch(`${apiHost}${path}`, {
    ...options,
    headers: {
      Authorization: `Token token="${apiToken}"`,
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
};

export const logView = (prPath: string): Promise<{ rating: number }> => {
  return fetchJson("/heartbeat/view", {
    method: "POST",
    body: JSON.stringify({ pr_path: prPath })
  });
};

export const setRating = (
  prPath: string,
  rating: number
): Promise<{ rating: number }> => {
  return fetchJson("/heartbeat/set_rating", {
    method: "POST",
    body: JSON.stringify({ pr_path: prPath, rating: rating })
  });
};
