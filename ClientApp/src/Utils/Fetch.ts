async function http<T>(path : string, config : RequestInit) : Promise<T>{
  const baseUrl = window.location.origin;
  const fullPath = `${baseUrl}/${path}`;

  const request = new Request(fullPath, config);
  const response = await fetch(request);

  if(!response.ok){
      const msg = `${request.method} ${request.url} ${response.status}`; 
      throw new Error(msg);
    }

  return response.json();
}

export async function get<T>(path : string, config?: RequestInit) : Promise<T>{
  const init = { method : 'get', ...config }
  return await http<T>(path, init);
}

export async function post<T, U>(path: string, body : T, config : RequestInit | null = null) : Promise<U>{
  if(config === null)
      config = { headers : { 'Content-Type' : 'application/json' } };
      
  const init = {method : 'post', body : JSON.stringify(body),  ...config}
  return await http<U>(path, init);
}

export async function put<T, U>(path: string, body : T, config : RequestInit | null = null) : Promise<U>{
  if(config === null)
      config = { headers : { 'Content-Type' : 'application/json' } };
  const init = {method : 'put', body :JSON.stringify(body), ...config}
  return await http<U>(path, init);
}

export async function deleteData<T>(path : string, config? : RequestInit) : Promise<T>{
  const init = {method : 'delete', ...config}
  return await http<T>(path, init);
}

