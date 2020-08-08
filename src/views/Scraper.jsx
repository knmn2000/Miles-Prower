import React, { useState } from "react";
import AceEditor from "react-ace";
import { ScraperButton } from "../components/ScraperButtons";
import { ScraperForm } from "../components/ScraperForm";
import preset from "../preset/presets.js";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

export const Scraper = () => {
  function onChange(newValue) {
    console.log("change", newValue);
  }
  const [value, setValue] = useState(preset.template);
  const [newsButton, setNews] = useState(false);
  const [regButton, setReg] = useState(false);
  var temp;
  function handleClick(type) {
    if (type === "news") {
      setNews(!newsButton);
      // temp = preset.template.split("R_NAME_ABBR").join("N_SCRAPER_XY"); // have identifiers setup in the preset and
      temp = preset.template.split("ItemType.REGULATION").join("ItemType.NEWS");
    } else if (type === "reg") {
      setReg(!regButton);
      // temp = preset.template.split("R_NAME_ABBR").join("R_SCRAPER_XY"); // have identifiers setup in the preset and
      temp = preset.template.split("ItemType.NEWS").join("ItemType.REGULATION");
    }
    setValue(temp);
  }
  return (
    <div className="editor">
      <AceEditor
        style={{
          height: "100vh",
          width: "40vw",
          zIndex: "999",
        }}
        fontSize={12}
        mode="python"
        theme="monokai"
        onChange={onChange}
        wrapEnabled={true}
        name="SonicScraper"
        value={value}
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
        }}
      />
      <div
        className={
          regButton || newsButton ? "customize customize-slide" : "customize"
        }
      >
        <div className="group">
          <div
            className={regButton ? "scraperBtn invisible" : "scraperBtn"}
            onClick={() => {
              if (!regButton) {
                handleClick("news");
              }
            }}
          >
            <ScraperButton text="News Scraper" />
          </div>
          <div
            className={newsButton ? "scraperBtn invisible" : "scraperBtn"}
            onClick={() => {
              if (!newsButton) {
                handleClick("reg");
              }
            }}
          >
            <ScraperButton text="Reg. Scraper" />
          </div>
        </div>
      </div>
      <ScraperForm open={regButton || newsButton ? true : false} />
    </div>
  );
};
