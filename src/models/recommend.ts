type recommendData = {
    status: string
    recommendations: string[]
}

async function recommend(sessionId: string) {
    const env_endpoint = import.meta.env.VITE_BEAM_ENDPOINT;
    const endpoint = env_endpoint + "/external/recommend";

    const formData = new FormData();
    formData.append("session_id", sessionId);

    const req = await fetch(endpoint, { method: "POST", body: formData })
    const data: recommendData = await req.json() 

    return data
}


window.recommend = recommend;

export default recommend;
