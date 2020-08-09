import preset from "../preset/presets.js";
import {
  EDIT_NAME,
  EDIT_REG_FULL,
  EDIT_REG,
  EDIT_COUNTRY,
  EDIT_URL,
  EDIT_CLASS,
  EDIT_TEMPLATE,
  ERROR,
} from "../actions/types";
const initState = {
  template: preset.template,
  details: {
    name: "X_NAME_ABBR",
    regulator: "REG (CTRY)",
    country: "COUNTRY",
    regulator_full_name: "REGULATOR_FULL_NAME",
    main_url: "https://www.regulatorWebsite.com",
    class_name: "ScraperClass",
  },
  loading: null,
  error: null,
};
var template = null;

export default function (state = initState, action) {
  switch (action.type) {
    case EDIT_TEMPLATE:
      return {
        ...state,
        loading: false,
        template: action.payload,
      };
    case EDIT_NAME:
      template = state.template
        .split(` name = "${state.details.name}`)
        .join(` name = "${action.payload.name}`)
        .split(` sheet_name = "${state.details.name}`)
        .join(` sheet_name = "${action.payload.name}`);
      return {
        ...state,
        template,
        loading: false,
        details: action.payload,
      };
    case EDIT_CLASS:
      template = state.template
        .split(`class ${state.details.class_name}(scrapy.Spider):`)
        .join(`class ${action.payload.class_name}(scrapy.Spider):`);
      return {
        ...state,
        template,
        loading: false,
        details: action.payload,
      };
    case EDIT_COUNTRY:
      template = state.template
        .split(`country = "${state.details.country}"`)
        .join(`country = "${action.payload.country}"`);
      return {
        ...state,
        template,
        loading: false,
        details: action.payload,
      };
    case EDIT_REG:
      template = state.template
        .split(`regulator = "${state.details.regulator}"`)
        .join(`regulator = "${action.payload.regulator}"`);
      return {
        ...state,
        template,
        loading: false,
        details: action.payload,
      };
    case EDIT_REG_FULL:
      template = state.template
        .split(`regulator_full_name = "${state.details.regulator_full_name}"`)
        .join(`regulator_full_name = "${action.payload.regulator_full_name}"`);
      return {
        ...state,
        template,
        loading: false,
        details: action.payload,
      };
    case EDIT_URL:
      template = state.template
        .split(`main_url = "${state.details.main_url}"`)
        .join(`main_url = "${action.payload.main_url}"`);
      return {
        ...state,
        template,
        loading: false,
        details: action.payload,
      };
    case ERROR:
      return state;
    default:
      return state;
  }
}
