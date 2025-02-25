webix.protoUI({
    name: "codemirror-merge-editor",
    defaults: {
        mode: "javascript",
        lineNumbers: true,
        matchBrackets: true,
        theme: "default",
        highlightDifferences: true,
        connect: "align",
        collapseIdentical: false,
    },
    $init: function (config) {
        this._waitEditor = webix.promise.defer();
        this.$ready.push(this._render_cm_editor);
    },
    complex_types: {
        php: {
            mode: ["xml", "javascript", "css", "htmlmixed", "clike"],
        },
        htmlembedded: {
            mode: ["xml", "javascript", "css", "htmlmixed"],
            addon: ["mode/multiplex"],
        },
        htmlmixed: {
            mode: ["xml", "javascript", "css"],
        },
        dockerfile: {
            addon: ["mode/simple"],
        },
    },
    _render_cm_editor: function () {

        if (this.config.cdn === false) {
            this._render_when_ready();
            return;
        }

        const cdn = this.config.cdn || "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.48.4/";
        // basic
        const sources = [
            cdn + "/codemirror.css",
            cdn + "/codemirror.js",
            // merge add-on
            // This addon depends on the google-diff-match-patch library to compute the diffs
            cdn + "/addon/merge/merge.css",
            cdn + "/addon/merge/merge.js",
            "https://cdnjs.cloudflare.com/ajax/libs/diff_match_patch/20121119/diff_match_patch.js",
        ];

        // mode
        const mode = this.config.mode ? this.config.mode : "javascript";
        // complex modes based on others: htmlmixed, htmlembedded, php
        const extras = this.complex_types[mode];
        if (extras) {
            if (extras["mode"]) {
                extras["mode"].forEach(function (name) {
                    const path = "/mode/" + name + "/" + name + ".js";
                    sources.push(cdn + path);
                });
            }
            if (extras["addon"]) {
                extras["addon"].forEach(function (name) {
                    const path = "/addon/" + name + ".js";
                    sources.push(cdn + path);
                });
            }
        }
        sources.push(cdn + "/mode/" + mode + "/" + mode + ".js");

        // theme
        if (this.config.theme && this.config.theme !== "default") {
            sources.push(cdn + "/theme/" + this.config.theme + ".css");
        }

        // matchbrackets add-on
        if (this.config.matchBrackets) {
            sources.push(cdn + "/addon/edit/matchbrackets.js");
        }

        webix.require(sources)
            .then(webix.bind(this._render_when_ready, this))
            .catch(function (e) {
                console.log(e);
            });
    },
    _render_when_ready: function () {
        this._editor = CodeMirror.MergeView(this.$view, {
            value: "",
            orig: "",
            origLeft: null, //2 panes by default
            lineNumbers: this.config.lineNumbers,
            mode: this.config.mode,
            highlightDifferences: this.config.highlightDifferences,
            connect: this.config.connect,
            collapseIdentical: this.config.collapseIdentical,
        });

        this._waitEditor.resolve(this._editor);

        this._editorLeft = this._editor.editor();
        this._editorRight = this._editor.rightOriginal();

        this.setValues(this.config.value);
        if (this._focus_await) this.focus();
    },
    setValues: function (value) {
        if (!value) {
            value = { editorLeft: "", editorRight: "" };
        }
        this.config.value = value;
        if (this._editor) {
            this._editorLeft.setValue(value.editorLeft || "");
            this._editorRight.setValue(value.editorRight || "");
            //by default - clear editor's undo history when setting new value
            if (!this.config.preserveUndoHistory) {
                this._editorLeft.clearHistory();
                this._editorRight.clearHistory();
            }
        }
    },
    getValues: function () {
        if (this._editor) {
            const data = {
                editorLeft: this._editorLeft.getValue(),
                editorRight: this._editorRight.getValue(),
            };
            return data;
        }
        return this.config.value;
    },
    focus: function () {
        this._focus_await = true;
        if (this._editor && this._editorLeft) this._editorLeft.focus();
    },
    getEditor: function (waitEditor) {
        return waitEditor ? this._waitEditor : this._editor;
    },
}, webix.ui.view);
