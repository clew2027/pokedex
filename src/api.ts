
export async function fetchData<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (response.ok) {
        return await response.json()
    } else {
        throw new Error(`Request failed with status ${response.status} ${response.statusText} for ${url}`);
    }
}



