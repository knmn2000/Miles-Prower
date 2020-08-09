import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import AceEditor from "react-ace";
import preset from "../preset/presets.js";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import { FormButtons } from "./FormButtons";
import {
  editName,
  editClass,
  editCountry,
  editRegulator,
  editRegFull,
  editUrl,
} from "../actions/details";
import PropTypes from "prop-types";

const ScraperForm = ({
  open,
  editName,
  editClass,
  editCountry,
  editRegulator,
  editRegFull,
  editUrl,
  details,
}) => {
  const [editorCode, setEditorCode] = useState("#Template Code here");
  const [name, setName] = useState(details.name);
  const [regulator, setRegulator] = useState(details.regulator);
  const [country, setCountry] = useState(details.country);
  const [regFull, setRegFull] = useState(details.regulator_full_name);
  const [url, setUrl] = useState(details.main_url);
  const [scraperClass, setClass] = useState(details.class_name);
  function onChange(newValue) {
    console.log("change", newValue);
  }
  useEffect(() => {
    setName(name);
    setRegulator(regulator);
    setCountry(country);
    setRegFull(regFull);
    setUrl(url);
    setClass(scraperClass);
  }, [details, name, scraperClass, url, regFull, country, regulator]);

  function modifyName(value) {
    return editName(value);
  }
  function modifyRegulator(value) {
    return editRegulator(value);
  }
  function modifyCountry(value) {
    return editCountry(value);
  }
  function modifyRegFull(value) {
    return editRegFull(value);
  }
  function modifyUrl(value) {
    return editUrl(value);
  }
  function modifyClass(value) {
    return editClass(value);
  }
  return (
    <>
      <div className={open ? "slider slider-slide" : "slider"}>
        <div className="sidebar">
          <div className="sidebar-one">
            <form className="details">
              <h1 className="form-header">Scraper details</h1>
              <div className="form-grid">
                <div className="grid-one">
                  <input
                    name="name"
                    type="text"
                    placeholder="Name [R_ABC_XY1]"
                    className="input-field"
                    onChange={(e) => {
                      setName(e.target.value);
                      modifyName({
                        name: e.target.value,
                        regulator: regulator,
                        class_name: scraperClass,
                        regulator_full_name: regFull,
                        main_url: url,
                        country: country,
                      });
                    }}
                  />

                  <input
                    name="country"
                    type="text"
                    placeholder="Country"
                    className="input-field"
                    onChange={(e) => {
                      setCountry(e.target.value);
                      modifyCountry({
                        name: name,
                        regulator: regulator,
                        class_name: scraperClass,
                        regulator_full_name: regFull,
                        main_url: url,
                        country: e.target.value,
                      });
                    }}
                  />

                  <input
                    name="regulator_full_name"
                    type="text"
                    placeholder="Regulator full name"
                    className="input-field"
                    onChange={(e) => {
                      setRegFull(e.target.value);
                      modifyRegFull({
                        name: name,
                        regulator: regulator,
                        class_name: scraperClass,
                        regulator_full_name: e.target.value,
                        main_url: url,
                        country: country,
                      });
                    }}
                  />
                </div>
                <div className="grid-two">
                  <input
                    name="main url"
                    type="text"
                    placeholder="Main URL"
                    className="input-field"
                    onChange={(e) => {
                      setUrl(e.target.value);
                      modifyUrl({
                        name: name,
                        regulator: regulator,
                        class_name: scraperClass,
                        regulator_full_name: regFull,
                        main_url: e.target.value,
                        country: country,
                      });
                    }}
                  />

                  <input
                    name="reg"
                    type="text"
                    placeholder="regulator [REG (CTRY)]"
                    className="input-field"
                    onChange={(e) => {
                      setRegulator(e.target.value);
                      modifyRegulator({
                        name: name,
                        regulator: e.target.value,
                        class_name: scraperClass,
                        regulator_full_name: regFull,
                        main_url: url,
                        country: country,
                      });
                    }}
                  />

                  <input
                    name="classname"
                    type="text"
                    placeholder="Class name"
                    className="input-field"
                    onChange={(e) => {
                      setClass(e.target.value);
                      modifyClass({
                        name: name,
                        regulator: regulator,
                        class_name: e.target.value,
                        regulator_full_name: regFull,
                        main_url: url,
                        country: country,
                      });
                    }}
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="sidebar-two">
            <div className="form-buttons">
              <div onClick={() => setEditorCode(preset.selenium_imports)}>
                <FormButtons text="selenium imports" />
              </div>
              <div onClick={() => setEditorCode(preset.pagination)}>
                <FormButtons text="pagination" />
              </div>
              <div onClick={() => setEditorCode(preset.infinite_scrolling)}>
                <FormButtons text="infinite scrolling" />
              </div>
              <div onClick={() => setEditorCode(preset.html_response)}>
                <FormButtons text="HTML response" />
              </div>
            </div>
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
              value={editorCode}
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
ScraperForm.propTypes = {
  editName: PropTypes.func.isRequired,
  editCountry: PropTypes.func.isRequired,
  editRegulator: PropTypes.func.isRequired,
  editRegFull: PropTypes.func.isRequired,
  editUrl: PropTypes.func.isRequired,
  editClass: PropTypes.func.isRequired,
  details: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => {
  return {
    details: state.scraper.details,
  };
};
export default connect(mapStateToProps, {
  editName,
  editClass,
  editCountry,
  editRegulator,
  editRegFull,
  editUrl,
})(ScraperForm);
