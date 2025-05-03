async function getSession(){
    try {
        // first clear old cookies and localStorage
        resetCookiesAndLocal()

        const res = await fetch("/api/create_session", { method: "GET" });
        const data = await res.json();
        if (data.status == "200") window.location.reload()
    } catch(e) {
        console.log("error: ", e)
    }
}
