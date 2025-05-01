type tagData = {
    status: string
    tags: string[]
}

export async function getTags() {
    const env_endpoint = import.meta.env.VITE_BEAM_ENDPOINT;
    const endpoint = env_endpoint + "/external/get_tags";

    const req = await fetch(endpoint, { method: "GET" })
    const data: tagData = await req.json() 

    return data
}

export async function submitTags(session_id: string, tags: string[]) {
    const env_endpoint = import.meta.env.VITE_BEAM_ENDPOINT;
    const endpoint = env_endpoint + "/external/post/preferences";

    const formData = new FormData();
    formData.append("session_id", session_id)
    formData.append("tags", tags)

    const req = await fetch(endpoint, { method: "POST", body: formData})
    const data: tagData = await req.json() 

    return data
}
