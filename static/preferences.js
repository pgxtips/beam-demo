$(document).ready(() => {
    const searchInput = $("#tagSearchInput");
    const tagButtons = $(".tagButton");
    const selectedTagsContainer = $("#selectedTagsContainer");
    const submitBtn = $("#submitBtn");

    const selectedTags = new Set();

    // toggle tag selection
    tagButtons.each(function () {
        const btn = $(this);
        btn.click(() => {
            const tag = btn.data("tag");
            if (selectedTags.has(tag)) {
                selectedTags.delete(tag);
            } else if (selectedTags.size < 10) {
                selectedTags.add(tag);
            }

            updateSelectedTags();
            submitBtn.prop("disabled", selectedTags.size < 3);
        });
    });

    // update selected tags UI
    function updateSelectedTags() {
        selectedTagsContainer.empty();

        selectedTags.forEach(tag => {
            const span = $("<span>")
                .addClass("selectedTag")
                .text(tag)
                .click(() => {
                    selectedTags.delete(tag);
                    updateSelectedTags();
                    submitBtn.prop("disabled", selectedTags.size < 3);
                });
            selectedTagsContainer.append(span);
        });
    }

    // filter tags on input
    searchInput.on("input", function () {
        const query = $(this).val().toLowerCase();
        tagButtons.each(function () {
            const btn = $(this);
            const tag = btn.data("tag").toLowerCase();
            btn.css("display", tag.includes(query) ? "inline-block" : "none");
        });
    });

    // submit selected preferences
    submitBtn.click(async () => {
        await submitPrefs(selectedTags);
    });
});

async function submitPrefs(tags){
    try {
        let session_id = getCookie("session_id")
        resetCookiesAndLocal()

        setCookie("session_id", session_id)

        const tagsArray = Array.from(tags);

        let fd = new FormData()
        fd.append("tags", tagsArray)

        const res = await fetch("/api/submit_preferences", { 
            method: "POST",
            body: fd
        });
        const data = await res.json();
        if (data.status == "200") window.location.reload()
    } catch(e) {
        console.log("error: ", e)
    }
}
