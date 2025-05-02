import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Navbar from "@/components/navbar.tsx";
import "@/styles/preferencesModal.css";

import { useSession } from '@/context/sessionContext.tsx';

import {getTags, submitTags} from "@/models/tags"
 

type PreferencesModalProps = {
  onPrefSubmit: (prefs: string[]) => void;
};


function PreferencesModal({ onPrefSubmit }: PreferencesModalProps) {
  const { sessionId } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [allTags, setAllTags] = useState<string[]>([]);
  const [hasInit, setHasInit] = useState<boolean>(false)

  const [submitEnabled, setSubmitEnabled] = useState<boolean>(false);

  const filteredTags = allTags.filter(
    (tag) =>
      tag.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedTags.includes(tag)
  );

  const toggleSelectTag = (tag: string) => {
    
    setSelectedTags((prev) =>{
        const newTags = prev.includes(tag) 
            ? prev.filter((t) => t !== tag) 
            : [...prev, tag];

        setSubmitEnabled(
            (newTags.length >= 3 && newTags.length <= 10)
        )
        return newTags
    });
  };

  const submitPreferences = () => {
      Cookies.set("preferences", JSON.stringify(selectedTags));
      submitTags(sessionId, selectedTags).then((res) => {
          console.log(res)
          onPrefSubmit(selectedTags);
      })
  };

  useEffect(() => {
      if (hasInit) return;
      getTags().then((res) => {
          setAllTags(res.tags)
          setHasInit(true)
      })
  })

  return (
    <>
      <Navbar sessionId="" />
      <div className="pm_modalOverlay">
        <div className="pm_modalContent">
          <h2>Select Preferences</h2>
          <span style={{marginBottom: "5px"}}>Select between 3 - 10 preference tags</span>

          <input
            type="text"
            placeholder="Search tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pm_tagSearchInput"
          />

          <div className="pm_tagListContainer">
          {!hasInit ? (
              <div className="pm_loader">Loading tags...</div>
          ) : (
          filteredTags.map((tag) => (
              <button
              key={tag}
              className="pm_tagButton"
              onClick={() => toggleSelectTag(tag)}
              >
              {tag}
              </button>
          ))
          )}
          </div>

          <div className="pm_selectedTags">
            <h4>Selected Tags:</h4>
            <div className="pm_selectedTagList">
              {selectedTags.map((tag) => (
                <span key={tag} className="pm_selectedTag" onClick={() => toggleSelectTag(tag)}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <button disabled={!submitEnabled} onClick={submitPreferences} className="pm_submitButton">
            Submit
          </button>
        </div>
      </div>
    </>
  );
}

export default PreferencesModal;
