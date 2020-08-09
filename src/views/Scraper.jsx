import React, { useState, useEffect } from "react";
import AceEditor from "react-ace";
import { connect } from "react-redux";
import { ScraperButton } from "../components/ScraperButtons";
import ScraperForm from "../components/ScraperForm";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import { editTemplate } from "../actions/details";
const Scraper = ({ template, editTemplate }) => {
  function onChange(newValue) {
    console.log("change", newValue);
  }
  const [value, setValue] = useState(template);
  const [newsButton, setNews] = useState(false);
  const [regButton, setReg] = useState(false);
  useEffect(() => {
    setValue(template);
    editTemplate(template);
  }, [template, setValue, editTemplate]);
  var temp;
  function handleClick(type) {
    if (type === "news") {
      setNews(!newsButton);
      temp = value.split("ItemType.REGULATION").join("ItemType.NEWS");
    } else if (type === "reg") {
      setReg(!regButton);
      temp = value.split("ItemType.NEWS").join("ItemType.REGULATION");
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
const mapStateToProps = (state) => {
  return {
    template: state.scraper.template,
  };
};

export default connect(mapStateToProps, { editTemplate })(Scraper);
