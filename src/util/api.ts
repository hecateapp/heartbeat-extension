interface IRequestOptions {
  headers?: object;
  method?: string;
  body?: string;
}

const apiHost: string = "https://api.hecate.co";

function fetchJson(
  apiKey: string,
  path: string,
  options: IRequestOptions = {}
): Promise<any> {
  console.log("about to fetch", path);  
  return fetch(`${apiHost}${path}`, {
    ...options,
    headers: {
      Authorization: `Token token="${apiKey}"`,
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

export function logView(
  apiKey: string,
  prPath: string
): Promise<{ rating: number }> {
  return fetchJson(apiKey, "/heartbeat/view", {
    method: "POST",
    body: JSON.stringify({ pr_path: prPath })
  });
}

export function setRating(
  apiKey: string,
  prPath: string,
  rating: number
): Promise<{ rating: number }> {
  return fetchJson(apiKey, "/heartbeat/set_rating", {
    method: "POST",
    body: JSON.stringify({ pr_path: prPath, rating: rating })
  });
}

export function testToken(apiKey: string): Promise<{ helo: boolean }> {
  return fetchJson(apiKey, "/heartbeat/helo");
}
