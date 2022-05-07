import { Component } from "react";
import * as React from "react";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import I18N from "../../base/I18N.js";
import ParliamentView from "../molecules/ParliamentView.js";

const STYLE = {
  backgroundColor: "lightgray",
};
const DEFAULT_LANG = "en";
const LANG_TO_LABEL = {
  si: "සිංහල",
  // ta: "தமிழ்",
  en: "English",
};

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedLang: DEFAULT_LANG };
    this.i18n = new I18N(DEFAULT_LANG);
  }
  render() {
    const { selectedLang } = this.state;
    return (
      <div>
        <AppBar position="static" sx={STYLE}>
          <Toolbar variant="dense">
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {this.i18n.t("Parliament of Sri Lanka")}
            </Typography>

            {Object.entries(LANG_TO_LABEL).map(
              function ([lang, label]) {
                const key = "button-" + lang;
                const color = selectedLang === lang ? "white" : "gray";

                const onClick = function (e) {
                  this.i18n.setLang(lang);
                  this.setState({ selectedLang: lang });
                }.bind(this);

                return (
                  <Button key={key} sx={{ color: color }} onClick={onClick}>
                    {label}
                  </Button>
                );
              }.bind(this)
            )}
          </Toolbar>
        </AppBar>
        <ParliamentView i18n={this.i18n} />
      </div>
    );
  }
}
