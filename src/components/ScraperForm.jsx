import React from "react";
import AceEditor from "react-ace";
import preset from "../preset/presets.js";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
export const ScraperForm = ({ open }) => {
  function onChange(newValue) {
    console.log("change", newValue);
  }
  return (
    <>
      <div className={open ? "slider slider-slide" : "slider"}>
        <div className="sidebar">
          <div className="sidebar-one">
            <form className="details">
              <h1>Scraper details</h1>
              <div className="form-grid">
                <div className="grid-one">
                  <input
                    name="name"
                    type="text"
                    placeholder="Name [R_ABC_XY]"
                    className="input-field"
                  />

                  <input
                    name="country"
                    type="text"
                    placeholder="Country"
                    className="input-field"
                  />

                  <input
                    name="regulator_full_name"
                    type="text"
                    placeholder="Regulator full name"
                    className="input-field"
                  />
                </div>
                <div className="grid-two">
                  <input
                    name="main url"
                    type="text"
                    placeholder="Main URL"
                    className="input-field"
                  />

                  <input
                    name="reg"
                    type="text"
                    placeholder="regulator [REG (CTRY)]"
                    className="input-field"
                  />

                  <input
                    name="regulator_full_name"
                    type="text"
                    placeholder="Regulator full name"
                    className="input-field"
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="sidebar-two">
            add buttons, add clipboard copy, add test template.
            <AceEditor
              style={{
                height: "45vh",
                width: "100%",
              }}
              fontSize={14}
              mode="python"
              theme="monokai"
              onChange={onChange}
              wrapEnabled={true}
              name="SonicScraper"
              value={preset.selenium_imports}
              editorProps={{ $blockScrolling: true }}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
